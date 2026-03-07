import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car';
import User from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const SAMPLE_CARS = [
  {
    license_plate: "MH-12-AB-1234",
    specs: { make: "Toyota", model: "Fortuner", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 4500 },
    image_url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-HH-9999",
    specs: { make: "Honda", model: "City", year: 2021, transmission: "Manual" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 2200 },
    image_url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-CC-5555",
    specs: { make: "Mahindra", model: "Thar", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 3800 },
    image_url: "https://images.unsplash.com/photo-1626244793664-84c2f82956c2?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-DE-1111",
    specs: { make: "Tesla", model: "Model 3", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 12000 },
    image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "TN-07-BZ-4444",
    specs: { make: "BMW", model: "M4", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [80.2707, 13.0827] },
    rates: { currency: "INR", per_day: 15000 },
    image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-03-MY-7777",
    specs: { make: "Mercedes-Benz", model: "C-Class", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 8500 },
    image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-14-GH-8888",
    specs: { make: "Audi", model: "Q7", year: 2021, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [73.8567, 18.5204] },
    rates: { currency: "INR", per_day: 10000 },
    image_url: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-02-JK-2222",
    specs: { make: "Hyundai", model: "Creta", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 2800 },
    image_url: "https://images.unsplash.com/photo-1583267746897-2cf415888172?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "HR-26-AL-0001",
    specs: { make: "Land Rover", model: "Defender", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.0266, 28.4595] },
    rates: { currency: "INR", per_day: 18000 },
    image_url: "https://images.unsplash.com/photo-1623101675203-2475e98586f1?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "WB-02-LL-5555",
    specs: { make: "Volkswagen", model: "Virtus", year: 2023, transmission: "Manual" },
    status: "available",
    location: { type: "Point", coordinates: [88.3639, 22.5726] },
    rates: { currency: "INR", per_day: 2500 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "GJ-01-RS-9999",
    specs: { make: "Ford", model: "Mustang", year: 2020, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.5714, 23.0225] },
    rates: { currency: "INR", per_day: 25000 },
    image_url: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-02-FF-3333",
    specs: { make: "Jeep", model: "Wrangler", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 7000 },
    image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-05-PP-1234",
    specs: { make: "Kia", model: "Seltos", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 3000 },
    image_url: "https://images.unsplash.com/photo-1644383424168-5272a2757209?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "TN-01-RR-0007",
    specs: { make: "Rolls Royce", model: "Ghost", year: 2021, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [80.2707, 13.0827] },
    rates: { currency: "INR", per_day: 100000 },
    image_url: "https://images.unsplash.com/photo-1631214503022-79461f87963d?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "UP-32-AA-1111",
    specs: { make: "Maruti Suzuki", model: "Swift", year: 2022, transmission: "Manual" },
    status: "available",
    location: { type: "Point", coordinates: [80.9462, 26.8467] },
    rates: { currency: "INR", per_day: 1500 },
    image_url: "https://images.unsplash.com/photo-1567808291548-fc3ee04dbac0?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MP-04-BB-2222",
    specs: { make: "Skoda", model: "Octavia", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.4126, 23.2599] },
    rates: { currency: "INR", per_day: 5500 },
    image_url: "https://images.unsplash.com/photo-1605515298946-d062f2e9da53?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "TS-09-CC-3333",
    specs: { make: "Volvo", model: "XC90", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [78.4867, 17.3850] },
    rates: { currency: "INR", per_day: 12000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "AP-01-DD-4444",
    specs: { make: "Tata", model: "Safari", year: 2023, transmission: "Manual" },
    status: "available",
    location: { type: "Point", coordinates: [80.6480, 16.5062] },
    rates: { currency: "INR", per_day: 3500 },
    image_url: "https://images.unsplash.com/photo-1644383424168-5272a2757209?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KL-01-EE-5555",
    specs: { make: "Porsche", model: "911", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [76.9467, 8.5241] },
    rates: { currency: "INR", per_day: 35000 },
    image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "RJ-14-FF-6666",
    specs: { make: "Lexus", model: "RX", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [75.7873, 26.9124] },
    rates: { currency: "INR", per_day: 9000 },
    image_url: "https://images.unsplash.com/photo-1616789916118-5902adb01505?auto=format&fit=crop&q=80&w=800"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const dealer = await User.findOne({ roles: "dealer" }) || await User.findOne();
    if (!dealer) {
      console.error("No users found in database. Please create a user first!");
      return;
    }

    console.log(`Using User: ${dealer.name} (${dealer._id}) as the dealer.`);

    await Car.deleteMany({});
    console.log("Cleared existing cars.");

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
