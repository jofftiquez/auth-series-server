import './database';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Database schemas
import User from './users.schema';
import Pet from './pets.schema';

// JWT Secret
const SECRET = '7392b004aa25bcd38c522ad90b05de864196e27e1812fd8481eb4821fbef6e88';

const app = express();

app.use(express.json());

// Create user | sign up
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
    if (e.code === 11000) {
      res.status(500).send(e);
    } else {
      res.status(e.code || 500).send(e.message || 'Internal server error!');
    }
  }
});

// Authenticate | sign in
app.post('/authenticate', async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await User.findOne({ username }).lean();
    if (!data) throw ({ code: 403, message: 'Forbidden - username or password is incorrect!' });
    if (await bcrypt.compare(password, data.password)) {
      delete data.password;
      const accessToken = jwt.sign({ username: data.username, uid: data._id }, SECRET);
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

// Create a pet
app.post('/pets', authRequest, async (req, res) => {
  try {
    const { name, kind } = req.body;
    const { uid } = req.user;
    const pet = new Pet({
      owner: uid,
      name,
      kind
    });
    const data = await pet.save();
    res.status(200).send(data);
  } catch (e) {
    res.status(e.code || 500).send(e.message || 'Internal server error!');
  }
});

// Get user pets
app.get('/pets', authRequest, async (req, res) => {
  try {
    const { uid } = req.user;
    const data = await Pet.find({ owner: uid }).lean();
    res.status(200).send(data);
  } catch (e) {
    res.status(e.code || 500).send(e.message || 'Internal server error!');
  }
});

async function authRequest (req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if (!token) throw ({ code: 401, message: 'Unauthenticated' });
    const decodedToken = await jwt.verify(token, SECRET);
    req.user = decodedToken;
    next();
  } catch (e) {
    res.send(e);
  }
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});