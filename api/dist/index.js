"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const morgan = require('morgan');
const statusMonitor = require('express-status-monitor');
const app = express();
const port = 3000;
const { combine, timestamp, json } = winston.format;
const logger = winston.createLogger({
    level: 'http',
    format: combine(timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }), json()),
    transports: [new winston.transports.Console()],
});
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: (message) => logger.http(message.trim()),
    },
});
app.use(cors());
app.use(morganMiddleware);
app.use(statusMonitor()); // enable status monitor
app.get('/status', (req, res) => { }); // expose status endpoint
// 🔐 API Key Auth Middleware
app.use((req, res, next) => {
    // const key = req.header('x-api-key');
    // if (!key || key !== process.env.API_KEY) {
    //   return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    // }
    // req.apiKey = key; // pass key forward
    next();
});
// 🛡 Rate Limiter: Per API Key (100 requests/hour)
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100,
    keyGenerator: (req, res) => req.apiKey || req.ip,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Rate limit exceeded: Max 100 requests per hour'
    }
});
app.use(limiter);
// 📄 Upload config (memory only)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf')
            cb(null, true);
        else
            cb(new Error('Only PDF files are allowed'), false);
    }
});
// 🌐 Third-party API endpoint from .env
const THIRD_PARTY_API_URL = process.env.THIRD_PARTY_API_URL;
// 📤 Upload Endpoint
app.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file)
            return res.status(400).json({ error: 'No PDF file uploaded' });
        const data = yield pdfParse(req.file.buffer);
        const text = data.text;
        console.log(text);
        // const apiResponse = await axios.post(THIRD_PARTY_API_URL, { content: text });
        res.json({
            message: 'PDF processed and forwarded',
            text: text
            // thirdPartyResponse: apiResponse.data
        });
    }
    catch (error) {
        console.error('[Upload Error]', error.message);
        res.status(500).json({ error: 'Error processing file' });
    }
}));
app.listen(port, () => {
    console.log(`🚀 API running at http://localhost:${port}`);
});
