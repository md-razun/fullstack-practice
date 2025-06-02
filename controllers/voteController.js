// Stubbed database functions (replace with actual database interactions)
// These would interact with the LikesDislikes table
const db = {
  // Simulate fetching existing vote
  getVote: async (userId, contentType, contentId) => {
    console.log('db.getVote called with:', { userId, contentType, contentId });
    // Example: find a vote in a mock DB
    // For testing:
    // if (userId === 1 && contentType === 'post' && contentId === '1' && MOCK_DB_VOTES['post-1']) return MOCK_DB_VOTES['post-1'][userId];
    // if (userId === 1 && contentType === 'comment' && contentId === '101' && MOCK_DB_VOTES['comment-101']) return MOCK_DB_VOTES['comment-101'][userId];
    return null; // Simulate no existing vote
  },
  createVote: async (userId, contentType, contentId, voteType) => {
    console.log('db.createVote called with:', { userId, contentType, contentId, voteType });
    return { id: Date.now(), user_id: userId, content_type: contentType, content_id: contentId, vote_type: voteType, created_at: new Date() };
  },
  updateVote: async (voteId, voteType) => {
    console.log('db.updateVote called with:', { voteId, voteType });
    return { id: voteId, vote_type: voteType, updated_at: new Date() }; // Assuming updated_at is handled by DB or ORM
  },
  deleteVote: async (voteId) => {
    console.log('db.deleteVote called with:', { voteId });
    return { message: 'Vote removed successfully' };
  },
  // Simulating Post/Comment DB functions for context
  getPostByIdOrSlug: async (identifier) => {
    console.log('db.getPostByIdOrSlug (from voteController) called with:', identifier);
    if (identifier === '1' || identifier === 'existing-post-slug' || identifier === 1) {
      return { id: 1, title: 'Existing Post for Voting' };
    }
     if (identifier === 'string-id-post' || identifier === 'string-id-post-slug') {
      return { id: 'string-id-post', title: 'Existing Post with String ID for Voting'};
    }
    return null;
  },
  getCommentById: async (commentId) => {
    console.log('db.getCommentById (from voteController) called with:', commentId);
    if (commentId === '101' || commentId === 101) {
      return { id: 101, content: 'Existing Comment for Voting' };
    }
    return null;
  }
};

// In-memory store for votes for simulation purposes (would be in DB)
let MOCK_DB_VOTES = {}; // e.g., MOCK_DB_VOTES['post-1'] = { user_id_1: {id: 'voteId1', vote_type: 'like'} }

exports.handleVote = async (req, res) => {
  // TODO: Add user authentication middleware
  // const userId = req.user.id; // Assuming user ID is available after authentication
  const userId = 1; // Placeholder for authenticated user ID

  const { vote_type } = req.body;
  const { postIdOrSlug, commentId } = req.params; // One of these will be defined

  let contentType;
  let contentId;
  let contentEntity;

  if (!['like', 'dislike'].includes(vote_type)) {
    return res.status(400).json({ error: "Invalid vote_type. Must be 'like' or 'dislike'." });
  }

  try {
    if (postIdOrSlug) {
      contentType = 'post';
      contentEntity = await db.getPostByIdOrSlug(postIdOrSlug);
      if (!contentEntity) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      contentId = contentEntity.id; // Use actual ID from post object
    } else if (commentId) {
      contentType = 'comment';
      if (isNaN(parseInt(commentId))) return res.status(400).json({ error: 'Valid Comment ID is required.'});
      contentEntity = await db.getCommentById(commentId);
      if (!contentEntity) {
        return res.status(404).json({ error: 'Comment not found.' });
      }
      contentId = contentEntity.id; // Use actual ID from comment object
    } else {
      return res.status(400).json({ error: 'Content identifier (postIdOrSlug or commentId) is missing.' });
    }

    // Simulate DB interaction for getVote more accurately with MOCK_DB_VOTES
    const contentKey = `${contentType}-${contentId}`;
    const existingVote = MOCK_DB_VOTES[contentKey] && MOCK_DB_VOTES[contentKey][userId]
      ? MOCK_DB_VOTES[contentKey][userId]
      : await db.getVote(userId, contentType, contentId); // Fallback for initial load if needed

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // User is submitting the same vote_type again, so remove the vote (toggle off)
        await db.deleteVote(existingVote.id);
        // Update MOCK_DB_VOTES
        if (MOCK_DB_VOTES[contentKey]) {
          delete MOCK_DB_VOTES[contentKey][userId];
          if (Object.keys(MOCK_DB_VOTES[contentKey]).length === 0) {
            delete MOCK_DB_VOTES[contentKey];
          }
        }
        return res.status(200).json({ message: 'Vote removed.' });
      } else {
        // User is changing their vote_type (e.g., from like to dislike)
        const updatedVote = await db.updateVote(existingVote.id, vote_type);
        // Update MOCK_DB_VOTES
        if (MOCK_DB_VOTES[contentKey] && MOCK_DB_VOTES[contentKey][userId]) {
            MOCK_DB_VOTES[contentKey][userId].vote_type = vote_type;
        }
        return res.status(200).json({ message: 'Vote updated.', vote: updatedVote });
      }
    } else {
      // No existing vote, create a new one
      const newVote = await db.createVote(userId, contentType, contentId, vote_type);
      // Update MOCK_DB_VOTES
      if (!MOCK_DB_VOTES[contentKey]) {
        MOCK_DB_VOTES[contentKey] = {};
      }
      MOCK_DB_VOTES[contentKey][userId] = {id: newVote.id, vote_type: newVote.vote_type}; // Store simplified info
      return res.status(201).json({ message: 'Vote cast.', vote: newVote });
    }

  } catch (error) {
    console.error('Error handling vote:', error);
    res.status(500).json({ error: 'Failed to process vote.' });
  }
};
