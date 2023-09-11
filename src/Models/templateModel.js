import mongoose from "mongoose";

const templateSchema = mongoose.Schema(
  {
    business: {
      id: {type: String},
      name: { type: String },
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    emailfrom: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    image: { type: String, default: null },
    imagePublicId: [
      {
        url: { type: String },
        publicId: { type: String },
        required: false,
      },
    ],

    body: {
      type: String,
    },
    publicAccess: {
      type: Boolean, default: false
    },
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model("Template", templateSchema);

export default Template;
