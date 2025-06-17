import request from 'supertest';
import { server, resetDatabase } from '../server';
import { initialRecommendations } from '../data';
import { CloudProvider, RecommendationClass } from '../types';

describe('Policy Recommendations API', () => {
  beforeEach(() => {
    resetDatabase();
  });

  // [Previous test cases remain the same until Archive Operations]

  describe('Archive Operations', () => {
    it('should archive and unarchive a recommendation', async () => {
      // Get initial state
      const initialResponse = await request(server).get('/recommendations');
      console.log('Initial active recommendations:', initialResponse.body.data.length);

      // Select a recommendation to archive
      const recommendation = initialResponse.body.data[0];
      console.log('Selected recommendation:', recommendation.recommendationId);

      // Archive the recommendation
      const archiveResponse = await request(server).post(`/recommendations/${recommendation.recommendationId}/archive`);
      expect(archiveResponse.status).toBe(200);
      expect(archiveResponse.body.success).toBeTruthy();
      console.log('Archive response:', archiveResponse.body);

      // Verify it's in archived recommendations
      const archivedResponse = await request(server).get('/recommendations/archive');
      expect(archivedResponse.status).toBe(200);
      const isArchived = archivedResponse.body.data.some(
        (r: any) => r.recommendationId === recommendation.recommendationId
      );
      expect(isArchived).toBeTruthy();
      console.log('Found in archived:', isArchived);

      // Verify it's not in active recommendations
      const activeAfterArchive = await request(server).get('/recommendations');
      const notInActive = !activeAfterArchive.body.data.some(
        (r: any) => r.recommendationId === recommendation.recommendationId
      );
      expect(notInActive).toBeTruthy();
      console.log('Not in active after archive:', notInActive);

      // Unarchive the recommendation
      const unarchiveResponse = await request(server).post(
        `/recommendations/${recommendation.recommendationId}/unarchive`
      );
      expect(unarchiveResponse.status).toBe(200);
      expect(unarchiveResponse.body.success).toBeTruthy();
      console.log('Unarchive response:', unarchiveResponse.body);

      // Verify it's back in active recommendations
      const finalActiveResponse = await request(server).get('/recommendations');
      console.log('Final active recommendations count:', finalActiveResponse.body.data.length);
      console.log(
        'Final active recommendations:',
        finalActiveResponse.body.data.map((r: any) => r.recommendationId)
      );

      const isBackInActive = finalActiveResponse.body.data.some(
        (r: any) => r.recommendationId === recommendation.recommendationId
      );
      console.log('Looking for recommendation:', recommendation.recommendationId);
      console.log('Found back in active:', isBackInActive);
      expect(isBackInActive).toBeTruthy();

      // Verify it's no longer in archived recommendations
      const finalArchivedResponse = await request(server).get('/recommendations/archive');
      const notInArchived = !finalArchivedResponse.body.data.some(
        (r: any) => r.recommendationId === recommendation.recommendationId
      );
      expect(notInArchived).toBeTruthy();
      console.log('Not in archived after unarchive:', notInArchived);
    });

    it('should handle archive/unarchive errors', async () => {
      const nonExistentId = 'non-existent-id';

      const archiveResponse = await request(server).post(`/recommendations/${nonExistentId}/archive`);
      expect(archiveResponse.status).toBe(404);

      const unarchiveResponse = await request(server).post(`/recommendations/${nonExistentId}/unarchive`);
      expect(unarchiveResponse.status).toBe(404);
    });
  });

  // [Rest of the test cases remain the same]
});
