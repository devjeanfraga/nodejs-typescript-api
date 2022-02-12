"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const users_1 = require("@src/models/users");
const mongoose_1 = __importDefault(require("mongoose"));
class BaseController {
    sendCreatedUpdateDataResponse(res, error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            this.handleClientErrors(error, res);
            return res;
        }
        else {
            return res.status(500).send({ code: 500, error: 'Something went wrong' });
        }
    }
    handleClientErrors(error, res) {
        Object.values(error.errors).filter((err) => {
            err.name === 'ValidatorError' &&
                err.kind === users_1.CUSTOM_VALIDATION.DUPLICATED
                ? res = res.status(409).send({ code: 409, error: error.message })
                : res = res.status(422).send({ code: 422, error: error.message });
        });
        return res;
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=index.js.map