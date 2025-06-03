import React from 'react';
import './BlogPage.css';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'My First Blog Post',
      content: 'This is the content of my first blog post. Exciting stuff!'
    },
    {
      id: 2,
      title: 'React Tips and Tricks',
      content: 'Here are some useful tips for developing with React. Stay tuned for more details.'
    },
    {
      id: 3,
      title: 'Understanding State and Props',
      content: 'A deep dive into how state and props work in React components.'
    }
  ];

  return (
    <div className="blog-page-container">
      <h1 className="large text-primary">Blog</h1>
      <p className="lead">
        <i className="fas fa-blog"></i> Welcome to our blog!
      </p>
      <div className="posts">
        {blogPosts.map(post => (
          <div key={post.id} className="blog-post">
            <h2 className="blog-post-title">{post.title}</h2>
            <p className="blog-post-content">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
