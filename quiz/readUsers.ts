import express, { Response, NextFunction } from 'express';
import { UserRequest, User } from './types';

const router = express.Router();

// Middleware to ensure that req.users exists
const ensureUsers = (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.users) {
    next();
  } else {
    res.status(404).json({ error: { message: 'users not found', status: 404 } });
  }
};

// GET /read/usernames - returns the id and username of each user
router.get('/usernames', ensureUsers, (req: UserRequest, res: Response) => {
  const usernames = req.users!.map((user: User) => ({
    id: user.id,
    username: user.username,
  }));
  res.send(usernames);
});

// GET /read/username/:name - returns the id and email of users matching the username
router.get('/username/:name', ensureUsers, (req: UserRequest, res: Response) => {
  const username = req.params.name;
  const matchingUsers = req.users!.filter(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
  if (matchingUsers.length > 0) {
    const userEmails = matchingUsers.map((user: User) => ({
      id: user.id,
      email: user.email,
    }));
    res.send(userEmails);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

export default router;
