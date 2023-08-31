import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const productSchema = mongoose.Schema(
  {
    
    seller: {
      id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
      name: { type: String, required: true },
      image: { type: String}
    },
    name: {
      type: String,
      required: true,
    },
    image: [
      {type: String,
      }
    ],
    imagePublicId: [
      {
        url:{type: String},
        publicId:{type: String}
      }
    ],
    model: {
      type: String,
      default: 'unspecified',
    },
    category:[ {
      type: String,
      required: true,
    }],
    fullDescription: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    countSale: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
 
)

productSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});


const Product = mongoose.model('Product', productSchema)

export default Product