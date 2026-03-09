"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteCar = exports.updateCar = exports.createCar = exports.getDealerCars = exports.getCarById = exports.getAllCars = void 0;
const CarService = __importStar(require("../services/carService"));
const Car_1 = __importDefault(require("../models/Car"));
const getAllCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { make, year, min_price, max_price, status, page, limit } = req.query;
        const filters = {
            make: make,
            year: year ? parseInt(year) : undefined,
            min_price: min_price ? parseInt(min_price) : undefined,
            max_price: max_price ? parseInt(max_price) : undefined,
            status: status,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined
        };
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const cars = yield CarService.fetchAllCars(userId, filters);
        res.status(200).json(cars);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching cars", error: error.message });
    }
});
exports.getAllCars = getAllCars;
const getCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const car = yield Car_1.default.findById(id).populate('dealer_id', 'name email profile');
        if (!car) {
            res.status(404).json({ message: "Car not found" });
            return;
        }
        res.status(200).json(car);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching car details", error: error.message });
    }
});
exports.getCarById = getCarById;
const getDealerCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dealer_id = req.user._id;
        const cars = yield Car_1.default.find({ dealer_id });
        res.status(200).json(cars);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching dealer cars", error: error.message });
    }
});
exports.getDealerCars = getDealerCars;
const createCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure user is a dealer
        if (!req.user.roles.includes('dealer')) {
            res.status(403).json({ message: "Only dealers can list cars" });
            return;
        }
        const carData = Object.assign(Object.assign({}, req.body), { dealer_id: req.user._id });
        const newCar = yield CarService.createNewCar(carData);
        res.status(201).json(newCar);
    }
    catch (error) {
        res.status(400).json({ message: "Error adding car", error: error.message });
    }
});
exports.createCar = createCar;
const updateCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dealer_id = req.user._id;
        const car = yield Car_1.default.findOne({ _id: id, dealer_id });
        if (!car) {
            res.status(404).json({ message: "Car not found or unauthorized" });
            return;
        }
        Object.assign(car, req.body);
        yield car.save();
        res.status(200).json(car);
    }
    catch (error) {
        res.status(400).json({ message: "Error updating car", error: error.message });
    }
});
exports.updateCar = updateCar;
const deleteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dealer_id = req.user._id;
        const result = yield Car_1.default.deleteOne({ _id: id, dealer_id });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Car not found or unauthorized" });
            return;
        }
        res.status(200).json({ message: "Car deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting car", error: error.message });
    }
});
exports.deleteCar = deleteCar;
