"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
class AuthServices {
    static async hashPassword(password, salt = 12) {
        return bcrypt_1.default.hash(password, salt);
    }
    static async comparePasword(pasword, hashedPassword) {
        return await bcrypt_1.default.compare(pasword, hashedPassword);
    }
    static generateToken(payload) {
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.get('app.auth.key'), {
            expiresIn: config_1.default.get('app.auth.tokenexpiresIn'),
        });
        return token;
    }
    static decodeToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.default.get('app.auth.key'));
    }
}
exports.default = AuthServices;
//# sourceMappingURL=auth.js.map