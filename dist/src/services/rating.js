"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
const beach_1 = require("@src/models/beach");
const waveHeights = {
    ankleToKnee: {
        min: 0.3,
        max: 1.0,
    },
    waistHight: {
        min: 1.0,
        max: 2.0
    },
    headHight: {
        min: 2.0,
        max: 2.5
    },
};
class Rating {
    constructor(beach) {
        this.beach = beach;
    }
    getRateForPoint(point) {
        const swellDirection = this.getPositionFromLocation(point.swellDirection);
        const windDirection = this.getPositionFromLocation(point.windDirection);
        const windAndWaveRating = this.getRatingBasedOnWindAndOnWavePosition(swellDirection, windDirection);
        const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
        const sweelPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
        const finalRating = (windAndWaveRating + swellHeightRating + sweelPeriodRating) / 3;
        return Math.round(finalRating);
    }
    getRatingBasedOnWindAndOnWavePosition(wavePosition, windPosition) {
        if (wavePosition === windPosition) {
            return 1;
        }
        else if (this.isWindOffShore(wavePosition, windPosition)) {
            return 5;
        }
        return 3;
    }
    getRatingForSwellSize(height) {
        if (height >= waveHeights.ankleToKnee.min &&
            height < waveHeights.ankleToKnee.max) {
            return 2;
        }
        if (height >= waveHeights.waistHight.min &&
            height < waveHeights.waistHight.max) {
            return 3;
        }
        if (height >= waveHeights.headHight.min) {
            return 5;
        }
        return 1;
    }
    getRatingForSwellPeriod(period) {
        if (period >= 7 && period < 10) {
            return 2;
        }
        if (period >= 10 && period < 14) {
            return 4;
        }
        if (period >= 14) {
            return 5;
        }
        return 1;
    }
    getPositionFromLocation(cordinates) {
        if (cordinates > 315 || (cordinates <= 45 && cordinates >= 0)) {
            return beach_1.GeoPosition.N;
        }
        if (cordinates > 45 && cordinates <= 135) {
            return beach_1.GeoPosition.E;
        }
        if (cordinates > 135 && cordinates <= 255) {
            return beach_1.GeoPosition.S;
        }
        return beach_1.GeoPosition.W;
    }
    isWindOffShore(waveDirection, windDirection) {
        const result = ((waveDirection === beach_1.GeoPosition.N &&
            windDirection === beach_1.GeoPosition.S &&
            this.beach.position === beach_1.GeoPosition.N) ||
            (waveDirection === beach_1.GeoPosition.S &&
                windDirection === beach_1.GeoPosition.N &&
                this.beach.position === beach_1.GeoPosition.S) ||
            (waveDirection === beach_1.GeoPosition.E &&
                windDirection === beach_1.GeoPosition.W &&
                this.beach.position === beach_1.GeoPosition.E) ||
            (waveDirection === beach_1.GeoPosition.W &&
                windDirection === beach_1.GeoPosition.E &&
                this.beach.position === beach_1.GeoPosition.W));
        return result;
    }
}
exports.Rating = Rating;
//# sourceMappingURL=rating.js.map