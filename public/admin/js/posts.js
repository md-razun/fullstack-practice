document.addEventListener('DOMContentLoaded', () => {
    const postsTableBody = document.getElementById('admin-posts-tbody');

    async function fetchAdminPosts() {
        try {
            // TODO: Add authentication headers if required by the API
            const response = await fetch('/api/admin/posts'); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            renderAdminPosts(posts);
        } catch (error) {
            console.error('Error fetching admin posts:', error);
            postsTableBody.innerHTML = '<tr><td colspan="4">Error loading posts. Please try again later.</td></tr>';
        }
    }

    function renderAdminPosts(posts) {
        if (!posts || posts.length === 0) {
            postsTableBody.innerHTML = '<tr><td colspan="4">No posts found.</td></tr>';
            return;
        }

        postsTableBody.innerHTML = ''; // Clear loading message or previous content
        posts.forEach(post => {
            const row = postsTableBody.insertRow();

            const titleCell = row.insertCell();
            titleCell.textContent = post.title || 'N/A';

            const slugCell = row.insertCell();
            slugCell.textContent = post.slug || 'N/A';
            
            const dateCell = row.insertCell();
            dateCell.textContent = post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A';

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                window.location.href = `/admin/post-edit.html?id=${post.id}`;
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                if (confirm(`Are you sure you want to delete the post: "${post.title}"?`)) {
                    await deletePost(post.id);
                }
            });

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }

    async function deletePost(postId) {
        try {
            // TODO: Add authentication headers if required
            const response = await fetch(`/api/admin/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            // alert('Post deleted successfully!'); // Optional
            fetchAdminPosts(); // Refresh the list
        } catch (error) {
            console.error('Error deleting post:', error);
            alert(`Failed to delete post: ${error.message}`);
        }
    }

    // Initial fetch
    fetchAdminPosts();
});
