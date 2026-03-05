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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || "";
function debug() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("--- DEBUG SCRIPT STARTED ---");
        console.log("URI:", MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs
        try {
            yield mongoose_1.default.connect(MONGO_URI);
            console.log("1. Connected successfully to MongoDB.");
            console.log("   Database Name:", mongoose_1.default.connection.name);
            console.log("   Host:", mongoose_1.default.connection.host);
            // List collections
            if (mongoose_1.default.connection.db) {
                const collections = yield mongoose_1.default.connection.db.listCollections().toArray();
                console.log("2. Collections found in database '" + mongoose_1.default.connection.name + "':");
                collections.forEach(c => console.log("   - " + c.name));
                // Check explicitly for 'users'
                const hasUsers = collections.some(c => c.name === 'users');
                if (!hasUsers) {
                    console.warn("   WARNING: Collection 'users' NOT found! Mongoose 'User' model looks for 'users' by default.");
                }
            }
            // Count Users
            const count = yield User_1.default.countDocuments();
            console.log(`3. Document count in 'User' model (collection: ${User_1.default.collection.name}):`, count);
            const users = yield User_1.default.find();
            console.log("4. Users found:", JSON.stringify(users, null, 2));
        }
        catch (err) {
            console.error("ERROR:", err);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log("--- DEBUG SCRIPT FINISHED ---");
        }
    });
}
debug();
