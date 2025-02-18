import express, { Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { UserRequest, User } from './types';

const router = express.Router();
// Resolve the data file path (assumes data/users.json is one directory above the compiled files)
const dataFile = path.resolve(__dirname, '../data/users.json');

// Middleware to ensure that req.users exists
const ensureUsers = (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.users) {
    next();
  } else {
    res.status(404).json({ error: { message: 'users not found', status: 404 } });
  }
};

// POST /write/adduser - adds a new user to the users array and writes the updated array to the file
router.post('/adduser', ensureUsers, async (req: UserRequest, res: Response) => {
  try {
    const newUser = req.body as User;
    req.users!.push(newUser);
    
    await fs.writeFile(dataFile, JSON.stringify(req.users, null, 2));
    
    console.log('User Saved');
    res.send('done');
  } catch (err) {
    console.error('Failed to write:', err);
    res.status(500).send('Error saving user');
  }
});

export default router;
