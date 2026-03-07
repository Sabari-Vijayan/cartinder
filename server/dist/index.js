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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
const Car_1 = __importDefault(require("./models/Car"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get('/', (req, res) => {
    res.send('Cartinder API is running...');
});
// GET all users
app.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
}));
// GET all cars
app.get('/api/cars', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield Car_1.default.find();
        res.status(200).json(cars);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching cars", error });
    }
}));
// POST a new car
app.post('/api/cars', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Note: In a real app, you'd get dealer_id from auth session
        const newCar = new Car_1.default(req.body);
        yield newCar.save();
        res.status(201).json(newCar);
    }
    catch (error) {
        res.status(400).json({ message: "Error adding car", error });
    }
}));
// Single Database Connection Logic
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
