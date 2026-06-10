/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { normalizeApiProduct } from '../data/storeData.js'

const StoreContext = createContext(null)

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
    username: user.username,
    name: user.name || user.email,
    email: normalizeEmail(user.email),
    confirmed: user.confirmed,
    role: user.role,
    newsletterSubscribed: Boolean(user.newsletterSubscribed),
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

function sortOrdersByDate(ordersToSort) {
  return [...ordersToSort].sort(
    (firstOrder, secondOrder) =>
      new Date(secondOrder.createdAt).getTime() - new Date(firstOrder.createdAt).getTime(),
  )
}

async function apiRequest(path, options = {}) {
  const token = (() => { try { return JSON.parse(localStorage.getItem('atelier-wec-token')) } catch { return null } })()
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [productSales, setProductSales] = useState({})
  const [currentUser, setCurrentUser] = useState(() => readStorage('atelier-wec-user', null))
  const [token, setToken] = useState(() => readStorage('atelier-wec-token', null))
  const [guestCart, setGuestCart] = useState([])

  const currentUserEmail = currentUser?.email
  const cart = currentUser?.cart ?? guestCart
  const favorites = currentUser?.favorites ?? []

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiRequest('/api/v1/products?limit=1000')
        const normalized = (data.products ?? []).map(normalizeApiProduct)
        setProducts(normalized)
      } catch {
        setProducts([])
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    async function loadProductSales() {
      try {
        const apiSales = await apiRequest('/api/v1/products/sales')
        const salesMap = Object.fromEntries(
          apiSales.map((sale) => [
            String(sale.productId),
            { totalSales: sale.totalSales ?? 0, weeklySales: sale.weeklySales ?? 0 },
          ]),
        )
        setProductSales(salesMap)
      } catch {
        setProductSales({})
      }
    }

    loadProductSales()
  }, [])

  useEffect(() => {
    async function loadOrders() {
      if (!currentUserEmail) {
        setOrders([])
        return
      }

      try {
        const apiOrders = await apiRequest(`/orders?userEmail=${encodeURIComponent(currentUserEmail)}`)
        setOrders(Array.isArray(apiOrders) ? sortOrdersByDate(apiOrders) : [])
      } catch {
        setOrders([])
      }
    }

    loadOrders()
  }, [currentUserEmail])

  useEffect(() => {
    if (currentUser) localStorage.setItem('atelier-wec-user', JSON.stringify(currentUser))
    else localStorage.removeItem('atelier-wec-user')
  }, [currentUser])

  useEffect(() => {
    if (token) localStorage.setItem('atelier-wec-token', token)
    else localStorage.removeItem('atelier-wec-token')
  }, [token])

  async function updateUser(updates) {
    if (!currentUser?._id) return null
    const userToSave = normalizeUser({ ...currentUser, ...updates(currentUser) })
    setCurrentUser(userToSave)
    const savedUser = await apiRequest(`/users/${userToSave._id}`, {
      method: 'PATCH',
      body: JSON.stringify(userToSave),
    })
    const normalized = normalizeUser(savedUser)
    setCurrentUser(normalized)
    return normalized
  }

  async function register({ name, email, password }) {
    try {
      await apiRequest('/api/v1/user/signup', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: normalizeEmail(email), password }),
      })
      return { ok: true }
    } catch (error) {
      return { ok: false, error: 'Não foi possível criar a conta.' }
    }
  }

  async function login(email, password) {
    try {
      const result = await apiRequest('/api/v1/user/login', {
        method: 'POST',
        body: JSON.stringify({ email: normalizeEmail(email), password }),
      })
      setToken(result.token)
      setCurrentUser(normalizeUser(result.user))
      return { ok: true }
    } catch (error) {
      let message = 'Credenciais inválidas.'
      try {
        const parsed = JSON.parse(error.message)
        if (parsed.error) message = parsed.error
      } catch {}
      return { ok: false, error: message }
    }
  }

  function logout() {
    setCurrentUser(null)
    setToken(null)
  }

  function saveCart(nextCart) {
    if (currentUser) {
      updateUser(() => ({ cart: nextCart }))
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

    await updateUser(() => ({ cart: [] }))

    try {
      const savedOrder = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      })

      setOrders((currentOrders) => sortOrdersByDate([savedOrder, ...currentOrders]))
    } catch {
      setOrders((currentOrders) => sortOrdersByDate([order, ...currentOrders]))
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
    const updatedItem = updatedOrder?.items.find((item) => item.itemKey === itemKey)
    setOrders(sortOrdersByDate(updatedOrders))

    if (updatedOrder?._id) {
      await apiRequest(`/orders/${updatedOrder._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedOrder),
      })
    }

    await apiRequest('/api/v1/returns', {
      method: 'POST',
      body: JSON.stringify({
        userEmail: currentUser.email,
        orderId,
        itemKey,
        productId: updatedItem?.productId,
        productName: updatedItem?.name,
      }),
    })

    return { ok: true }
  }

  async function subscribeNewsletter() {
    if (!currentUser) {
      return {
        ok: false,
        error: 'Para subscrever a newsletter, inicie sessao na sua conta.',
      }
    }

    try {
      const result = await apiRequest('/api/v1/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: currentUser.email }),
      })

      await updateUser(() => ({ newsletterSubscribed: true }))

      return { ok: true, emailSent: result.emailSent }
    } catch {
      return { ok: false, error: 'Nao foi possivel subscrever a newsletter.' }
    }
  }

  async function cancelNewsletter() {
    if (!currentUser) {
      return { ok: false, error: 'Inicie sessao na sua conta.' }
    }

    try {
      await apiRequest('/api/v1/newsletter/cancel', {
        method: 'POST',
        body: JSON.stringify({ email: currentUser.email }),
      })

      await updateUser(() => ({ newsletterSubscribed: false }))

      return { ok: true }
    } catch {
      return { ok: false, error: 'Nao foi possivel cancelar a newsletter.' }
    }
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

    await updateUser(() => ({ favorites: nextFavorites }))

    return { ok: true }
  }

  function clearFavorites() {
    if (currentUser) {
      updateUser(() => ({ favorites: [] }))
    }
  }

  const withSalesData = useCallback((productsToRead) => {
    return productsToRead.map((product) => ({
      ...product,
      totalSales: productSales[String(product.id)]?.totalSales ?? product.totalSales ?? 0,
      weeklySales: productSales[String(product.id)]?.weeklySales ?? product.weeklySales ?? 0,
    }))
  }, [productSales])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const favoriteProducts = withSalesData(products).filter((product) => favorites.includes(String(product.id)))

  const value = {
    currentUser,
    products,
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
    subscribeNewsletter,
    cancelNewsletter,
    withSalesData,
    favorites,
    favoriteCount: favorites.length,
    favoriteProducts,
    isFavorite: (productId) => favorites.includes(String(productId)),
    toggleFavorite,
    clearFavorites,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
