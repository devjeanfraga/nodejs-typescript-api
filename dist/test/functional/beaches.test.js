"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beach_1 = require("@src/models/beach");
describe('Beaches functional test', () => {
    beforeAll(async () => await beach_1.Beach.deleteMany({}));
    describe('When create a beach', () => {
        it('Should create a beach with success', async () => {
            const newBeach = {
                name: 'Manly',
                position: 'E',
                lat: -33.792726,
                lng: 151.289824,
            };
            const response = await global.testRequest.post('/beaches').send(newBeach);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newBeach));
        });
        it('should return 422 when there is a validation Error', async () => {
            const newBeach = {
                name: 'Manly',
                position: 'E',
                lat: 'invalid_string',
                lng: 151.289824,
            };
            const response = await global.testRequest.post('/beaches').send(newBeach);
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                error: 'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"'
            });
        });
        it.skip('Should return 500 when there is any error other than validation error', async () => {
        });
    });
});
//# sourceMappingURL=beaches.test.js.map