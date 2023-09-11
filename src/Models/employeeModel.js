import mongoose from "mongoose";

const employeeSchema = mongoose.Schema(
  {
    business: {
      id: { type: String },
      name: { type: String },
    },
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    image: {
      type: String,

      default: null,
    },
    phone: {
      type: String,
    },

    description: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "employee",
    },
    nextmaildate: {
      type: Date,
    },
    mailsent: {
      type: Number,
      default: 0,
    },
    mailopened: {
      type: Number,
      default: 0,
    },
    txtdnsrndstring: {
      type: String,
      default: null,
    },
    txtdnsverifystring: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
