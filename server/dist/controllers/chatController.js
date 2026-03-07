"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startChat = exports.sendMessage = exports.getMessages = exports.getChats = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
const notificationController_1 = require("./notificationController");
// Get all chats for the logged-in user
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user._id;
        const chats = yield Chat_1.default.find({ participants: user_id })
            .populate('participants', 'name email profile.pic_url')
            .sort({ last_updated: -1 });
        res.json(chats);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error: error.message });
    }
});
exports.getChats = getChats;
// Get messages for a specific chat
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const user_id = req.user._id;
        // Verify user is part of the chat
        const chat = yield Chat_1.default.findOne({ _id: chatId, participants: user_id });
        if (!chat) {
            res.status(403).json({ message: 'Not authorized to view this chat' });
            return;
        }
        const messages = yield Message_1.default.find({ chat_id: chatId }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
});
exports.getMessages = getMessages;
// Send a message
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, content } = req.body;
        const sender_id = req.user._id;
        // Verify user is part of the chat
        const chat = yield Chat_1.default.findOne({ _id: chatId, participants: sender_id });
        if (!chat) {
            res.status(403).json({ message: 'Not authorized to send messages in this chat' });
            return;
        }
        const newMessage = new Message_1.default({
            chat_id: chatId,
            sender_id,
            content
        });
        yield newMessage.save();
        // Notify recipient
        const recipient_id = chat.participants.find(p => p.toString() !== sender_id.toString());
        if (recipient_id) {
            yield (0, notificationController_1.createNotification)({
                recipient_id,
                sender_id,
                type: 'new_message',
                title: 'New Message',
                message: `${req.user.name} sent you a message.`,
                link: `/chat/${chatId}`
            });
        }
        // Update chat last message info
        chat.last_message = content;
        chat.last_updated = new Date();
        yield chat.save();
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
});
exports.sendMessage = sendMessage;
// Start or get a chat with another user
const startChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipientId } = req.body;
        const sender_id = req.user._id;
        if (sender_id.toString() === recipientId) {
            res.status(400).json({ message: 'Cannot start a chat with yourself' });
            return;
        }
        // Check if chat already exists
        let chat = yield Chat_1.default.findOne({
            participants: { $all: [sender_id, new mongoose_1.default.Types.ObjectId(recipientId)] }
        });
        if (!chat) {
            chat = new Chat_1.default({
                participants: [sender_id, recipientId]
            });
            yield chat.save();
        }
        res.json(chat);
    }
    catch (error) {
        res.status(500).json({ message: 'Error starting chat', error: error.message });
    }
});
exports.startChat = startChat;
