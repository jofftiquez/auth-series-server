import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Users', UserSchema);