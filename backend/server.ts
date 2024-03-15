import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import mysql, { Connection, RowDataPacket } from 'mysql2';

const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
app.use(cors());

const JWT_SECRET = 'b663dd4d73fb0cd4922f94c7954163b801e5478e985065841c0bd7c8482420c0f8085b8d50fdd662738d4999fae42537852c36ee2969010956980d373e00cc0f'

const db: Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reddit_clone_users',
});

app.use(express.json()); // Add this line to parse JSON in the request body

app.post('/register', async (req: Request, res: Response) => {
  const sql = 'INSERT INTO users (`name`, `email`, `password`) VALUES (?)';
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const values = [req.body.name, req.body.email, hashedPassword];

  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  date_joined: string;
}

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //Find user by email
  const sql = 'SELECT * FROM users WHERE `email` = ?';

  try {
        const [rows] = await db.promise().query<User[]>(sql, [email]);
        const user = rows[0];
        if (!user) {
            return res.json({ error: 'Invalid credentials' });
        }

        // Compare hashed passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.json({ error: 'Invalid credentials 2' });
        }

        return res.json({
          success: true,
          token: jwt.sign({ userId: user.id }, JWT_SECRET),
      });
    } catch (error) {
        console.error(error);
        return res.json({ error: 'Something went wrong' });
    }
});

// Define the structure of your token payload
interface UserPayload {
  userId: string;
}

// Extend the Express Request type to include the user property
interface RequestWithUser extends Request {
  user?: UserPayload; // Use your specific payload type here
}

const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: Error | null, decoded: object) => {
    if (err) return res.sendStatus(403);

    // Ensure the decoded object is of type UserPayload
    req.user = decoded as UserPayload;
    next();
  });
};

// Define a route that simply checks if the token is valid
app.get('/api/verifyToken', authenticateToken, (req: RequestWithUser, res: Response) => {
  // If this route is reached, it means the token is valid
  // You can return a simple success message or user details
  res.json({ success: true, user: req.user });
});


app.get('/profile', authenticateToken, async (req: RequestWithUser, res: Response) => {
  // Check if the user object exists in the request
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = req.user.userId; // Extract userId from the authenticated token

  // Query to find user by userId
  const sql = 'SELECT * FROM users WHERE `id` = ?';

  try {
    const [rows] = await db.promise().query<User[]>(sql, [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user's name
    return res.json({ name: user.name, email: user.email, date: user.date_joined });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
