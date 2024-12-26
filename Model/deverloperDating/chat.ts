

const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ], // Two users involved in the chat
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender of the message
      text: { type: String, required: true }, // Message content
      image: { type: String }, // URL or Base64 string for the image
      timestamp: { type: Date, default: Date.now } // Time when the message was sent
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure that participants are stored in a consistent order
ChatSchema.pre('save', function(next:any) {
    //@ts-ignore
    this.participants.sort(); // Sort participants by ID to ensure uniqueness between the pairs
    next();
  });
  
  // Create a unique index on participants to prevent duplicate chats between the same users
  ChatSchema.index({ participants: 1 }, { unique: true });
  
  // Index on messages.timestamp for better querying performance
  ChatSchema.index({ 'messages.timestamp': -1 });
  

// Check if the model already exists to prevent OverwriteModelError
module.exports =  mongoose.models.Chat ||mongoose.model('Chat', ChatSchema);
 