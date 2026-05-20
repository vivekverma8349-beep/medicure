import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  age: Number,

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },

  phone: String,

  bloodGroup: String,

  city: String,

  profileImage: String

}, {
  timestamps: true
})

export default mongoose.model('User', userSchema)