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
  },
  // Adding 50 more cars
  {
    license_plate: "MH-12-XX-0001",
    specs: { make: "Lamborghini", model: "Urus", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 150000 },
    image_url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-YY-0002",
    specs: { make: "Ferrari", model: "488 GTB", year: 2021, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 200000 },
    image_url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-ZZ-0003",
    specs: { make: "Aston Martin", model: "Vantage", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 80000 },
    image_url: "https://images.unsplash.com/photo-1603584173870-7f1b00057ec2?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "TN-07-AA-0004",
    specs: { make: "Maserati", model: "Ghibli", year: 2021, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [80.2707, 13.0827] },
    rates: { currency: "INR", per_day: 45000 },
    image_url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-12-BB-0005",
    specs: { make: "Jaguar", model: "F-Type", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 60000 },
    image_url: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-CC-0006",
    specs: { make: "Bentley", model: "Continental GT", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 120000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-DD-0007",
    specs: { make: "Nissan", model: "GT-R", year: 2021, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 75000 },
    image_url: "https://images.unsplash.com/photo-1594976612316-9b90703a15dc?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-EE-0008",
    specs: { make: "Mini", model: "Cooper", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 8000 },
    image_url: "https://images.unsplash.com/photo-1617469767053-d3b508a0d84d?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-FF-0009",
    specs: { make: "Toyota", model: "Camry", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 6000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-GG-0010",
    specs: { make: "Honda", model: "Accord", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 5500 },
    image_url: "https://images.unsplash.com/photo-1599912027806-cfec9f5944b6?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-HH-0011",
    specs: { make: "Hyundai", model: "Verna", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 3500 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-II-0012",
    specs: { make: "Kia", model: "Carnival", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 7000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-JJ-0013",
    specs: { make: "MG", model: "Hector", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 4000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-KK-0014",
    specs: { make: "Maruti Suzuki", model: "Grand Vitara", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 3000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-LL-0015",
    specs: { make: "Tata", model: "Harrier", year: 2023, transmission: "Manual" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 3800 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-MM-0016",
    specs: { make: "Mahindra", model: "XUV700", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 4500 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-NN-0017",
    specs: { make: "Skoda", model: "Slavia", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 3200 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-OO-0018",
    specs: { make: "Volkswagen", model: "Taigun", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 3200 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-PP-0019",
    specs: { make: "Jeep", model: "Compass", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 5500 },
    image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-QQ-0020",
    specs: { make: "Renault", model: "Kiger", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 2200 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-RR-0021",
    specs: { make: "Nissan", model: "Magnite", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 2200 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-SS-0022",
    specs: { make: "Datsun", model: "Redi-GO", year: 2022, transmission: "Manual" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 1200 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-TT-0023",
    specs: { make: "Force", model: "Gurkha", year: 2023, transmission: "Manual" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 4000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-UU-0024",
    specs: { make: "Isuzu", model: "V-Cross", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 6500 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-VV-0025",
    specs: { make: "Lexus", model: "ES", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 15000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-WW-0026",
    specs: { make: "Porsche", model: "Cayenne", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 45000 },
    image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-XX-0027",
    specs: { make: "Land Rover", model: "Range Rover", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 80000 },
    image_url: "https://images.unsplash.com/photo-1623101675203-2475e98586f1?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-YY-0028",
    specs: { make: "Jaguar", model: "XF", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 35000 },
    image_url: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-ZZ-0029",
    specs: { make: "BMW", model: "X7", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 25000 },
    image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-AA-0030",
    specs: { make: "Mercedes-Benz", model: "S-Class", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 50000 },
    image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-BB-0031",
    specs: { make: "Audi", model: "A8", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 40000 },
    image_url: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-CC-0032",
    specs: { make: "Volvo", model: "S90", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 15000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-DD-0033",
    specs: { make: "Tesla", model: "Model S", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 25000 },
    image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-EE-0034",
    specs: { make: "Hummer", model: "EV", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 60000 },
    image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-FF-0035",
    specs: { make: "Ford", model: "Endeavour", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 6500 },
    image_url: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-GG-0036",
    specs: { make: "Chevrolet", model: "Camaro", year: 2021, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 45000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-HH-0037",
    specs: { make: "Dodge", model: "Challenger", year: 2021, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 50000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-II-0038",
    specs: { make: "Cadillac", model: "Escalade", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 70000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-JJ-0039",
    specs: { make: "Lincoln", model: "Navigator", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 65000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-KK-0040",
    specs: { make: "GMC", model: "Yukon", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 60000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-LL-0041",
    specs: { make: "Buick", model: "Enclave", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 25000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-MM-0042",
    specs: { make: "Chrysler", model: "300", year: 2022, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 15000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-NN-0043",
    specs: { make: "Ram", model: "1500", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 35000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-OO-0044",
    specs: { make: "Fiat", model: "500X", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 8000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-PP-0045",
    specs: { make: "Alfa Romeo", model: "Stelvio", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 25000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-QQ-0046",
    specs: { make: "Infiniti", model: "QX80", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 40000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-RR-0047",
    specs: { make: "Acura", model: "MDX", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 20000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "KA-01-SS-0048",
    specs: { make: "Genesis", model: "GV80", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    rates: { currency: "INR", per_day: 30000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "DL-01-TT-0049",
    specs: { make: "Mazda", model: "CX-9", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    rates: { currency: "INR", per_day: 15000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
  },
  {
    license_plate: "MH-01-UU-0050",
    specs: { make: "Subaru", model: "Ascent", year: 2023, transmission: "Automatic" },
    status: "available",
    location: { type: "Point", coordinates: [72.8777, 19.0760] },
    rates: { currency: "INR", per_day: 12000 },
    image_url: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=800"
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
