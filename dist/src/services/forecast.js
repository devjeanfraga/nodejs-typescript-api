"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forecast = exports.ForecastProcessInternalError = exports.BeachPosition = void 0;
const stormGlass_1 = require("@src/clients/stormGlass");
const internal_error_1 = require("@src/util/internal-error");
var BeachPosition;
(function (BeachPosition) {
    BeachPosition["S"] = "S";
    BeachPosition["E"] = "E";
    BeachPosition["W"] = "W";
    BeachPosition["N"] = "N";
})(BeachPosition = exports.BeachPosition || (exports.BeachPosition = {}));
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
        try {
            const pointsWithCorrectSources = [];
            for (const beach of beaches) {
                const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
                const enrichedBeachData = this.enrichedBeachData(points, beach);
                pointsWithCorrectSources.push(...enrichedBeachData);
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
                rating: 1
            },
            ...e
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