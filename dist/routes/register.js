"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Register_1 = __importDefault(require("../controllers/Register"));
const registerRouter = express_1.default.Router();
registerRouter.post("/", Register_1.default);
exports.default = registerRouter;
