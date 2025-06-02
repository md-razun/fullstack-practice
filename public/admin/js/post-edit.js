document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postIdInput = document.getElementById('post-id');
    const titleInput = document.getElementById('title');
    const slugInput = document.getElementById('slug');
    const contentInput = document.getElementById('content');
    const pageMainTitle = document.getElementById('page-main-title');
    const submitButton = document.getElementById('submit-form-button');
    const formFeedback = document.getElementById('form-feedback');

    const queryParams = new URLSearchParams(window.location.search);
    const currentPostId = queryParams.get('id');
    let isEditMode = false;

    if (currentPostId) {
        isEditMode = true;
        pageMainTitle.textContent = 'Edit Post';
        submitButton.textContent = 'Update Post';
        fetchPostData(currentPostId);
    } else {
        pageMainTitle.textContent = 'Create New Post';
        submitButton.textContent = 'Save Post';
    }

    async function fetchPostData(postId) {
        try {
            // TODO: Add authentication headers if required
            const response = await fetch(`/api/admin/posts/${postId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    displayFeedback('Post not found. You will be redirected.', 'error', true, true);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const post = await response.json();
            populateForm(post);
        } catch (error) {
            console.error('Error fetching post data:', error);
            if (!formFeedback.textContent) { // Avoid overwriting specific 404 message
                 displayFeedback(`Error fetching post data: ${error.message}`, 'error');
            }
        }
    }

    function populateForm(post) {
        postIdInput.value = post.id;
        titleInput.value = post.title || '';
        slugInput.value = post.slug || '';
        contentInput.value = post.content || '';
    }

    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = isEditMode ? 'Updating...' : 'Saving...';
        displayFeedback('', '', false); // Clear previous feedback

        const postData = {
            title: titleInput.value,
            slug: slugInput.value.trim() === '' ? null : slugInput.value.trim(), // Send null if empty for auto-generation
            content: contentInput.value,
        };

        let url = '/api/admin/posts';
        let method = 'POST';

        if (isEditMode) {
            url += `/${currentPostId}`;
            method = 'PUT';
        }

        try {
            // TODO: Add authentication headers if required
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
            }
            
            const successMessage = isEditMode ? 'Post updated successfully!' : 'Post created successfully!';
            displayFeedback(successMessage, 'success');

            if (!isEditMode && responseData.id) { // If new post created, switch to edit mode for this post
                isEditMode = true;
                postIdInput.value = responseData.id; // Store new ID
                window.history.replaceState({}, '', `/admin/post-edit.html?id=${responseData.id}`); // Update URL without reload
                pageMainTitle.textContent = 'Edit Post';
                submitButton.textContent = 'Update Post';
            }
             setTimeout(() => {
                window.location.href = '/admin/posts.html'; // Redirect after a short delay
            }, 1500);


        } catch (error) {
            console.error('Error submitting form:', error);
            displayFeedback(`Error: ${error.message}`, 'error');
        } finally {
            submitButton.disabled = false;
            // Restore button text based on current mode (in case it didn't redirect)
             submitButton.textContent = isEditMode ? 'Update Post' : 'Save Post';
        }
    });
    
    function displayFeedback(message, type, autoHide = true, redirectToList = false) {
        formFeedback.textContent = message;
        formFeedback.className = type; // 'success' or 'error'
        formFeedback.style.display = message ? 'block' : 'none';

        if (autoHide && message) {
            setTimeout(() => {
                formFeedback.style.display = 'none';
                if (redirectToList) {
                     window.location.href = '/admin/posts.html';
                }
            }, 3000); // Hide after 3 seconds
        }
    }
});
