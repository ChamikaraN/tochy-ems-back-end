import mongoose from 'mongoose'

const selectedTemplateSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    templateid: { type: String, required: true },
    
  },
  {
    timestamps: true,
  }
)
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    businessname: {
      type: String,
      default: null,
    },
    domainname: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    
    description: {
      type: String,
    },
    address: {
      type: String,
      default: null,
    },
    
    isAdmin: {
      type: Boolean,
     
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
     
      default: 'business',
    },
    txtdnsrndstring: {
      type: String,
      default: null,
    },
    txtdnsverifystring: {
      type: Boolean,
      default: false,
    },
    selectedTemplate:[selectedTemplateSchema]
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User