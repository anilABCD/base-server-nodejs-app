

const mongoose = require('mongoose');

 // messages are handled by this chat.ts

const ChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ], // Two users involved in the chat
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender of the message
      text: { type: String, default: "" }, // Message content
      image: { type: String , default : "" }, // URL or Base64 string for the image
      timestamp: { type: Date, default: Date.now } , // Time when the message was sent
      delivered : { type:Boolean , default :false} ,
      readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Track read receipts
    }
  ],
  lastMessage: {
    text: { type: String }, // Preview text of the last message
    image: { type: String }, // Preview image URL, if applicable
    timestamp: { type: Date },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  unreadCounts: {
    type: Map,
    of: Number, // Unread messages count per user
    default: {}
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ChatSchema.pre('save', function(next:any) {

  //@ts-ignore
  this.participants.sort((a, b) => a.toString().localeCompare(b.toString()));
 //@ts-ignore
  console.log(this.participants)
  next();
});

  ChatSchema.set('toJSON', {
    transform: (doc : any, ret : any ) => {
      ret.id = ret._id.toString(); // Convert `_id` to string and assign to `id`
      // ret.participants = ret.participants.map((participant : any ) => participant.toString()); // Convert participants to strings

      // Apply transformation to each message
      ret.messages = ret.messages.map((message:any) => {
        message.id = message._id.toString(); // Convert _id to id
        message.sender = message.sender._id.toString(); // Convert sender ObjectId to string
        message.text = message.text
        message.deliverd = message.deliverd
         console.log(message)

           // Handle `readBy` transformation
      message.readBy = message.readBy.map((userId: any) => userId.toString()); // Convert `readBy` ObjectIds to strings


        // Transform timestamp to a more readable format (e.g., ISO string or custom format)
        message.timestamp = message.timestamp.toISOString(); // Convert to ISO string
      
       delete message._id; // Remove _id field
       return message;
     });

      delete ret._id; // Remove `_id`
      delete ret.__v; // Optional: Remove version field
    },
  });
  
  ChatSchema.index({ 
    'participants.0': 1, 
    'participants.1': 1 
  }, { unique: true });
  
  // Index on messages.timestamp for better querying performance
  ChatSchema.index({ 'messages.timestamp': -1 });
  

// Check if the model already exists to prevent OverwriteModelError
module.exports =  mongoose.models.Chat ||mongoose.model('Chat', ChatSchema);
 