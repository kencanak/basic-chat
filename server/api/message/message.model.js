'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';

var MessageSchema = new Schema({
  roomId: {
    type: String,
    required: true
  },
  participants: [
      {
        type: String
      }
  ],
  conversationType: {
      type: String,
      lowercase: true,
      required: true
  },
  conversations: [
    {
      author: {
        type: String,
        lowercase: true
      },
      content: {
        type: String
      },
      timestamp: {
        type: Date
      }
    }
  ]
},
{
    timestamps: true
});


export default mongoose.model('Message', MessageSchema);
