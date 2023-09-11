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
import setupSendRandomEmailCron from "./cron-jobs/send-random-email-cron.js";
import sendMonthlyStatusCron from "./cron-jobs/send-monthly-status-cron.js";

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
// app.use(cors());
var whitelist = [
  "http://localhost:3000",
  "http://localhost:3000/dashboard",
  "http://127.0.0.1:3000",
  "https://app.phishstops.com",
];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
connectDB();

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
setupSendRandomEmailCron();
sendMonthlyStatusCron();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const options = {
  key: fs.readFileSync(path.join(__dirname, "./certificates/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "./certificates/cert.pem")),
};
const sslServer = https.createServer(options, app);
sslServer.listen(PORT, () => {
  console.log(`Secure server is listening oN PORT - ${PORT}`);
});
