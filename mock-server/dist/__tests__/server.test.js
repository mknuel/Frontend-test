"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
describe('Policy Recommendations API', () => {
    beforeEach(() => {
        (0, server_1.resetDatabase)();
    });
    // [Previous test cases remain the same until Archive Operations]
    describe('Archive Operations', () => {
        it('should archive and unarchive a recommendation', async () => {
            // Get initial state
            const initialResponse = await (0, supertest_1.default)(server_1.server).get('/recommendations');
            console.log('Initial active recommendations:', initialResponse.body.data.length);
            // Select a recommendation to archive
            const recommendation = initialResponse.body.data[0];
            console.log('Selected recommendation:', recommendation.recommendationId);
            // Archive the recommendation
            const archiveResponse = await (0, supertest_1.default)(server_1.server).post(`/recommendations/${recommendation.recommendationId}/archive`);
            expect(archiveResponse.status).toBe(200);
            expect(archiveResponse.body.success).toBeTruthy();
            console.log('Archive response:', archiveResponse.body);
            // Verify it's in archived recommendations
            const archivedResponse = await (0, supertest_1.default)(server_1.server).get('/recommendations/archive');
            expect(archivedResponse.status).toBe(200);
            const isArchived = archivedResponse.body.data.some((r) => r.recommendationId === recommendation.recommendationId);
            expect(isArchived).toBeTruthy();
            console.log('Found in archived:', isArchived);
            // Verify it's not in active recommendations
            const activeAfterArchive = await (0, supertest_1.default)(server_1.server).get('/recommendations');
            const notInActive = !activeAfterArchive.body.data.some((r) => r.recommendationId === recommendation.recommendationId);
            expect(notInActive).toBeTruthy();
            console.log('Not in active after archive:', notInActive);
            // Unarchive the recommendation
            const unarchiveResponse = await (0, supertest_1.default)(server_1.server).post(`/recommendations/${recommendation.recommendationId}/unarchive`);
            expect(unarchiveResponse.status).toBe(200);
            expect(unarchiveResponse.body.success).toBeTruthy();
            console.log('Unarchive response:', unarchiveResponse.body);
            // Verify it's back in active recommendations
            const finalActiveResponse = await (0, supertest_1.default)(server_1.server).get('/recommendations');
            console.log('Final active recommendations count:', finalActiveResponse.body.data.length);
            console.log('Final active recommendations:', finalActiveResponse.body.data.map((r) => r.recommendationId));
            const isBackInActive = finalActiveResponse.body.data.some((r) => r.recommendationId === recommendation.recommendationId);
            console.log('Looking for recommendation:', recommendation.recommendationId);
            console.log('Found back in active:', isBackInActive);
            expect(isBackInActive).toBeTruthy();
            // Verify it's no longer in archived recommendations
            const finalArchivedResponse = await (0, supertest_1.default)(server_1.server).get('/recommendations/archive');
            const notInArchived = !finalArchivedResponse.body.data.some((r) => r.recommendationId === recommendation.recommendationId);
            expect(notInArchived).toBeTruthy();
            console.log('Not in archived after unarchive:', notInArchived);
        });
        it('should handle archive/unarchive errors', async () => {
            const nonExistentId = 'non-existent-id';
            const archiveResponse = await (0, supertest_1.default)(server_1.server).post(`/recommendations/${nonExistentId}/archive`);
            expect(archiveResponse.status).toBe(404);
            const unarchiveResponse = await (0, supertest_1.default)(server_1.server).post(`/recommendations/${nonExistentId}/unarchive`);
            expect(unarchiveResponse.status).toBe(404);
        });
    });
    // [Rest of the test cases remain the same]
});
