"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const process_1 = __importDefault(require("process"));
var ExitStatus;
(function (ExitStatus) {
    ExitStatus[ExitStatus["Failure"] = 1] = "Failure";
    ExitStatus[ExitStatus["Success"] = 0] = "Success";
})(ExitStatus || (ExitStatus = {}));
process_1.default.on('SIGINT', () => console.log(" O INT AQUI !"));
process_1.default.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error(`App exiting due to uncaught promise: ${promise} and ${reason}`);
    throw reason;
});
process_1.default.on('uncaughtException', (error) => {
    logger_1.default.error(`App exiting due to an uncaught exception ${error}`);
    process_1.default.exit(ExitStatus.Failure);
});
(async () => {
    try {
        const server = new server_1.SetupServer(config_1.default.get('app.port'));
        await server.init();
        server.start();
        const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        exitSignals.map((sig) => {
            process_1.default.on(sig, async () => {
                try {
                    await server.close();
                    console.log("App exit with success");
                    process_1.default.exit(ExitStatus.Success);
                }
                catch (error) {
                    logger_1.default.error('App exit with error: ' + error);
                    process_1.default.exit(ExitStatus.Failure);
                }
            });
        });
    }
    catch (error) {
        logger_1.default.error(`App exit with error: ${error}`);
        process_1.default.exit(ExitStatus.Failure);
    }
})();
//# sourceMappingURL=index.js.map