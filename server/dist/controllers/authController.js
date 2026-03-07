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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_weekend_project_secret_key_123';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, roles } = req.body;
        console.log('Registration attempt:', { name, email, roles });
        if (!password) {
            res.status(400).json({ message: 'Password is required' });
            return;
        }
        // Check if user already exists
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            console.log('User already exists:', email);
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Create user
        const user = new User_1.default({
            name,
            email,
            password,
            roles: roles || ['buyer']
        });
        console.log('Attempting to save user...');
        yield user.save();
        console.log('User saved successfully');
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        });
    }
    catch (error) {
        console.error('Registration Error details:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);
        // Find user
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch for:', email);
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});
exports.login = login;
