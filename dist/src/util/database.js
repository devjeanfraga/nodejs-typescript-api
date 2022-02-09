"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.connect = void 0;
const config_1 = __importDefault(require("config"));
const mongoose_1 = require("mongoose");
const dbConfig = config_1.default.get('app.database');
const connect = async () => {
    await (0, mongoose_1.connect)(dbConfig.get('mongoURL'));
};
exports.connect = connect;
const close = () => mongoose_1.connection.close();
exports.close = close;
//# sourceMappingURL=database.js.map