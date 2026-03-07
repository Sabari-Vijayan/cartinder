"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const swipeController_1 = require("../controllers/swipeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.protect, swipeController_1.recordSwipe);
router.get('/likes', authMiddleware_1.protect, swipeController_1.getLikedCars);
exports.default = router;
