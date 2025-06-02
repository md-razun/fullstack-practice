// Stubbed database functions (replace with actual database interactions)
const db = {
  createPost: async (data) => {
    console.log('db.createPost called with:', data);
    return { id: Date.now(), ...data, created_at: new Date(), updated_at: new Date() };
  },
  getAllPosts: async () => {
    console.log('db.getAllPosts called');
    return [{ id: 1, title: 'Test Post 1', content: 'Content 1', slug: 'test-post-1', author_id: 1, created_at: new Date(), updated_at: new Date() }];
  },
  getPostById: async (postId) => {
    console.log('db.getPostById called with:', postId);
    if (postId === '1' || postId === 1) {
      return { id: 1, title: 'Test Post 1', content: 'Content 1', slug: 'test-post-1', author_id: 1, created_at: new Date(), updated_at: new Date() };
    }
    return null;
  },
  updatePost: async (postId, data) => {
    console.log('db.updatePost called with:', postId, data);
    if (postId === '1' || postId === 1) {
      return { id: 1, ...data, updated_at: new Date() };
    }
    return null;
  },
  deletePost: async (postId) => {
    console.log('db.deletePost called with:', postId);
    if (postId === '1' || postId === 1) {
      return { message: 'Post deleted successfully' };
    }
    return null;
  },
};

// Helper function to generate slug (basic version)
const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

// Controller functions
exports.createPost = async (req, res) => {
  // TODO: Add admin authentication/authorization check
  const { title, content } = req.body;
  let { slug } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  if (!slug) {
    slug = generateSlug(title);
  } else {
    slug = generateSlug(slug); // Sanitize provided slug
  }

  // Assuming author_id would come from the authenticated user
  // For now, let's use a placeholder.
  const author_id = 1; // Placeholder for actual authenticated admin user ID

  try {
    const newPost = await db.createPost({ title, content, slug, author_id });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.getAllPosts = async (req, res) => {
  // TODO: Add admin authentication/authorization check
  try {
    const posts = await db.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error getting all posts:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};

exports.getPostById = async (req, res) => {
  // TODO: Add admin authentication/authorization check
  const { postId } = req.params;

  if (!postId || isNaN(parseInt(postId))) {
    return res.status(400).json({ error: 'Valid Post ID is required' });
  }

  try {
    const post = await db.getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(`Error getting post by ID ${postId}:`, error);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
};

exports.updatePost = async (req, res) => {
  // TODO: Add admin authentication/authorization check
  const { postId } = req.params;
  const { title, content } = req.body;
  let { slug } = req.body;

  if (!postId || isNaN(parseInt(postId))) {
    return res.status(400).json({ error: 'Valid Post ID is required' });
  }

  if (!title && !content && !slug) {
    return res.status(400).json({ error: 'At least one field (title, content, slug) must be provided for update' });
  }

  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (slug) {
    updateData.slug = generateSlug(slug);
  } else if (title) {
    // If title is being updated and slug is not provided, regenerate slug
    updateData.slug = generateSlug(title);
  }


  try {
    const updatedPost = await db.updatePost(postId, updateData);
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found or failed to update' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(`Error updating post by ID ${postId}:`, error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  // TODO: Add admin authentication/authorization check
  const { postId } = req.params;

  if (!postId || isNaN(parseInt(postId))) {
    return res.status(400).json({ error: 'Valid Post ID is required' });
  }

  try {
    const result = await db.deletePost(postId);
    if (!result) {
      return res.status(404).json({ error: 'Post not found or failed to delete' });
    }
    res.status(200).json(result); // or res.status(204).send();
  } catch (error) {
    console.error(`Error deleting post by ID ${postId}:`, error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
