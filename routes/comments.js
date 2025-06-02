const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// TODO: Add user authentication middleware for updating and deleting comments
// router.use(userAuthenticationMiddleware); // Example placeholder

// PUT /api/comments/:commentId - Update a comment
router.put('/:commentId', commentController.updateComment);

// DELETE /api/comments/:commentId - Delete a comment
router.delete('/:commentId', commentController.deleteComment);

// --- Vote on a Comment ---
const voteController = require('../controllers/voteController');
// TODO: Add user authentication middleware for this route (if not already applied to the whole router)
// router.post('/:commentId/vote', userAuthMiddleware, voteController.handleVote);
router.post('/:commentId/vote', voteController.handleVote);

module.exports = router;
