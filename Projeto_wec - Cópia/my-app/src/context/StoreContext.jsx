/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { products } from '../data/storeData.js'

const StoreContext = createContext(null)

const usersKey = 'atelier-wec-users'
const sessionKey = 'atelier-wec-session'

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
    name: user.name || user.email,
    email: normalizeEmail(user.email),
    password: user.password,
    cart: Array.isArray(user.cart) ? user.cart : [],
    favorites: Array.isArray(user.favorites) ? user.favorites : [],
  }
}

export function useStore() {
  return useContext(StoreContext)
}

export function StoreProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = readStorage(usersKey, [])
    return Array.isArray(savedUsers) ? savedUsers.map(normalizeUser) : []
  })
  const [user, setUser] = useState(() => readStorage(sessionKey, null))
  const [guestCart, setGuestCart] = useState([])

  const currentUser = users.find((storedUser) => storedUser.email === user) ?? null
  const cart = currentUser?.cart ?? guestCart
  const favorites = currentUser?.favorites ?? []

  useEffect(() => {
    localStorage.setItem(usersKey, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (user) {
      localStorage.setItem(sessionKey, JSON.stringify(user))
      return
    }

    localStorage.removeItem(sessionKey)
  }, [user])

  function updateUser(email, updates) {
    setUsers((currentUsers) =>
      currentUsers.map((storedUser) =>
        storedUser.email === email ? { ...storedUser, ...updates(storedUser) } : storedUser,
      ),
    )
  }

  function register({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email)

    if (users.some((storedUser) => storedUser.email === normalizedEmail)) {
      return { ok: false, error: 'Este utilizador ja existe.' }
    }

    setUsers([
      ...users,
      {
        name: name.trim(),
        email: normalizedEmail,
        password,
        cart: [],
        favorites: [],
      },
    ])
    setUser(normalizedEmail)

    return { ok: true }
  }

  function login(email, password) {
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

  function toggleFavorite(productId) {
    if (!currentUser) {
      return {
        ok: false,
        error: 'Para adicionar produtos aos favoritos, inicie sessao na sua conta.',
      }
    }

    const nextFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId]

    updateUser(currentUser.email, () => ({ favorites: nextFavorites }))

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
    login,
    register,
    logout,
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    favorites,
    favoriteCount: favorites.length,
    favoriteProducts,
    isFavorite: (productId) => favorites.includes(productId),
    toggleFavorite,
    clearFavorites,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
