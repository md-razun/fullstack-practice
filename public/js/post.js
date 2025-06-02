document.addEventListener('DOMContentLoaded', () => {
    const postDetailContainer = document.getElementById('post-detail');
    const postTitleHeader = document.getElementById('post-title-header');
    const pageTitle = document.querySelector('title');

    // Comment related elements
    const commentsListContainer = document.getElementById('comments-list');
    const commentsPaginationContainer = document.getElementById('comments-pagination-controls');
    const commentForm = document.getElementById('comment-form');
    const commentContentInput = document.getElementById('comment-content');
    const commentFormFeedback = document.getElementById('comment-form-feedback');
    const submitCommentButton = document.getElementById('submit-comment-button');

    // Post vote elements
    const likePostButton = document.getElementById('like-post-button');
    const dislikePostButton = document.getElementById('dislike-post-button');
    const postLikesCountSpan = document.getElementById('post-likes-count');
    const postDislikesCountSpan = document.getElementById('post-dislikes-count');
    const postVoteFeedback = document.getElementById('post-vote-feedback');


    // Get post ID or slug from URL query parameter
    const queryParams = new URLSearchParams(window.location.search);
    let postIdOrSlug = queryParams.get('id') || queryParams.get('slug'); // Prefer 'id' if both somehow present
    let actualPostId = null; // To be populated after fetching the post, used for comment actions

    if (!postIdOrSlug) {
        postDetailContainer.innerHTML = '<p>No post identifier (ID or slug) found in URL.</p>';
        commentsListContainer.innerHTML = ''; // Clear comments section too
        commentForm.style.display = 'none';
        return;
    }

    async function fetchPost(identifier) {
        try {
            postDetailContainer.innerHTML = '<p>Loading post...</p>';
            const response = await fetch(`/api/posts/${identifier}`);
            if (!response.ok) {
                if (response.status === 404) {
                    postDetailContainer.innerHTML = '<p>Post not found.</p>';
                    commentsListContainer.innerHTML = ''; // Clear comments section too
                    commentForm.style.display = 'none';
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return; // Stop further execution if post not found or error
            }
            const post = await response.json();
            actualPostId = post.id; // Store the actual ID for comment operations
            postIdOrSlug = post.slug || post.id; // Prefer slug for canonical URL if available, useful for refresh
            renderPost(post);
            fetchComments(1); // Load first page of comments
            // TODO: Fetch initial vote counts for the post and user's vote status
            // e.g., fetchPostVoteStatus(actualPostId); 
        } catch (error) {
            console.error('Error fetching post:', error);
            postDetailContainer.innerHTML = '<p>Error loading post. Please try again later.</p>';
            commentsListContainer.innerHTML = '';
            commentForm.style.display = 'none';
            document.getElementById('post-vote-section').style.display = 'none';
        }
    }

    function renderPost(post) {
        if (!post) {
            postDetailContainer.innerHTML = '<p>Post data is not available.</p>';
            return;
        }
        const titleText = post.title || 'Untitled Post';
        pageTitle.textContent = titleText;
        postTitleHeader.textContent = titleText;
        postDetailContainer.innerHTML = ''; 

        const titleElement = document.createElement('h1');
        titleElement.textContent = titleText;

        const metaElement = document.createElement('p');
        metaElement.classList.add('post-meta');
        const authorName = post.author ? post.author.name : `User ${post.author_id || 'Unknown'}`;
        const postDate = post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown Date';
        metaElement.textContent = `By ${authorName} on ${postDate}`;

        const contentElement = document.createElement('div');
        contentElement.classList.add('post-content');
        contentElement.innerHTML = post.content ? post.content.replace(/\n/g, '<br>') : '<p>No content available.</p>';

        postDetailContainer.appendChild(titleElement);
        postDetailContainer.appendChild(metaElement);
        postDetailContainer.appendChild(contentElement);
    }

    async function fetchComments(page = 1) {
        if (!actualPostId && !postIdOrSlug) { // Need postIdOrSlug for initial fetch if actualPostId not yet set.
             console.error("Post identifier not available for fetching comments.");
             commentsListContainer.innerHTML = '<p>Cannot load comments: Post identifier missing.</p>';
             return;
        }
        // Use postIdOrSlug for fetching comments as per API spec /api/posts/{postIdOrSlug}/comments
        const identifierForApi = postIdOrSlug;

        try {
            commentsListContainer.innerHTML = '<p>Loading comments...</p>';
            // Assuming API supports pagination for comments e.g. /api/posts/{id}/comments?page=1&limit=5
            const response = await fetch(`/api/posts/${identifierForApi}/comments?page=${page}&limit=5`);
            if (!response.ok) {
                if (response.status === 404) { // Post itself not found, though fetchPost should catch this first
                     commentsListContainer.innerHTML = '<p>Post not found, cannot load comments.</p>';
                } else {
                    throw new Error(`HTTP error fetching comments! status: ${response.status}`);
                }
                return;
            }
            const data = await response.json();
            renderComments(data.comments); // Assuming API returns { comments: [], totalPages: X, currentPage: Y }
            renderCommentsPagination(data.totalPages, data.currentPage);
        } catch (error) {
            console.error('Error fetching comments:', error);
            commentsListContainer.innerHTML = '<p>Error loading comments.</p>';
        }
    }

    function renderComments(comments) {
        if (!comments || comments.length === 0) {
            commentsListContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
            return;
        }
        commentsListContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment-item'); // Add a class for styling
            commentElement.style.borderBottom = "1px solid #eee";
            commentElement.style.padding = "10px 0";


            const meta = document.createElement('p');
            meta.classList.add('comment-meta'); // Similar to post-meta
            // TODO: Replace with actual author username when API provides it
            const authorUsername = comment.user ? comment.user.username : `User ${comment.user_id || 'Unknown'}`;
            const commentDate = new Date(comment.created_at).toLocaleString();
            meta.innerHTML = `<strong>${authorUsername}</strong> on ${commentDate}`;
            
            const content = document.createElement('p');
            content.textContent = comment.content;
            
            commentElement.appendChild(meta);
            commentElement.appendChild(content);

            // Placeholder for Edit/Delete buttons
            // TODO: Check if current user is authenticated and owns the comment
            // const currentUserId = 1; // Example: Get from auth state
            // if (comment.user_id === currentUserId) { 
            //     const actions = document.createElement('div');
            //     actions.classList.add('comment-actions');
            //     actions.style.marginTop = '5px';

            //     const editButton = document.createElement('button');
            //     editButton.textContent = 'Edit';
            //     editButton.style.marginRight = '5px';
            //     editButton.onclick = () => { /* TODO: Implement editComment(comment.id) */ alert('Edit functionality placeholder'); };
                
            //     const deleteButton = document.createElement('button');
            //     deleteButton.textContent = 'Delete';
            //     deleteButton.style.marginLeft = '5px';
            //     deleteButton.onclick = () => { 
            //         if(confirm('Are you sure you want to delete this comment?')) {
            //             /* TODO: Implement deleteComment(comment.id, commentElement) */ alert('Delete functionality placeholder');
            //         }
            //     };
            //     actions.appendChild(editButton);
            //     actions.appendChild(deleteButton);
            //     commentElement.appendChild(actions);
            // }

            // Vote section for comments
            const commentVoteSection = document.createElement('div');
            commentVoteSection.classList.add('comment-vote-section');
            commentVoteSection.style.marginTop = '5px';

            const likeCommentButton = document.createElement('button');
            likeCommentButton.textContent = 'Like';
            likeCommentButton.dataset.voteType = 'like';
            likeCommentButton.dataset.commentId = comment.id;
            likeCommentButton.classList.add('comment-like-btn'); // For easier selection

            const commentLikesCountSpan = document.createElement('span');
            commentLikesCountSpan.textContent = comment.likes_count || 0; // Assuming API provides this
            commentLikesCountSpan.style.marginLeft = '5px';
            commentLikesCountSpan.style.marginRight = '10px';
            
            const dislikeCommentButton = document.createElement('button');
            dislikeCommentButton.textContent = 'Dislike';
            dislikeCommentButton.dataset.voteType = 'dislike';
            dislikeCommentButton.dataset.commentId = comment.id;
            dislikeCommentButton.classList.add('comment-dislike-btn'); // For easier selection

            const commentDislikesCountSpan = document.createElement('span');
            commentDislikesCountSpan.textContent = comment.dislikes_count || 0; // Assuming API provides this
            commentDislikesCountSpan.style.marginLeft = '5px';

            // TODO: Highlight buttons if user has already voted on this comment
            // e.g. if (comment.user_vote === 'like') likeCommentButton.classList.add('active-vote');

            commentVoteSection.appendChild(likeCommentButton);
            commentVoteSection.appendChild(commentLikesCountSpan);
            commentVoteSection.appendChild(dislikeCommentButton);
            commentVoteSection.appendChild(commentDislikesCountSpan);
            commentElement.appendChild(commentVoteSection);


            commentsListContainer.appendChild(commentElement);
        });

        // Add event listeners for all new comment vote buttons
        document.querySelectorAll('.comment-like-btn, .comment-dislike-btn').forEach(button => {
            // Check if listener already attached to prevent duplicates if renderComments is called multiple times
            if (!button.dataset.listenerAttached) {
                button.addEventListener('click', handleCommentVote);
                button.dataset.listenerAttached = 'true';
            }
        });
    }

    function renderCommentsPagination(totalPages, currentPage) {
        commentsPaginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => fetchComments(currentPage - 1));
            commentsPaginationContainer.appendChild(prevButton);
        }
        
        const pageInfo = document.createElement('span');
        pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
        pageInfo.style.margin = "0 10px";
        commentsPaginationContainer.appendChild(pageInfo);

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => fetchComments(currentPage + 1));
            commentsPaginationContainer.appendChild(nextButton);
        }
    }
    
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // TODO: Check if user is authenticated before allowing submission
        // if (!user.isAuthenticated) { displayCommentFormFeedback('Please log in to comment.', 'error'); return; }

        const content = commentContentInput.value.trim();
        if (!content) {
            displayCommentFormFeedback('Comment cannot be empty.', 'error');
            return;
        }

        submitCommentButton.disabled = true;
        submitCommentButton.textContent = 'Submitting...';
        displayCommentFormFeedback('', '', false);


        try {
            // Use postIdOrSlug for posting comment as per API spec /api/posts/{postIdOrSlug}/comments
            const response = await fetch(`/api/posts/${postIdOrSlug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: Add Authorization header if required: e.g., 'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ content: content }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
            }

            displayCommentFormFeedback('Comment submitted successfully!', 'success');
            commentContentInput.value = ''; // Clear textarea
            fetchComments(); // Refresh comments list (or could dynamically add the new one)
        } catch (error) {
            console.error('Error submitting comment:', error);
            displayCommentFormFeedback(`Error: ${error.message}`, 'error');
        } finally {
            submitCommentButton.disabled = false;
            submitCommentButton.textContent = 'Submit Comment';
        }
    });

    function displayCommentFormFeedback(message, type, autoHide = true) {
        commentFormFeedback.textContent = message;
        commentFormFeedback.className = type; // 'success' or 'error' (from style.css or admin.css)
        commentFormFeedback.style.display = message ? 'block' : 'none';
        commentFormFeedback.style.padding = "10px";
        commentFormFeedback.style.borderRadius = "4px";
        if (type === 'success') {
            commentFormFeedback.style.backgroundColor = '#d4edda';
            commentFormFeedback.style.color = '#155724';
            commentFormFeedback.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            commentFormFeedback.style.backgroundColor = '#f8d7da';
            commentFormFeedback.style.color = '#721c24';
            commentFormFeedback.style.border = '1px solid #f5c6cb';
        }


        if (autoHide && message) {
            setTimeout(() => {
                commentFormFeedback.style.display = 'none';
            }, 3000); // Hide after 3 seconds
        }
    }

    // --- Voting Logic ---

    async function handlePostVote(event) {
        // TODO: Check if user is authenticated
        // if (!user.isAuthenticated) { displayPostVoteFeedback('Please log in to vote.', 'error'); return; }

        const voteType = event.target.dataset.voteType;
        if (!postIdOrSlug) return;

        likePostButton.disabled = true;
        dislikePostButton.disabled = true;

        try {
            const response = await fetch(`/api/posts/${postIdOrSlug}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: Add Authorization header: e.g., 'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ vote_type: voteType }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            displayPostVoteFeedback(data.message || 'Vote processed!', 'success');
            // TODO: Update post like/dislike counts based on a more detailed API response
            // For now, just a simple increment/decrement for demo if it's a new vote of that type
            // A real API might return the new counts or the user's current vote status.
            // This is a simplified UI update.
            if (data.vote) { // Assuming API returns the vote object if created/updated
                if (data.vote.vote_type === 'like') {
                    postLikesCountSpan.textContent = parseInt(postLikesCountSpan.textContent) + 1; // Simplistic
                } else if (data.vote.vote_type === 'dislike') {
                    postDislikesCountSpan.textContent = parseInt(postDislikesCountSpan.textContent) + 1; // Simplistic
                }
            } else if (data.message === "Vote removed.") {
                 // Need to know which type was removed to decrement. This part is tricky without more info from API.
                 // For now, we won't decrement on removal to keep it simple.
            }
            // Ideally, API returns { likes: X, dislikes: Y, userVote: 'like' | 'dislike' | null }
            // Then:
            // postLikesCountSpan.textContent = data.likes;
            // postDislikesCountSpan.textContent = data.dislikes;
            // updateVoteButtonStates(likePostButton, dislikePostButton, data.userVote);

        } catch (error) {
            console.error('Error voting on post:', error);
            displayPostVoteFeedback(`Error: ${error.message}`, 'error');
        } finally {
            likePostButton.disabled = false;
            dislikePostButton.disabled = false;
        }
    }

    async function handleCommentVote(event) {
        // TODO: Check if user is authenticated
        // if (!user.isAuthenticated) { alert('Please log in to vote on comments.'); return; }

        const voteType = event.target.dataset.voteType;
        const commentId = event.target.dataset.commentId;
        
        const specificLikeButton = document.querySelector(`.comment-like-btn[data-comment-id="${commentId}"]`);
        const specificDislikeButton = document.querySelector(`.comment-dislike-btn[data-comment-id="${commentId}"]`);

        if(specificLikeButton) specificLikeButton.disabled = true;
        if(specificDislikeButton) specificDislikeButton.disabled = true;

        try {
            const response = await fetch(`/api/comments/${commentId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: Add Authorization header
                },
                body: JSON.stringify({ vote_type: voteType }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            // alert(data.message || 'Comment vote processed!'); // Simple feedback
            // TODO: Update specific comment's like/dislike counts and button states
            // Similar to post voting, this needs a more detailed API response.
            // For example:
            // const commentElement = event.target.closest('.comment-item');
            // const likeCountSpan = commentElement.querySelector('.comment-likes-count-class'); // Need to add classes for these
            // const dislikeCountSpan = commentElement.querySelector('.comment-dislikes-count-class');
            // likeCountSpan.textContent = data.likes;
            // dislikeCountSpan.textContent = data.dislikes;
            // updateVoteButtonStates(specificLikeButton, specificDislikeButton, data.userVote);
            console.log('Comment vote success:', data); // For now, just log. UI update needs more structure.


        } catch (error) {
            console.error(`Error voting on comment ${commentId}:`, error);
            alert(`Error voting on comment: ${error.message}`);
        } finally {
            if(specificLikeButton) specificLikeButton.disabled = false;
            if(specificDislikeButton) specificDislikeButton.disabled = false;
        }
    }
    
    function displayPostVoteFeedback(message, type, autoHide = true) {
        postVoteFeedback.textContent = message;
        postVoteFeedback.className = type; // 'success' or 'error'
        postVoteFeedback.style.display = message ? 'block' : 'none';
         // Apply styles similar to commentFormFeedback
        postVoteFeedback.style.padding = "10px";
        postVoteFeedback.style.borderRadius = "4px";
        if (type === 'success') {
            postVoteFeedback.style.backgroundColor = '#d4edda';
            postVoteFeedback.style.color = '#155724';
            postVoteFeedback.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            postVoteFeedback.style.backgroundColor = '#f8d7da';
            postVoteFeedback.style.color = '#721c24';
            postVoteFeedback.style.border = '1px solid #f5c6cb';
        }

        if (autoHide && message) {
            setTimeout(() => {
                postVoteFeedback.style.display = 'none';
            }, 3000);
        }
    }

    // Add event listeners for post voting
    if (likePostButton && dislikePostButton) {
        likePostButton.addEventListener('click', handlePostVote);
        dislikePostButton.addEventListener('click', handlePostVote);
    }

    // Initial fetch for the post
    fetchPost(postIdOrSlug);
});
