"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = void 0;
const corsOptions_1 = require("../config/corsOptions");
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (corsOptions_1.allowedOrigins.includes(origin))
        res.header("Access-Control-Allow-Credentials", "true");
    next();
};
exports.credentials = credentials;
