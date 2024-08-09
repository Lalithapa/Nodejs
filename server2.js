"use strict";
import { createServer } from "node:http";
import fs from 'fs/promises';
import url from 'url';
import path from 'path';
const PORT = process.env.PORT || 8000;

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

let users = [
  { id: 1, name: "lalit" },
  { id: 2, name: "Thapa" },
  { id: 3, name: "Makeup" },
  { id: 4, name: "revoltion" }
]


//Logger Middleware
const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next();
}

// Json Middeleware
const jsonMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
};

//write response
const writeResponseHandler = (req, res , list) => {
  res.write(JSON.stringify(list));
  res.end();
}

//Add user handler
const addUserHandler = (req , res) => {
  let body = "";

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  users.push(JSON.parse(body));
  console.log("User added successfully");

  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  writeResponseHandler(req, res, users);
}

// Get User by Id  Middleware
const getUserByIdHandler = (req, res) => {
  const getUserId = req.url.split('/');
  const userNumber = getUserId[3];
  const is_valid_user = users.find((user) => user.id == parseInt(userNumber));
  if (is_valid_user) {
    writeResponseHandler(req, res, is_valid_user);
  } else {
    res.statusCode = 404;
    writeResponseHandler(req, res,{ message: "User Not Found" });
  }
}
const addUserByDetails = (req, res) => {
  let body = "";

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const newUser = JSON.parse(body);
      users.push(newUser);
      console.log("User added successfully");
      res.statusCode = 201;
      writeResponseHandler(req, res, newUser);
  });
};

const server = createServer((req, res) => {
  // /api/users/1
  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      if (req.method === 'GET' && req.url === "/api/users") {
        writeResponseHandler(req, res, users);
      } else if (req.method === 'GET' && req.url.match(/^\/api\/users\/(\d+)$/)) {
        getUserByIdHandler(req, res);
      }
      else if (req.method === 'POST' && req.url === "/api/users") {
         // addUserHandler(req,res);
         addUserByDetails(req,res);
      }
      else {
        res.statusCode = 404;
        writeResponseHandler(req, res, { message: "Route Not Found" });
      }
    });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening on ${PORT}`);
});
