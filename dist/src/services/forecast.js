"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forecast = exports.ForecastProcessInternalError = void 0;
const stormGlass_1 = require("@src/clients/stormGlass");
const logger_1 = __importDefault(require("@src/logger"));
const beach_1 = require("@src/models/beach");
const internal_error_1 = require("@src/util/errors/internal-error");
class ForecastProcessInternalError extends internal_error_1.InternalError {
    constructor(message) {
        super(`Unexpected error during the forecast processing: ${message}`);
    }
}
exports.ForecastProcessInternalError = ForecastProcessInternalError;
class Forecast {
    constructor(stormGlass = new stormGlass_1.StormGlass()) {
        this.stormGlass = stormGlass;
    }
    async processForecastForBeaches(beaches) {
        logger_1.default.info(`Preparing the forecast for ${beach_1.Beach.length} breach (s)`);
        try {
            const pointsWithCorrectSources = [];
            for (const beach of beaches) {
                const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
                const enrichedBeachData = this.enrichedBeachData(points, beach);
                pointsWithCorrectSources.push(...enrichedBeachData);
            }
            if (pointsWithCorrectSources.length === 0) {
                logger_1.default.error(new ForecastProcessInternalError('Request failed: Empty object'));
            }
            return this.mapForecastByTime(pointsWithCorrectSources);
        }
        catch (error) {
            throw new ForecastProcessInternalError(error.message);
        }
    }
    enrichedBeachData(points, beach) {
        return points.map((e) => ({
            ...{
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: 1,
            },
            ...e,
        }));
    }
    mapForecastByTime(forecast) {
        const forecastByTime = [];
        for (const point of forecast) {
            const timePoint = forecastByTime.find((f) => f.time === point.time);
            if (timePoint) {
                timePoint.forecast.push(point);
            }
            else {
                forecastByTime.push({
                    time: point.time,
                    forecast: [point],
                });
            }
        }
        return forecastByTime;
    }
}
exports.Forecast = Forecast;
//# sourceMappingURL=forecast.js.map