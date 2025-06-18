import Message from '../../DB/models/message.model.js';


export const saveMessage = async (sender, content, room = 'general') => {
    try {
        const message = new Message({
            sender,
            content,
            room
        });
        const savedMessage = await message.save();
        return savedMessage;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};


export const getMessagesForSocket = async (room = 'general', limit = 50) => {
    try {
        const messages = await Message.find({ room })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();


        return messages.reverse();
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}; 