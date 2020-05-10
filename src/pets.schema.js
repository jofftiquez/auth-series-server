import mongoose from 'mongoose';

const PetSchema = mongoose.Schema({
  owner: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    required: true
  },
}, { timestamps: true });

export default mongoose.model('Pets', PetSchema);