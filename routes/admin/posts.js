const express = require('express');
const router = express.Router();
const adminPostController = require('../../controllers/adminPostController');

// TODO: Add admin authentication middleware

// POST /api/admin/posts - Create a new post
router.post('/', adminPostController.createPost);

// GET /api/admin/posts - List all posts
router.get('/', adminPostController.getAllPosts);

// GET /api/admin/posts/:postId - Get a single post
router.get('/:postId', adminPostController.getPostById);

// PUT /api/admin/posts/:postId - Update a post
router.put('/:postId', adminPostController.updatePost);

// DELETE /api/admin/posts/:postId - Delete a post
router.delete('/:postId', adminPostController.deletePost);

module.exports = router;
