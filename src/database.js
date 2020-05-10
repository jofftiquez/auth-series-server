import mongoose from 'mongoose';

mongoose.connect(
  'mongodb://localhost:27017/cool-app',
  { useNewUrlParser: true, useUnifiedTopology: true, createIndexes: true },
  (e) => {
    if (e) throw new Error(`Can't connect to the database!`);
    console.log('Successfully connected to the database!');
  }
);

mongoose.set('useCreateIndex', true);