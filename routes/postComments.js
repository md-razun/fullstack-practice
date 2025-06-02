const express = require('express');
// This router will be mounted with a prefix like /api/posts/:postIdOrSlug/comments
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');

// TODO: Add user authentication middleware for creating comments
// router.use(userAuthenticationMiddleware); // Example placeholder

// POST /api/posts/:postIdOrSlug/comments - Create a new comment for a post
router.post('/', commentController.createCommentForPost);

// GET /api/posts/:postIdOrSlug/comments - Read comments for a post
router.get('/', commentController.getCommentsForPost);

module.exports = router;
