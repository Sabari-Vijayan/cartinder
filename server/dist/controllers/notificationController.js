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
exports.createNotification = exports.markAllAsRead = exports.markAsRead = exports.getMyNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getMyNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user._id;
        const notifications = yield Notification_1.default.find({ recipient_id: user_id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
});
exports.getMyNotifications = getMyNotifications;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user_id = req.user._id;
        yield Notification_1.default.findOneAndUpdate({ _id: id, recipient_id: user_id }, { is_read: true });
        res.json({ message: 'Marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
});
exports.markAsRead = markAsRead;
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user._id;
        yield Notification_1.default.updateMany({ recipient_id: user_id, is_read: false }, { is_read: true });
        res.json({ message: 'All marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error: error.message });
    }
});
exports.markAllAsRead = markAllAsRead;
// Internal utility to create notification
const createNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = new Notification_1.default(data);
        yield notification.save();
        return notification;
    }
    catch (error) {
        console.error('Error creating notification:', error);
    }
});
exports.createNotification = createNotification;
