// Stubbed database functions (replace with actual database interactions)
const db = {
  // Simulating Post DB functions as well for context
  getPostByIdOrSlug: async (identifier) => {
    console.log('db.getPostByIdOrSlug (from commentController) called with:', identifier);
    if (identifier === '1' || identifier === 'existing-post-slug' || identifier === 1) {
      return { id: 1, title: 'Existing Post', status: 'published' };
    }
    if (identifier === 'string-id-post' || identifier === 'string-id-post-slug') {
      return { id: 'string-id-post', title: 'Existing Post with String ID', status: 'published'};
    }
    return null;
  },
  createComment: async (postId, userId, content) => {
    console.log('db.createComment called with:', { postId, userId, content });
    return { id: Date.now(), post_id: postId, user_id: userId, content, created_at: new Date(), updated_at: new Date() };
  },
  getCommentsByPostId: async (postId, { page = 1, limit = 10 }) => {
    console.log('db.getCommentsByPostId called with:', { postId, page, limit });
    // Simulate fetching comments for a post
    const allComments = [
      { id: 101, post_id: postId, user_id: 1, content: 'First comment!', created_at: new Date() },
      { id: 102, post_id: postId, user_id: 2, content: 'Second comment!', created_at: new Date() },
    ];
    // Basic pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedComments = allComments.slice(startIndex, endIndex);
    return {
        comments: paginatedComments,
        totalComments: allComments.length,
        currentPage: page,
        totalPages: Math.ceil(allComments.length / limit)
    };
  },
  getCommentById: async (commentId) => {
    console.log('db.getCommentById called with:', commentId);
    if (commentId === '101' || commentId === 101) {
      return { id: 101, post_id: 1, user_id: 1, content: 'First comment!', created_at: new Date(), updated_at: new Date() };
    }
    return null;
  },
  updateComment: async (commentId, content) => {
    console.log('db.updateComment called with:', { commentId, content });
    return { id: commentId, content, updated_at: new Date() };
  },
  deleteComment: async (commentId) => {
    console.log('db.deleteComment called with:', commentId);
    return { message: 'Comment deleted successfully' };
  }
};

// Controller functions

// POST /api/posts/:postIdOrSlug/comments
exports.createCommentForPost = async (req, res) => {
  // TODO: Add user authentication middleware
  // const userId = req.user.id; // Assuming user ID is available after authentication
  const userId = 1; // Placeholder for authenticated user ID
  const { postIdOrSlug } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    // First, validate if the post exists and is published (or whatever rule applies)
    const post = await db.getPostByIdOrSlug(postIdOrSlug);
    if (!post) {
      return res.status(404).json({ error: 'Post not found or not available for commenting' });
    }
    // Ensure post.id is used for creating comment, regardless of whether slug or ID was passed
    const postId = post.id;

    const newComment = await db.createComment(postId, userId, content);
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// GET /api/posts/:postIdOrSlug/comments
exports.getCommentsForPost = async (req, res) => {
  const { postIdOrSlug } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1) {
    return res.status(400).json({ error: 'Page number must be 1 or greater.' });
  }
  if (limit < 1 || limit > 100) {
    return res.status(400).json({ error: 'Limit must be between 1 and 100.' });
  }

  try {
    // Validate if the post exists
    const post = await db.getPostByIdOrSlug(postIdOrSlug);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const postId = post.id; // Use the actual post ID for fetching comments

    const result = await db.getCommentsByPostId(postId, { page, limit });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting comments for post:', error);
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
};

// PUT /api/comments/:commentId
exports.updateComment = async (req, res) => {
  // TODO: Add user authentication middleware
  // const userId = req.user.id; // Assuming user ID is available
  const userId = 1; // Placeholder
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId || isNaN(parseInt(commentId))) {
    return res.status(400).json({ error: 'Valid Comment ID is required' });
  }

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required for update' });
  }

  try {
    const comment = await db.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // TODO: Check if authenticated user owns the comment
    // if (comment.user_id !== userId) {
    //   return res.status(403).json({ error: 'Forbidden: You do not own this comment' });
    // }

    const updatedComment = await db.updateComment(commentId, content);
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// DELETE /api/comments/:commentId
exports.deleteComment = async (req, res) => {
  // TODO: Add user authentication middleware
  // const userId = req.user.id; // Assuming user ID is available
  // const userIsAdmin = req.user.isAdmin; // Assuming user role is available
  const userId = 1; // Placeholder
  const userIsAdmin = false; // Placeholder
  const { commentId } = req.params;

  if (!commentId || isNaN(parseInt(commentId))) {
    return res.status(400).json({ error: 'Valid Comment ID is required' });
  }

  try {
    const comment = await db.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // TODO: Check if authenticated user owns the comment or is an admin
    // if (comment.user_id !== userId && !userIsAdmin) {
    //   return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this comment' });
    // }

    await db.deleteComment(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' }); // or res.status(204).send();
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
