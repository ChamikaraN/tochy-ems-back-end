import express from "express";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./DatabaseConnect/connectDB.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from "cors";
import multer from "multer";
import cron from "node-cron";
// import { getAllBusinessList } from './controllers/userController.js'
import { emailFunc } from "./utils/email/email.js";
import { deleteEmail } from "./controllers/productController.js";
import { sendVerificationEmail } from "./utils/email/emailVerification.js";

const storage = multer.diskStorage({});

let upload = multer({ storage });

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
app.use(cors());

// my comment
// var whitelist = [
//   "http://localhost:3000",
//   "http://localhost:3000/dashboard",
//   "http://127.0.0.1:3000",
//   "https://app.phishstops.com",
// ];
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (whitelist.indexOf(req.header("Origin")) !== -1) {
//     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };
// app.use(cors(corsOptionsDelegate));
// my comment

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
connectDB();

// cron.schedule('0 0 1 * *', () => { // Every month and then randomly for each reciever

cron.schedule("35 * * * *", () => {
  //test check
  console.log("--------------------------------------------------\n\n");
  // console.log('Cron Task - READ - Time: ' + (new Date()));
  emailFunc();
  console.log("--------------------------------------------------");
});

// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
//   emailFunc();
// });

// emailFunc()

// deleteEmail()

app.get("/", (req, res) => {
  res.json("API server running");
});
app.get("/emailseen", (req, res) => {
  res.send("<h1>Email seen successfully!!</h1>");
});

app.use("/api/template", upload.single("image"), productRoutes);
app.use("/api/user", userRoutes);
// app.use('/api/business', businessRoutes)
app.use("/api/employee", employeeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/domain", domainRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// my comment
// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

// const options = {
//   key: fs.readFileSync(path.join(__dirname, "./certificates/key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "./certificates/cert.pem")),
// };
// const sslServer = https.createServer(options, app);
// sslServer.listen(PORT, () => {
//   console.log(`Secure server is listening oN PORT - ${PORT}`);
// });
// my comment

sendVerificationEmail();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
