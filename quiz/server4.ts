import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import readUsersRouter from './readUsers';
import writeUsersRouter from './writeUsers';
import { User } from './types';

const app: Express = express();
const port = 8000;
// Resolve the path to the users data file
const dataFile = path.resolve(__dirname, '../data/users.json');

let users: User[] = [];

// A function to asynchronously read the user data file and store it in the 'users' array.
async function readUsersFile() {
  try {
    console.log('reading file ... ');
    const data = await fs.readFile(dataFile);
    users = JSON.parse(data.toString());
    console.log('File read successfully');
  } catch (err) {
    console.error('Error reading file:', err);
  }
}
readUsersFile();

// Middleware to attach the users array to every request.
// This makes the users available to our routers as req.users.
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).users = users;
  next();
});

// Enable CORS for requests from http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware to parse JSON and URL-encoded payloads.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the routers under /read and /write
app.use('/read', readUsersRouter);
app.use('/write', writeUsersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
