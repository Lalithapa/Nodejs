import { createServer } from "node:http";
import fs from 'fs/promises';
import url from 'url';
import path from 'path';
const PORT = process.env.PORT || 8000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = createServer(async (req, res) => {
  try {
    let filePath;
    if (req.method === 'GET') {
      if (req.url === '/') {
        filePath = path.join(__dirname, "public", "index.html");
      } else if (req.url === '/about') {
        filePath = path.join(__dirname, "public", "about.html");
      } else {
        filePath = path.join(__dirname, "public", "404.html");
        // res.writeHead(404, { "Content-Type": "text/html" });
        // res.end("<h1>Page Not Found</h1>");
        //return;
      }

      const data = await fs.readFile(filePath);
      res.setHeader("Content-Type", "text/html");
      res.write(data);
      res.end();
    } else {
      throw new Error("Method not Allowed");
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening on ${PORT}`);
});
