import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    creatorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now // Auto-generated timestamp
    },
});

export default mongoose.model('Message', messageSchema);
