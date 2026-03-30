'use client'

import { useState, useEffect } from "react"
import { collection, getDocs, doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { firestore } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography, Switch } from "@mui/material"
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [darkMode, setDarkMode] = useState(true)

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'))
    const inventoryList = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data()
    }))
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    if (!item) return
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const getIcon = (name) => {
    const item = name.toLowerCase()
    if (item.includes("milk")) return "🥛"
    if (item.includes("rice")) return "🍚"
    if (item.includes("chips")) return "🍟"
    if (item.includes("water")) return "💧"
    return "📦"
  }

  const filteredItems = inventory
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    .filter(i => filter === 'all' ? true : i.quantity <= 2)

  return (
    <Box
      width="100%"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      px={2}
      py={3}
      sx={{
        background: darkMode
          ? "linear-gradient(135deg, #1e1e2f, #2b5876)"
          : "linear-gradient(135deg, #f5f7fa, #c3cfe2)"
      }}
    >

      {/* TOP CONTROLS */}
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ bgcolor: 'white', borderRadius: 2 }}
        />

        <Button onClick={() => setFilter('all')}>All</Button>
        <Button onClick={() => setFilter('low')}>Low Stock</Button>

        <Stack direction="row" alignItems="center">
          <Typography>🌙</Typography>
          <Switch
            checked={!darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <Typography>☀️</Typography>
        </Stack>
      </Stack>

      {/* ADD BUTTON */}
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Item
      </Button>

      {/* TITLE */}
      <Typography variant="h4" color={darkMode ? "white" : "black"}>
        Inventory Items
      </Typography>

      {/* LIST */}
      <Stack width="100%" maxWidth="700px" maxHeight="60vh" spacing={2} overflow="auto">
        {filteredItems.map(({ name, quantity }) => {
          const lowStock = quantity <= 2

          return (
            <Box
              key={name}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding={2}
              sx={{
                borderRadius: '16px',
                background: lowStock
                  ? 'linear-gradient(135deg, #ff4d4d, #ff9999)'
                  : 'linear-gradient(135deg, #4f46e5, #6d5dfc)',
                color: 'white',
                animation: `${fadeIn} 0.5s ease`,
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.2)'
                }}>
                  {getIcon(name)}
                </Box>

                <Typography>{name}</Typography>
              </Stack>

              <Typography>{quantity}</Typography>

              <Stack direction="row" spacing={1}>
                <Button onClick={() => addItem(name)}>+</Button>
                <Button onClick={() => removeItem(name)} color="error">−</Button>
              </Stack>
            </Box>
          )
        })}
      </Stack>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          p={3}
          sx={{
            transform: "translate(-50%, -50%)",
            background: 'white',
            borderRadius: '12px'
          }}
        >
          <TextField
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            onClick={() => {
              addItem(itemName)
              setItemName('')
              setOpen(false)
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>

    </Box>
  )
}
