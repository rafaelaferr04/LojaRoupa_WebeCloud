/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { products } from '../data/storeData.js'

const StoreContext = createContext(null)

const sessionKey = 'atelier-wec-session'
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000'

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function normalizeUser(user) {
  return {
    _id: user._id,
    name: user.name || user.email,
    email: normalizeEmail(user.email),
    password: user.password,
    cart: Array.isArray(user.cart) ? user.cart : [],
    favorites: Array.isArray(user.favorites) ? user.favorites : [],
  }
}

function createOrderId() {
  return `WEC-${Date.now()}`
}

function createOrderDate() {
  return new Date().toISOString()
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Erro ao comunicar com a API.')
  }

  return response.json()
}

export function useStore() {
  return useContext(StoreContext)
}

export function StoreProvider({ children }) {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(() => readStorage(sessionKey, null))
  const [guestCart, setGuestCart] = useState([])

  const currentUser = users.find((storedUser) => storedUser.email === user) ?? null
  const cart = currentUser?.cart ?? guestCart
  const favorites = currentUser?.favorites ?? []

  useEffect(() => {
    async function loadUsers() {
      try {
        const apiUsers = await apiRequest('/users')
        setUsers(Array.isArray(apiUsers) ? apiUsers.map(normalizeUser) : [])
      } catch {
        setUsers([])
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    async function loadOrders() {
      if (!currentUser) {
        setOrders([])
        return
      }

      try {
        const apiOrders = await apiRequest(`/orders?userEmail=${encodeURIComponent(currentUser.email)}`)
        setOrders(Array.isArray(apiOrders) ? apiOrders : [])
      } catch {
        setOrders([])
      }
    }

    loadOrders()
  }, [currentUser?.email])

  useEffect(() => {
    if (user) {
      localStorage.setItem(sessionKey, JSON.stringify(user))
      return
    }

    localStorage.removeItem(sessionKey)
  }, [user])

  async function updateUser(email, updates) {
    const storedUser = users.find((candidate) => candidate.email === email)

    if (!storedUser?._id) {
      return null
    }

    const userToSave = normalizeUser({ ...storedUser, ...updates(storedUser) })

    setUsers((currentUsers) =>
      currentUsers.map((candidate) =>
        candidate.email === email ? userToSave : candidate,
      ),
    )

    const savedUser = await apiRequest(`/users/${userToSave._id}`, {
      method: 'PATCH',
      body: JSON.stringify(userToSave),
    })

    const normalizedUser = normalizeUser(savedUser)

    setUsers((currentUsers) =>
      currentUsers.map((storedUser) =>
        storedUser.email === email ? normalizedUser : storedUser,
      ),
    )

    return normalizedUser
  }

  async function register({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email)

    if (users.some((storedUser) => storedUser.email === normalizedEmail)) {
      return { ok: false, error: 'Este utilizador ja existe.' }
    }

    try {
      const createdUser = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          cart: [],
          favorites: [],
          orders: [],
        }),
      })

      setUsers((currentUsers) => [...currentUsers, normalizeUser(createdUser)])
      setUser(normalizedEmail)

      return { ok: true }
    } catch {
      return { ok: false, error: 'Nao foi possivel criar a conta.' }
    }
  }

  async function login(email, password) {
    const normalizedEmail = normalizeEmail(email)
    const storedUser = users.find(
      (candidate) => candidate.email === normalizedEmail && candidate.password === password,
    )

    if (!storedUser) {
      return { ok: false, error: 'Credenciais invalidas.' }
    }

    setUser(normalizedEmail)

    return { ok: true }
  }

  function logout() {
    setUser(null)
  }

  function saveCart(nextCart) {
    if (currentUser) {
      updateUser(currentUser.email, () => ({ cart: nextCart }))
      return
    }

    setGuestCart(nextCart)
  }

  function addToCart(product, size) {
    const itemKey = `${product.id}-${size}`
    const nextCart = cart.some((item) => item.itemKey === itemKey)
      ? cart.map((item) =>
          item.itemKey === itemKey ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [
          ...cart,
          {
            itemKey,
            productId: product.id,
            name: product.name,
            price: product.price,
            priceValue: product.priceValue,
            image: product.image,
            imageAlt: product.imageAlt,
            size,
            quantity: 1,
          },
        ]

    saveCart(nextCart)
  }

  function removeFromCart(itemKey) {
    saveCart(cart.filter((item) => item.itemKey !== itemKey))
  }

  function updateCartQuantity(itemKey, quantity) {
    const quantityNumber = Math.max(1, Number(quantity))

    saveCart(
      cart.map((item) =>
        item.itemKey === itemKey ? { ...item, quantity: quantityNumber } : item,
      ),
    )
  }

  function clearCart() {
    saveCart([])
  }

  async function placeOrder({ items, total }) {
    if (!currentUser || items.length === 0) {
      return null
    }

    const order = {
      id: createOrderId(),
      userEmail: currentUser.email,
      createdAt: createOrderDate(),
      total,
      items: items.map((item) => ({
        itemKey: item.itemKey,
        productId: item.productId,
        name: item.name,
        price: item.price,
        priceValue: item.priceValue,
        image: item.image,
        imageAlt: item.imageAlt,
        size: item.size,
        quantity: item.quantity,
      })),
    }

    await updateUser(currentUser.email, () => ({ cart: [] }))

    try {
      const savedOrder = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      })

      setOrders((currentOrders) => [savedOrder, ...currentOrders])
    } catch {
      setOrders((currentOrders) => [order, ...currentOrders])
    }

    return order
  }

  async function requestReturn({ orderId, itemKey }) {
    if (!currentUser) {
      return { ok: false, error: 'Inicie sessao para solicitar uma devolucao.' }
    }

    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            items: order.items.map((item) =>
              item.itemKey === itemKey
                ? {
                    ...item,
                    returnRequestedAt: new Date().toISOString(),
                  }
                : item,
            ),
          }
        : order,
    )

    const updatedOrder = updatedOrders.find((order) => order.id === orderId)
    setOrders(updatedOrders)

    if (updatedOrder?._id) {
      await apiRequest(`/orders/${updatedOrder._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedOrder),
      })
    }

    return { ok: true }
  }

  async function toggleFavorite(productId) {
    if (!currentUser) {
      return {
        ok: false,
        error: 'Para adicionar produtos aos favoritos, inicie sessao na sua conta.',
      }
    }

    const nextFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId]

    await updateUser(currentUser.email, () => ({ favorites: nextFavorites }))

    return { ok: true }
  }

  function clearFavorites() {
    if (currentUser) {
      updateUser(currentUser.email, () => ({ favorites: [] }))
    }
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const favoriteProducts = products.filter((product) => favorites.includes(product.id))

  const value = {
    user,
    currentUser,
    orders,
    login,
    register,
    logout,
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    requestReturn,
    favorites,
    favoriteCount: favorites.length,
    favoriteProducts,
    isFavorite: (productId) => favorites.includes(productId),
    toggleFavorite,
    clearFavorites,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
