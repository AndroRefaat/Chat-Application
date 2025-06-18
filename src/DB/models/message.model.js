import mongoose, { model, Schema } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: String,
        required: [true, 'Sender is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true
    },
    room: {
        type: String,
        default: 'general'
    }
}, {
    timestamps: true
});

const Message = model('Message', messageSchema);

export default Message; 