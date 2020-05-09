import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

export default mongoose.model('Users', UserSchema);