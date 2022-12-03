const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = new Schema(

  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    firstName: String,
    lastName: String,

    articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }]

  },
  {
    timestamps: true
  }

);


module.exports = model('User', userSchema);
