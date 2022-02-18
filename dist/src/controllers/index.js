"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const logger_1 = __importDefault(require("@src/logger"));
const users_1 = require("@src/models/users");
const api_error_1 = __importDefault(require("@src/util/errors/api-error"));
const mongoose_1 = __importDefault(require("mongoose"));
class BaseController {
    sendCreatedUpdateDataResponse(res, error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            this.handleClientErrors(error, res);
            return res;
        }
        else {
            logger_1.default.error(error);
            return res.status(500).send(api_error_1.default.format({ code: 500, message: 'Something went wrong' }));
        }
    }
    sendErrorResponse(res, apiError) {
        return res.status(apiError.code).send(api_error_1.default.format(apiError));
    }
    handleClientErrors(error, res) {
        Object.values(error.errors).filter((err) => {
            err.name === 'ValidatorError' && err.kind === users_1.CUSTOM_VALIDATION.DUPLICATED
                ? (res = res.status(409).send(api_error_1.default.format({ code: 409, message: error.message })))
                : (res = res.status(422).send(api_error_1.default.format({ code: 422, message: error.message })));
        });
        return res;
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=index.js.map