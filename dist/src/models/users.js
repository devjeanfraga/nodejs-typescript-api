"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.CUSTOM_VALIDATION = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("@src/services/auth"));
var CUSTOM_VALIDATION;
(function (CUSTOM_VALIDATION) {
    CUSTOM_VALIDATION["DUPLICATED"] = "DUPLICATED";
})(CUSTOM_VALIDATION = exports.CUSTOM_VALIDATION || (exports.CUSTOM_VALIDATION = {}));
const schema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true },
}, {
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret._v;
        },
    },
}).pre('save', async function (next) {
    if (!this.password || !this.isModified('password')) {
        return;
    }
    else {
        try {
            const passwordHash = await auth_1.default.hashPassword(this.password);
            this.password = passwordHash;
            next;
        }
        catch (error) {
            console.log(`Error hashing the password for the user ${this.name}`);
        }
    }
});
schema.path('email').validate(async (email) => {
    const emailCount = await mongoose_1.default.models.User.countDocuments({ email });
    return !emailCount;
}, 'already exists in the database', CUSTOM_VALIDATION.DUPLICATED);
exports.User = mongoose_1.default.model('User', schema);
//# sourceMappingURL=users.js.map