import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car';
import User from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const SAMPLE_CARS = [
  {
    license_plate: "MH-12-AB-1234",
    specs: {
      make: "Toyota",
      model: "Fortuner",
      year: 2022,
      transmission: "Automatic"
    },
    status: "available",
    location: {
      type: "Point",
      coordinates: [72.8777, 19.0760] // Mumbai
    },
    rates: {
      currency: "INR",
      per_day: 4000
    },
    image_url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-HH-9999",
    specs: {
      make: "Honda",
      model: "City",
      year: 2021,
      transmission: "Manual"
    },
    status: "available",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716] // Bangalore
    },
    rates: {
      currency: "INR",
      per_day: 2500
    },
    image_url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-CC-5555",
    specs: {
      make: "Mahindra",
      model: "Thar",
      year: 2023,
      transmission: "Automatic"
    },
    status: "available",
    location: {
      type: "Point",
      coordinates: [77.2090, 28.6139] // Delhi
    },
    rates: {
      currency: "INR",
      per_day: 3500
    },
    image_url: "https://images.unsplash.com/photo-1626244793664-84c2f82956c2?auto=format&fit=crop&q=80&w=800"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 1. Get a dealer ID (we need a valid user to own the cars)
    const dealer = await User.findOne();
    if (!dealer) {
      console.error("No users found in database. Please create a user first!");
      return;
    }

    console.log(`Using User: ${dealer.name} (${dealer._id}) as the dealer.`);

    // 2. Clear existing cars (optional, keeps it clean)
    await Car.deleteMany({});
    console.log("Cleared existing cars.");

    // 3. Add dealer_id to sample cars and save
    const carsToInsert = SAMPLE_CARS.map(car => ({
      ...car,
      dealer_id: dealer._id
    }));

    await Car.insertMany(carsToInsert);
    console.log(`Successfully seeded ${carsToInsert.length} cars!`);

  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();
