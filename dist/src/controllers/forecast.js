"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastController = void 0;
const core_1 = require("@overnightjs/core");
const forecast_1 = require("@src/services/forecast");
const beach_1 = require("@src/models/beach");
const auth_1 = require("@src/middlewares/auth");
const forecast = new forecast_1.Forecast();
let ForecastController = class ForecastController {
    async getForecastForLoggedUser(req, res) {
        try {
            const beach = await beach_1.Beach.find({ user: req.decoded?.id });
            const forecastData = await forecast.processForecastForBeaches(beach);
            res.status(200).send(forecastData);
        }
        catch (error) {
            res.status(500).send({ error: 'somethings went wrong' });
        }
    }
};
__decorate([
    (0, core_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ForecastController.prototype, "getForecastForLoggedUser", null);
ForecastController = __decorate([
    (0, core_1.Controller)('forecast'),
    (0, core_1.ClassMiddleware)(auth_1.authMiddleware)
], ForecastController);
exports.ForecastController = ForecastController;
//# sourceMappingURL=forecast.js.map