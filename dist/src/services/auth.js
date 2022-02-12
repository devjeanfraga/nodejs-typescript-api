"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthServices {
    static async hashPassword(password, salt = 12) {
        return bcrypt_1.default.hash(password, salt);
    }
    static async comparePasword(pasword, hashedPassword) {
        return await bcrypt_1.default.compare(pasword, hashedPassword);
    }
}
exports.default = AuthServices;
//# sourceMappingURL=auth.js.map