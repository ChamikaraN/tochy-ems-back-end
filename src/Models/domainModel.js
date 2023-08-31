import mongoose from 'mongoose'

const domainSchema = mongoose.Schema(
  {
    
    ownerid: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    domainName: {
      type: String,
      required: true,
        
      },
    isPrimaryDomain: {
      type: String,
      required: false,
        
      },
    
    isVerified: {
      type: Boolean,
      default:false,
    },
    isVerifyReqSent: {
      type: Boolean,
      default:false,
    },

    txtrecord: {
        type: String,
        default: null,
      },
    
  },
  {
    timestamps: true,
  }
)

const Domain = mongoose.model('Domain', domainSchema)

export default Domain