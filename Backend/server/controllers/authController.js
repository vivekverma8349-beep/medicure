import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      age,
      gender,
      phone,
      bloodGroup,
      city,
      profileImage
    } = req.body

    // CHECK USER EXISTS

    const userExists = await User.findOne({ email })

    if (userExists) {

      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    )

    // CREATE USER

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      phone,
      bloodGroup,
      city,
      profileImage
    })

    // RESPONSE

    res.status(201).json({
      success: true,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        city: user.city,
        profileImage: user.profileImage
      },

      token: generateToken(user._id)
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (
      user &&
      await bcrypt.compare(password, user.password)
    ) {

      res.status(200).json({
        success: true,

        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          phone: user.phone,
          bloodGroup: user.bloodGroup,
          city: user.city,
          profileImage: user.profileImage
        },

        token: generateToken(user._id)
      })

    } else {

      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export {
  registerUser,
  loginUser
}