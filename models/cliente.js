import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telephone: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  online: {
    type: Boolean,
    required: true
  },
  activeSubscription: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: String,
    enum: ['basic', 'premium', 'platinum', null],
    default: null
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  password: {
     type: String,
     required: true
  },
  role: {
    type: String,
    default: null
  }
})

export default mongoose.model('Cliente', clienteSchema);