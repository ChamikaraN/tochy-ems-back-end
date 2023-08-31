import mongoose from "mongoose";

const emailSchema = mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    templateid: {
      type: String,
      required: true,
    },
    employeename: {
      type: String,
    },
    business: {
      type: String,
      required: false,
    },
    employeeid: {
      type: String,
      required: true,
    },
    envelope: {
      from: String,
    },
    to: String,
    seen: {
      type: Boolean,
      default: false,
    },
    smtpInfo: {
      host: String,
      port: Number,
      service: String,
      auth: {
        user: String,
        pass: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);

export default Email;
