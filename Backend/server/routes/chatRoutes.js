import express from 'express'

import {
  createChat,
  getUserChats,
  getSingleChat,
  sendMessage,
  deleteChat
} from '../controllers/chatController.js'

import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// CREATE CHAT

router.post(
  '/new',
  protect,
  createChat
)

// GET ALL CHATS

router.get(
  '/',
  protect,
  getUserChats
)

// GET SINGLE CHAT

router.get(
  '/:chatId',
  protect,
  getSingleChat
)

// SEND MESSAGE

router.post(
  '/:chatId/message',
  protect,
  sendMessage
)

// DELETE CHAT

router.delete(
  '/:chatId',
  protect,
  deleteChat
)

export default router