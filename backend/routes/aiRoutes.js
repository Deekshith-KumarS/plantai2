import express from "express";
import router from "../routes/aiRoutes.js";

const app = express();
app.use(router);

// BF-4: Rewritten to ESM — was using require() which crashes with "type": "module"
// This file is kept for reference but the /api/chat route now lives in server.js