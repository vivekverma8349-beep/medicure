import ChatSession from '../models/ChatSession.js'
import gemini from '../config/gemini.js'

/*
  CREATE NEW CHAT
*/

const createChat = async (req, res) => {

  try {

    const chat = await ChatSession.create({

      user: req.user._id,

      title: 'New Chat',

      messages: []

    })

    res.status(201).json({
      success: true,
      chat
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

/*
  GET ALL USER CHATS
*/

const getUserChats = async (req, res) => {

  try {

    const chats = await ChatSession.find({
      user: req.user._id
    }).sort({ updatedAt: -1 })

    res.status(200).json({
      success: true,
      chats
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

/*
  GET SINGLE CHAT
*/

const getSingleChat = async (req, res) => {

  try {

    const chat = await ChatSession.findById(
      req.params.chatId
    )

    if (!chat) {

      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      })
    }

    res.status(200).json({
      success: true,
      chat
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

/*
  SEND MESSAGE
*/

const sendMessage = async (req, res) => {

  try {

    const { message } = req.body

    const chat = await ChatSession.findById(
      req.params.chatId
    )

    if (!chat) {

      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      })
    }

    // SAVE USER MESSAGE

    chat.messages.push({
      role: 'user',
      content: message
    })

    // GEMINI RESPONSE

    const prompt = chat.messages
      .map(
        msg =>
          `${msg.role}: ${msg.content}`
      )
      .join('\n')

    const result = await gemini.generateContent(
      prompt
    )

    const reply =
      result.response.text()

    // SAVE AI MESSAGE

    chat.messages.push({
      role: 'assistant',
      content: reply
    })

    // AUTO TITLE

    if (
      chat.title === 'New Chat'
      &&
      message.length > 0
    ) {

      chat.title =
        message.substring(0, 30)
    }

    await chat.save()

    res.status(200).json({
      success: true,
      reply,
      chat
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

/*
  DELETE CHAT
*/

const deleteChat = async (req, res) => {

  try {

    const chat = await ChatSession.findById(
      req.params.chatId
    )

    if (!chat) {

      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      })
    }

    await chat.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Chat deleted'
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export {
  createChat,
  getUserChats,
  getSingleChat,
  sendMessage,
  deleteChat
}