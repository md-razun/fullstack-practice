// Stubbed database functions (replace with actual database interactions)
const db = {
  getAllPublishedPosts: async ({ page = 1, limit = 10 }) => {
    console.log('db.getAllPublishedPosts called with:', { page, limit });
    // Simulate fetching a list of posts with pagination
    const allPosts = [
      { id: 1, title: 'Public Post 1', content: 'Content for public post 1', slug: 'public-post-1', author_id: 1, created_at: new Date(), updated_at: new Date(), status: 'published' },
      { id: 2, title: 'Public Post 2', content: 'Content for public post 2', slug: 'public-post-2', author_id: 2, created_at: new Date(), updated_at: new Date(), status: 'published' },
      { id: 3, title: 'Draft Post 1', content: 'This is a draft', slug: 'draft-post-1', author_id: 1, created_at: new Date(), updated_at: new Date(), status: 'draft' }, // Should not be returned
    ];
    const publishedPosts = allPosts.filter(post => post.status === 'published');
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = publishedPosts.slice(startIndex, endIndex);
    return {
      posts: paginatedPosts,
      totalPosts: publishedPosts.length,
      currentPage: page,
      totalPages: Math.ceil(publishedPosts.length / limit)
    };
  },
  getPostByIdOrSlug: async (identifier) => {
    console.log('db.getPostByIdOrSlug called with:', identifier);
    const posts = [
      { id: 1, title: 'Public Post 1', content: 'Content for public post 1', slug: 'public-post-1', author_id: 1, created_at: new Date(), updated_at: new Date(), status: 'published' },
      { id: 'some-uuid-string-for-id', title: 'UUID Post', content: 'Content for UUID post', slug: 'uuid-post', author_id: 1, created_at: new Date(), updated_at: new Date(), status: 'published' },
      { id: 2, title: 'Another Public Post', content: 'Content for another post', slug: 'another-public-post', author_id: 2, created_at: new Date(), updated_at: new Date(), status: 'published' }
    ];
    // Check if identifier is numeric (potential ID) or string (potential slug or string ID)
    const isNumericId = /^\d+$/.test(identifier);
    let foundPost = null;

    if (isNumericId) {
      foundPost = posts.find(post => post.id === parseInt(identifier) && post.status === 'published');
    }
    if (!foundPost) { // If not found by numeric ID, or if identifier is not numeric, try by slug or string ID
        foundPost = posts.find(post => (post.slug === identifier || post.id === identifier) && post.status === 'published');
    }
    return foundPost;
  }
};

// Controller functions
exports.getAllPublishedPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1) {
    return res.status(400).json({ error: 'Page number must be 1 or greater.' });
  }
  if (limit < 1 || limit > 100) { // Set a reasonable max limit
    return res.status(400).json({ error: 'Limit must be between 1 and 100.' });
  }

  try {
    const result = await db.getAllPublishedPosts({ page, limit });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting all published posts:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};

exports.getPostByIdOrSlug = async (req, res) => {
  const { postIdOrSlug } = req.params;

  if (!postIdOrSlug) {
    return res.status(400).json({ error: 'Post ID or slug is required' });
  }

  try {
    const post = await db.getPostByIdOrSlug(postIdOrSlug);
    if (!post) {
      return res.status(404).json({ error: 'Post not found or not published' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(`Error getting post by ID or slug ${postIdOrSlug}:`, error);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
};
