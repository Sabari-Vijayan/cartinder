"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const carRoutes_1 = __importDefault(require("./routes/carRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swipeRoutes_1 = __importDefault(require("./routes/swipeRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
// Routes
app.get('/', (req, res) => {
    res.send('CarTinder API is running...');
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/cars', carRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/swipes', swipeRoutes_1.default);
app.use('/api/chats', chatRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running ${process.env.NODE_ENV || 'development mode'} on port ${PORT}`);
});
