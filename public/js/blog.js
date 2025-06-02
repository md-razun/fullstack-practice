document.addEventListener('DOMContentLoaded', () => {
    const postsListContainer = document.getElementById('posts-list');
    const paginationControlsContainer = document.getElementById('pagination-controls');
    let currentPage = 1;
    const limit = 10; // Or read from a config / API capability

    async function fetchPosts(page = 1) {
        try {
            postsListContainer.innerHTML = '<p>Loading posts...</p>'; // Show loading message
            const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            renderPosts(data.posts);
            renderPagination(data.totalPages, data.currentPage);

        } catch (error) {
            console.error('Error fetching posts:', error);
            postsListContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
        }
    }

    function renderPosts(posts) {
        if (!posts || posts.length === 0) {
            postsListContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }

        postsListContainer.innerHTML = ''; // Clear previous content or loading message
        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('post-item');

            const title = document.createElement('h2');
            const link = document.createElement('a');
            // Assuming post.slug is reliable, otherwise use post.id
            link.href = `/post.html?id=${post.slug || post.id}`; 
            link.textContent = post.title || 'Untitled Post';
            title.appendChild(link);

            const meta = document.createElement('p');
            meta.classList.add('post-meta');
            // Assuming author information might be part of the post object in the future
            // For now, using author_id as a placeholder if available.
            const authorName = post.author ? post.author.name : `User ${post.author_id || 'Unknown'}`;
            const postDate = post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown Date';
            meta.textContent = `By ${authorName} on ${postDate}`;
            
            // Optional: Display a short snippet of content if available
            // const snippet = document.createElement('p');
            // snippet.textContent = post.content ? post.content.substring(0, 150) + '...' : '';


            postElement.appendChild(title);
            postElement.appendChild(meta);
            // postElement.appendChild(snippet); 

            postsListContainer.appendChild(postElement);
        });
    }

    function renderPagination(totalPages, currentPage) {
        paginationControlsContainer.innerHTML = ''; // Clear previous pagination

        if (totalPages <= 1) return; // No need for pagination if only one page

        // Previous Button
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => {
                fetchPosts(currentPage - 1);
            });
            paginationControlsContainer.appendChild(prevButton);
        }

        // Page numbers (optional, could be just prev/next)
        // For simplicity, just showing current page info
        const pageInfo = document.createElement('span');
        pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
        pageInfo.style.margin = "0 10px";
        paginationControlsContainer.appendChild(pageInfo);


        // Next Button
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => {
                fetchPosts(currentPage + 1);
            });
            paginationControlsContainer.appendChild(nextButton);
        }
    }

    // Initial fetch
    fetchPosts(currentPage);
});
