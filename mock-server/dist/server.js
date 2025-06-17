"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDatabase = exports.server = void 0;
const json_server_1 = __importDefault(require("json-server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("./types");
const data_1 = require("./data");
// Create server
exports.server = json_server_1.default.create();
const middlewares = json_server_1.default.defaults();
// Initialize database
let db = {
    recommendations: [],
    archivedRecommendations: [],
};
// Reset database helper for testing
const resetDatabase = () => {
    console.log('Resetting database...');
    db = {
        recommendations: JSON.parse(JSON.stringify(data_1.initialRecommendations)),
        archivedRecommendations: [],
    };
    console.log('Database reset complete. Active recommendations:', db.recommendations.length);
};
exports.resetDatabase = resetDatabase;
// Initialize database with default data
(0, exports.resetDatabase)();
// Middleware
exports.server.use(middlewares);
exports.server.use(json_server_1.default.bodyParser);
// Constants
const SECRET_KEY = 'your-secret-key';
const DEFAULT_LIMIT = 100; // Increased to ensure we get all recommendations in tests
// Utility to check if a string is a RecommendationClass
const isRecommendationClass = (value) => {
    return Object.keys(types_1.RecommendationClass).includes(value);
};
// Utility to check if a string is a CloudProvider
const isCloudProvider = (value) => {
    return Object.keys(types_1.CloudProvider).includes(value);
};
// Utility to filter recommendations
const filterRecommendations = (recommendations, search, tags) => {
    let filtered = [...recommendations];
    // Apply search filter
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter((rec) => rec.title.toLowerCase().includes(searchLower) ||
            rec.description.toLowerCase().includes(searchLower) ||
            rec.reasons.some((reason) => reason.toLowerCase().includes(searchLower)) ||
            rec.frameworks.some((framework) => framework.name.toLowerCase().includes(searchLower)));
    }
    // Apply tag filters
    if (tags && tags.length > 0) {
        filtered = filtered.filter((rec) => tags.every((tag) => {
            // Check frameworks
            if (rec.frameworks.some((framework) => framework.name === tag)) {
                return true;
            }
            // Check reasons
            if (rec.reasons.includes(tag)) {
                return true;
            }
            // Check provider
            if (isCloudProvider(tag) && rec.provider.includes(types_1.CloudProvider[tag])) {
                return true;
            }
            // Check class
            if (isRecommendationClass(tag) && rec.class === types_1.RecommendationClass[tag]) {
                return true;
            }
            return false;
        }));
    }
    return filtered;
};
// Utility to handle cursor-based pagination
const paginateResults = (array, cursor, limit = DEFAULT_LIMIT) => {
    if (array.length === 0) {
        return {
            data: [],
            pagination: {
                cursor: {
                    next: null,
                },
                totalItems: 0,
            },
        };
    }
    const startIndex = cursor ? array.findIndex((item) => item.recommendationId === cursor) : 0;
    // If cursor is not found, start from beginning
    const effectiveStartIndex = startIndex === -1 ? 0 : startIndex;
    const results = array.slice(effectiveStartIndex, effectiveStartIndex + limit);
    const nextCursor = results.length === limit ? results[results.length - 1].recommendationId : null;
    return {
        data: results,
        pagination: {
            cursor: {
                next: nextCursor,
            },
            totalItems: array.length,
        },
    };
};
// Get recommendations with cursor-based pagination, search, and filtering
exports.server.get('/recommendations', (req, res) => {
    try {
        console.log('GET /recommendations - Current active recommendations:', db.recommendations.length);
        const cursor = req.query.cursor;
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        const search = req.query.search;
        const tags = req.query.tags ? req.query.tags.split(',') : undefined;
        // Filter recommendations
        const filtered = filterRecommendations(db.recommendations, search, tags);
        console.log('Filtered recommendations:', filtered.length);
        // Paginate filtered results
        const result = paginateResults(filtered, cursor, limit);
        console.log('Paginated results:', result.data.length);
        // Add available tags to the response
        const availableTags = {
            frameworks: Array.from(new Set(db.recommendations.flatMap((r) => r.frameworks.map((f) => f.name)))),
            reasons: Array.from(new Set(db.recommendations.flatMap((r) => r.reasons))),
            providers: Object.keys(types_1.CloudProvider).filter((key) => isNaN(Number(key))),
            classes: Object.keys(types_1.RecommendationClass).filter((key) => isNaN(Number(key))),
        };
        res.json({
            ...result,
            availableTags,
        });
    }
    catch (error) {
        console.error('Error in GET /recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});
// Get archived recommendations with cursor-based pagination, search, and filtering
exports.server.get('/recommendations/archive', (req, res) => {
    try {
        console.log('GET /recommendations/archive - Current archived recommendations:', db.archivedRecommendations.length);
        const cursor = req.query.cursor;
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        const search = req.query.search;
        const tags = req.query.tags ? req.query.tags.split(',') : undefined;
        // Filter recommendations
        const filtered = filterRecommendations(db.archivedRecommendations, search, tags);
        console.log('Filtered archived recommendations:', filtered.length);
        // Paginate filtered results
        const result = paginateResults(filtered, cursor, limit);
        console.log('Paginated archived results:', result.data.length);
        res.json(result);
    }
    catch (error) {
        console.error('Error in GET /recommendations/archive:', error);
        res.status(500).json({ error: 'Failed to fetch archived recommendations' });
    }
});
// Archive a recommendation
exports.server.post('/recommendations/:id/archive', (req, res) => {
    try {
        const { id } = req.params;
        console.log('POST /recommendations/:id/archive - Archiving recommendation:', id);
        console.log('Before archive - Active:', db.recommendations.length, 'Archived:', db.archivedRecommendations.length);
        const index = db.recommendations.findIndex((r) => r.recommendationId === id);
        if (index === -1) {
            console.log('Recommendation not found for archiving:', id);
            return res.status(404).json({ error: 'Recommendation not found' });
        }
        const recommendation = JSON.parse(JSON.stringify(db.recommendations[index]));
        db.recommendations = db.recommendations.filter((r) => r.recommendationId !== id);
        db.archivedRecommendations = [...db.archivedRecommendations, recommendation];
        console.log('After archive - Active:', db.recommendations.length, 'Archived:', db.archivedRecommendations.length);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error in POST /recommendations/:id/archive:', error);
        res.status(500).json({ error: 'Failed to archive recommendation' });
    }
});
// Unarchive a recommendation
exports.server.post('/recommendations/:id/unarchive', (req, res) => {
    try {
        const { id } = req.params;
        console.log('POST /recommendations/:id/unarchive - Unarchiving recommendation:', id);
        console.log('Before unarchive - Active:', db.recommendations.length, 'Archived:', db.archivedRecommendations.length);
        const index = db.archivedRecommendations.findIndex((r) => r.recommendationId === id);
        if (index === -1) {
            console.log('Archived recommendation not found for unarchiving:', id);
            return res.status(404).json({ error: 'Archived recommendation not found' });
        }
        const recommendation = JSON.parse(JSON.stringify(db.archivedRecommendations[index]));
        db.archivedRecommendations = db.archivedRecommendations.filter((r) => r.recommendationId !== id);
        db.recommendations = [...db.recommendations, recommendation];
        console.log('After unarchive - Active:', db.recommendations.length, 'Archived:', db.archivedRecommendations.length);
        console.log('Unarchived recommendation:', recommendation);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error in POST /recommendations/:id/unarchive:', error);
        res.status(500).json({ error: 'Failed to unarchive recommendation' });
    }
});
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            req.user = { username: decoded.username };
            next();
        }
        catch (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};
// Login endpoint
exports.server.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === 'admin' && password === 'password') {
            const token = jsonwebtoken_1.default.sign({ username }, SECRET_KEY, { expiresIn: '2h' });
            const response = { token };
            res.json(response);
        }
        else {
            const response = { error: 'Invalid credentials' };
            res.status(401).json(response);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
// Apply authentication to protected routes when enabled
if (process.env.USE_AUTH === 'true') {
    exports.server.use('/recommendations', authenticateToken);
}
// Start server if not being used for testing
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001;
    exports.server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
