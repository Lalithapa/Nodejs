import { createServer } from "node:http";
import fs from 'fs/promises';
import url from 'url';
import path from 'path';
const PORT = process.env.PORT || 8000;

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

let users = [
    { id:1 , name:"lalit" },
    { id:2 , name:"Thapa" },
    { id:3 , name:"Makeup" },
    { id:4 , name:"revoltion" }
]


const server = createServer( (req, res) => {
    // /api/users/1
    const getUserId = req.url.split('/');
    const userNumber = getUserId[3];
  try {
    if (req.method === 'GET' && req.url === "/api/users" ) {
        res.setHeader("Content-Type", "text/json" );
        res.write(JSON.stringify(users));
        res.end();
    } else if (req.method === 'GET' && req.url.match(/^\/api\/users\/(\d+)$/)) {
        res.setHeader("Content-Type", "text/json" );
        res.write(JSON.stringify(users.find((list)=> list.id == userNumber )) || "No User Found");
        res.end();
    }
    else {
        res.setHeader("Content-Type", "text/json" );
        res.statusCode = 404;
        res.write(JSON.stringify({ message:"Route Not Found"}));
        res.end();
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
