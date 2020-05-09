import './database';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './users.schema';

const SECRET = 'sssshhhhhh!';

const app = express();

app.use(express.json());

// Create user
app.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPass
    });
    await user.save();
    res.status(201).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post('/users/:username', (req, res) => {
  try {
    
  } catch (e) {
    res.status(e.code || 500).send(e.message || 'Internal server error!');
  }
});

// Authenticate
app.post('/authenticate', async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await User.findOne({ username }).lean();
    if (!data) throw ({ code: 403, message: 'Forbidden - username or password is incorrect!' });
    if (await bcrypt.compare(password, data.password)) {
      delete data.password;
      const accessToken = jwt.sign({ username: data.username }, SECRET);
      res.status(200).send({
        ...data,
        accessToken
      });
    } else {
      throw ({ code: 403, message: 'Forbidden - username or password is incorrect!' });
    }
  } catch (e) {
    res.status(e.code || 500).send(e.message || 'Internal server error!');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});