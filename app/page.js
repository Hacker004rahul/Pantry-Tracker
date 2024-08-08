'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material"
import { doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`

const changeBackground = keyframes`
  0% {
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
  }
  25% {
    background: linear-gradient(45deg, #FF8E53 30%, #FFD700 90%);
  }
  50% {
    background: linear-gradient(45deg, #FFD700 30%, #00FF00 90%);
  }
  75% {
    background: linear-gradient(45deg, #00FF00 30%, #00BFFF 90%);
  }
  100% {
    background: linear-gradient(45deg, #00BFFF 30%, #FE6B8B 90%);
  }
`

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'))
    const inventoryList = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data()
    }))
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
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
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        animation: `${changeBackground} 20s infinite linear`,
        backgroundImage: 'url("/texture-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
            animation: `${fadeIn} 0.5s ease-in-out`,
            backgroundImage: 'url("/modal-texture.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{
                animation: `${pulse} 1s infinite`,
                backgroundImage: 'url("/button-texture.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          animation: `${pulse} 2s infinite`,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            transform: 'scale(1.05)'
          },
          backgroundImage: 'url("/button-texture.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        Add New Item
      </Button>
      <Box border='1px solid #333' />
      <Box
        width='800px'
        height="100px"
        bgcolor="#ADD8E6"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          animation: `${fadeIn} 1s ease-in-out`,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
            transform: 'translateX(-100%)',
            animation: `${fadeIn} 1s infinite linear`
          }
        }}
      >
        <Typography variant="h2" color="#333">Inventory Items</Typography>
      </Box>
      <Stack width='800px' height="300px" spacing={2} overflow="auto">
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width='100%'
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f0f0f0"
            padding={5}
            sx={{
              animation: `${fadeIn} 1s ease-in-out`,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.02)'
              },
              backgroundImage: 'url("/item-texture.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <Typography variant='h3' color='#333' textAlign='center'>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant='h3' color='#333' textAlign='center'>
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => addItem(name)}
                sx={{
                  animation: `${fadeIn} 1s ease-in-out`,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.05)'
                  },
                  backgroundImage: 'url("/button-texture.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
                sx={{
                  animation: `${fadeIn} 1s ease-in-out`,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.05)'
                  },
                  backgroundImage: 'url("/button-texture.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
