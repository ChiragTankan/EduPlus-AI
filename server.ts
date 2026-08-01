import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT,
    module_id TEXT,
    PRIMARY KEY (user_id, module_id)
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    module_name TEXT,
    issued_at TEXT,
    UNIQUE(user_id, module_name)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
  app.get("/api/progress/:userId", (req, res) => {
    const { userId } = req.params;
    if (!userId || userId === "undefined" || userId === "null") {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    const rows = db.prepare("SELECT module_id FROM user_progress WHERE user_id = ?").all(userId) as { module_id: string }[];
    res.json(rows.map(r => r.module_id));
  });

  app.post("/api/progress", (req, res) => {
    const { userId, moduleId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });
    try {
      db.prepare("INSERT OR IGNORE INTO user_progress (user_id, module_id) VALUES (?, ?)").run(userId, moduleId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save progress" });
    }
  });

  app.get("/api/certificates/:userId", (req, res) => {
    const { userId } = req.params;
    if (!userId || userId === "undefined" || userId === "null") {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    const rows = db.prepare("SELECT * FROM certificates WHERE user_id = ?").all(userId);
    res.json(rows);
  });

  app.post("/api/certificates", (req, res) => {
    const { userId, moduleName } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });
    try {
      const existing = db.prepare("SELECT * FROM certificates WHERE user_id = ? AND module_name = ?").get(userId, moduleName);
      if (existing) {
        return res.json({ success: true, alreadyExists: true });
      }

      const info = db.prepare("INSERT INTO certificates (user_id, module_name, issued_at) VALUES (?, ?, ?)").run(
        userId,
        moduleName,
        new Date().toISOString()
      );
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to issue certificate" });
    }
  });

  // Gemini AI Proxy Route
  app.get("/api/ai", (req, res) => {
    res.json({ message: "Gemini AI Proxy is active. Use POST to interact." });
  });

  app.post("/api/ai", async (req, res) => {
    const { prompt, isJson } = req.body;

    console.log(`[Gemini Proxy] Received request. Prompt length: ${prompt?.length}, isJson: ${isJson}`);

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: isJson ? { responseMimeType: "application/json" } : undefined,
      });

      res.json({ content: response.text });
    } catch (error: any) {
      console.error("Gemini Proxy Error:", error);
      res.status(500).json({ 
        error: "Gemini API Error", 
        details: error?.message || String(error) 
      });
    }
  });

  // API 404 handler - must be before Vite/Static middleware
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
