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
exports.StormGlass = exports.StormGlassResponseError = exports.ClientRequestError = void 0;
const internal_error_1 = require("@src/util/internal-error");
const HTTPUtil = __importStar(require("@src/util/Request"));
const config_1 = __importDefault(require("config"));
class ClientRequestError extends internal_error_1.InternalError {
    constructor(message) {
        const InternalMessage = `Unexpected error when trying to communicate to StormGlass`;
        super(`${InternalMessage}: ${message}`);
    }
}
exports.ClientRequestError = ClientRequestError;
class StormGlassResponseError extends internal_error_1.InternalError {
    constructor(message) {
        const InternalMessage = 'Unexpected error returned by the stormGlass service';
        super(`${InternalMessage}: ${message}`);
    }
}
exports.StormGlassResponseError = StormGlassResponseError;
const stormGlassRessourceConfig = config_1.default.get('app.resources.StormGlass');
class StormGlass {
    constructor(request = new HTTPUtil.Request()) {
        this.request = request;
        this.stormGlassAPIParams = 'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed';
        this.stormGlassAPISource = 'noaa';
    }
    async fetchPoints(lat, lng) {
        try {
            const response = await this.request.get(`${stormGlassRessourceConfig.get('apiURL')}/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}=${lng}`, {
                headers: {
                    Authorization: stormGlassRessourceConfig.get('apiToken'),
                },
            });
            return this.normalizeResponse(response.data);
        }
        catch (err) {
            if (HTTPUtil.Request.isRequestError(err)) {
                const dataError = JSON.stringify(err.response.data).replace(/["]/g, '');
                const codeError = err.response.status;
                throw new StormGlassResponseError(`Error: ${dataError} Code: ${codeError}`);
            }
            throw new ClientRequestError(err.message);
        }
    }
    normalizeResponse(points) {
        return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
            swellDirection: point.swellDirection[this.stormGlassAPISource],
            swellHeight: point.swellHeight[this.stormGlassAPISource],
            swellPeriod: point.swellPeriod[this.stormGlassAPISource],
            time: point.time,
            waveDirection: point.waveDirection[this.stormGlassAPISource],
            waveHeight: point.waveHeight[this.stormGlassAPISource],
            windDirection: point.windDirection[this.stormGlassAPISource],
            windSpeed: point.windSpeed[this.stormGlassAPISource],
        }));
    }
    isValidPoint(point) {
        return !!(point.swellDirection?.[this.stormGlassAPISource] &&
            point.swellHeight?.[this.stormGlassAPISource] &&
            point.swellPeriod?.[this.stormGlassAPISource] &&
            point.time &&
            point.waveDirection?.[this.stormGlassAPISource] &&
            point.waveHeight?.[this.stormGlassAPISource] &&
            point.windDirection?.[this.stormGlassAPISource] &&
            point.windSpeed?.[this.stormGlassAPISource]);
    }
}
exports.StormGlass = StormGlass;
//# sourceMappingURL=stormGlass.js.map