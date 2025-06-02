const express = require('express');
const router = express.Router();
const publicPostController = require('../../controllers/publicPostController');

// GET /api/posts - List all published posts with pagination
router.get('/', publicPostController.getAllPublishedPosts);

// GET /api/posts/:postIdOrSlug - Get a single post by ID or slug
router.get('/:postIdOrSlug', publicPostController.getPostByIdOrSlug);

// --- Vote on a Post ---
const voteController = require('../../controllers/voteController');
// TODO: Add user authentication middleware for this route
// router.post('/:postIdOrSlug/vote', userAuthMiddleware, voteController.handleVote);
router.post('/:postIdOrSlug/vote', voteController.handleVote);


module.exports = router;
