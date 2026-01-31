import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

async function debug() {
  console.log("--- DEBUG SCRIPT STARTED ---");
  console.log("URI:", MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

  try {
    await mongoose.connect(MONGO_URI);
    console.log("1. Connected successfully to MongoDB.");
    console.log("   Database Name:", mongoose.connection.name);
    console.log("   Host:", mongoose.connection.host);

    // List collections
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("2. Collections found in database '" + mongoose.connection.name + "':");
        collections.forEach(c => console.log("   - " + c.name));
        
        // Check explicitly for 'users'
        const hasUsers = collections.some(c => c.name === 'users');
        if (!hasUsers) {
            console.warn("   WARNING: Collection 'users' NOT found! Mongoose 'User' model looks for 'users' by default.");
        }
    }

    // Count Users
    const count = await User.countDocuments();
    console.log(`3. Document count in 'User' model (collection: ${User.collection.name}):`, count);

    const users = await User.find();
    console.log("4. Users found:", JSON.stringify(users, null, 2));

  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await mongoose.disconnect();
    console.log("--- DEBUG SCRIPT FINISHED ---");
  }
}

debug();
