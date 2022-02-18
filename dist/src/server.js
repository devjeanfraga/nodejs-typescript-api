"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupServer = void 0;
const cors_1 = __importDefault(require("cors"));
const core_1 = require("@overnightjs/core");
require("./util/module-alias");
const body_parser_1 = __importDefault(require("body-parser"));
const forecast_1 = require("./controllers/forecast");
const beache_1 = require("./controllers/beache");
const users_1 = require("@src/controllers/users");
const database = __importStar(require("@src/util/database"));
const logger_1 = __importDefault(require("./logger"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
class SetupServer extends core_1.Server {
    constructor(port = 3000) {
        super();
        this.port = port;
    }
    async init() {
        this.setupExpress();
        this.setupControllers();
        await this.setupDatabase();
    }
    setupExpress() {
        this.app.use(body_parser_1.default.json());
        this.app.use((0, express_pino_logger_1.default)({
            logger: logger_1.default
        }));
        this.app.use((0, cors_1.default)({
            origin: '*'
        }));
    }
    setupControllers() {
        const forecastController = new forecast_1.ForecastController();
        const beachesController = new beache_1.BeachesController();
        const usersController = new users_1.UsersController();
        this.addControllers([
            forecastController,
            beachesController,
            usersController,
        ]);
    }
    getApp() {
        return this.app;
    }
    async setupDatabase() {
        await database.connect();
    }
    async close() {
        await database.close();
    }
    start() {
        this.app.listen(this.port, () => {
            logger_1.default.info('Server listening of port: ' + this.port);
        });
    }
}
exports.SetupServer = SetupServer;
//# sourceMappingURL=server.js.map