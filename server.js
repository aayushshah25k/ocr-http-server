// server.js
import express from "express";
import multer from "multer";
import fetch from "node-fetch";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Replace with your OCR.Space API key
const OCR_API_KEY = "YOUR_OCR_SPACE_API_KEY";

// Home route
app.get("/", (req, res) => {
  res.send("✅ OCR Server is running. POST an image to /upload");
});

// Upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded");
    }

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: OCR_API_KEY,
      },
      body: (() => {
        const form = new FormData();
        form.append("language", "eng");
        form.append("isOverlayRequired", "false");
        form.append("file", req.file.buffer, "image.jpg");
        return form;
      })(),
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("OCR request failed");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
