import express from "express";
import { createServer } from "http";
import logger from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();
const storage = multer.memoryStorage(); // Store files in memory (you can change this)
const upload = multer({ storage: storage });

const app = express();
// const server = createServer(app);

//Setup Http-Logger Morgan Middleware
app.use(logger('dev'));

//Setup CORS Middleware for Handling CORS Errors
app.use(cors());

//Import llmModelRoute Routes
import llmModelRoute from "../api/routes/llm-model.js";

//Setup Body-Parser & Cookie-Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());

//Handling CORS Erros
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Access, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.get('/health', async (req, res) => {
	console.log("ok! Health Check.")
  res.send({message: 'OK! Health Check.'});
})
//Route for Items
app.use('/api', upload.single('speechFile'), llmModelRoute);

//Setup Port & Listening to Server
const port = process.env.PORT || 4600;
app.listen(port, () => console.log(`server openai running on port ${port}!!`));

export default app;