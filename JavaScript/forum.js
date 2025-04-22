document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const createPostContainer = document.getElementById('create-post-container');
    const createPostForm = document.getElementById('create-post-form');
    const loginRequiredMessage = document.querySelector('.login-required-message');
    const forumPosts = document.getElementById('forum-posts');
    const noPostsMessage = document.getElementById('no-posts-message');
    const loginPrompt = document.getElementById('login-prompt');
    const registerPrompt = document.getElementById('register-prompt');
    const filterCategory = document.getElementById('filter-category');
    const sortPosts = document.getElementById('sort-posts');

    // Initialize forum
    initForum();

    // Event listeners
    loginPrompt.addEventListener('click', () => openModal('login-modal'));
    registerPrompt.addEventListener('click', () => openModal('register-modal'));
    
    createPostForm.addEventListener('submit', handlePostSubmission);
    
    filterCategory.addEventListener('change', filterAndSortPosts);
    sortPosts.addEventListener('change', filterAndSortPosts);

    /**
     * Initialize the forum
     */
    function initForum() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        // Check if user is logged in
        if (userData) {
            createPostForm.style.display = 'block';
            loginRequiredMessage.style.display = 'none';
        } else {
            createPostForm.style.display = 'none';
            loginRequiredMessage.style.display = 'block';
        }
        
        // Load existing posts
        loadPosts();
        
        // Add event delegation for post actions
        forumPosts.addEventListener('click', handlePostActions);
    }

    /**
     * Handle post submission
     */
    function handlePostSubmission(e) {
        e.preventDefault();
        
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            showNotification('Du må være logget inn for å opprette innlegg.', 'fa-exclamation-circle');
            return;
        }
        
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        
        const post = {
            id: Date.now().toString(),
            title,
            category,
            content,
            author: {
                name: userData.firstName,
                email: userData.email
            },
            date: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: []
        };
        
        // Save post
        savePost(post);
        
        // Reset form
        createPostForm.reset();
        
        // Show notification
        showNotification('Innlegget ditt er publisert!');
        
        // Reload posts
        loadPosts();
    }

    /**
     * Save post to localStorage
     */
    function savePost(post) {
        let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        posts.push(post);
        localStorage.setItem('forumPosts', JSON.stringify(posts));
    }

    /**
     * Load posts from localStorage
     */
    function loadPosts() {
        let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        
        // Apply filter and sort
        posts = filterAndSortPostsData(posts);
        
        // Clear existing posts
        while (forumPosts.firstChild && forumPosts.firstChild.id !== 'no-posts-message') {
            forumPosts.removeChild(forumPosts.firstChild);
        }
        
        // Show or hide no posts message
        if (posts.length === 0) {
            noPostsMessage.style.display = 'block';
        } else {
            noPostsMessage.style.display = 'none';
            
            // Render posts
            posts.forEach(post => {
                const postElement = createPostElement(post);
                forumPosts.insertBefore(postElement, noPostsMessage);
            });
        }
    }

    /**
     * Create HTML element for a post
     */
    function createPostElement(post) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const isLoggedIn = !!userData;
        const userEmail = userData ? userData.email : null;
        
        // Check if user has liked or disliked the post
        const hasLiked = post.likedBy && post.likedBy.includes(userEmail);
        const hasDisliked = post.dislikedBy && post.dislikedBy.includes(userEmail);
        
        // Format date
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('no-NO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create post element
        const postElement = document.createElement('div');
        postElement.className = 'forum-post';
        postElement.dataset.postId = post.id;
        
        postElement.innerHTML = `
            <div class="post-header">
                <div>
                    <h3 class="post-title">${post.title}</h3>
                    <span class="post-category">${getCategoryName(post.category)}</span>
                </div>
            </div>
            <div class="post-content">
                ${post.content.replace(/\n/g, '<br>')}
            </div>
            <div class="post-footer">
                <div class="post-meta">
                    <div class="post-author">
                        <span class="post-author-name">${post.author.name}</span>
                    </div>
                    <div class="post-date">${formattedDate}</div>
                </div>
                <div class="post-actions">
                    <button class="post-action-btn like-btn ${hasLiked ? 'liked' : ''}" data-action="like" ${!isLoggedIn ? 'disabled' : ''}>
                        <i class="fas fa-thumbs-up"></i> <span class="like-count">${post.likes}</span>
                    </button>
                    <button class="post-action-btn dislike-btn ${hasDisliked ? 'disliked' : ''}" data-action="dislike" ${!isLoggedIn ? 'disabled' : ''}>
                        <i class="fas fa-thumbs-down"></i> <span class="dislike-count">${post.dislikes}</span>
                    </button>
                </div>
            </div>
        `;
        
        return postElement;
    }

    /**
     * Handle post actions (like, dislike)
     */
    function handlePostActions(e) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            if (e.target.closest('.post-action-btn')) {
                showNotification('Du må være logget inn for å like eller dislike innlegg.', 'fa-exclamation-circle');
            }
            return;
        }
        
        const actionBtn = e.target.closest('.post-action-btn');
        if (!actionBtn) return;
        
        const postElement = actionBtn.closest('.forum-post');
        const postId = postElement.dataset.postId;
        const action = actionBtn.dataset.action;
        
        updatePostVote(postId, action, userData.email);
    }

    /**
     * Update post vote (like or dislike)
     */
    function updatePostVote(postId, action, userEmail) {
        let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        const postIndex = posts.findIndex(post => post.id === postId);
        
        if (postIndex === -1) return;
        
        const post = posts[postIndex];
        
        // Initialize arrays if they don't exist
        if (!post.likedBy) post.likedBy = [];
        if (!post.dislikedBy) post.dislikedBy = [];
        
        const hasLiked = post.likedBy.includes(userEmail);
        const hasDisliked = post.dislikedBy.includes(userEmail);
        
        if (action === 'like') {
            if (hasLiked) {
                // Unlike
                post.likes--;
                post.likedBy = post.likedBy.filter(email => email !== userEmail);
            } else {
                // Like
                post.likes++;
                post.likedBy.push(userEmail);
                
                // Remove dislike if exists
                if (hasDisliked) {
                    post.dislikes--;
                    post.dislikedBy = post.dislikedBy.filter(email => email !== userEmail);
                }
            }
        } else if (action === 'dislike') {
            if (hasDisliked) {
                // Remove dislike
                post.dislikes--;
                post.dislikedBy = post.dislikedBy.filter(email => email !== userEmail);
            } else {
                // Dislike
                post.dislikes++;
                post.dislikedBy.push(userEmail);
                
                // Remove like if exists
                if (hasLiked) {
                    post.likes--;
                    post.likedBy = post.likedBy.filter(email => email !== userEmail);
                }
            }
        }
        
        // Update posts in localStorage
        posts[postIndex] = post;
        localStorage.setItem('forumPosts', JSON.stringify(posts));
        
        // Reload posts
        loadPosts();
    }

    /**
     * Filter and sort posts
     */
    function filterAndSortPosts() {
        loadPosts();
    }

    /**
     * Apply filter and sort to posts data
     */
    function filterAndSortPostsData(posts) {
        // Filter by category
        const category = filterCategory.value;
        if (category !== 'all') {
            posts = posts.filter(post => post.category === category);
        }
        
        // Sort posts
        const sortBy = sortPosts.value;
        if (sortBy === 'newest') {
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'oldest') {
            posts.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === 'most-liked') {
            posts.sort((a, b) => b.likes - a.likes);
        }
        
        return posts;
    }

    /**
     * Get category display name
     */
    function getCategoryName(categoryValue) {
        const categories = {
            'energieffektivitet': 'Energieffektivitet',
            'baerekraftig-praksis': 'Bærekraftig Praksis',
            'verktoy': 'Verktøy & Ressurser',
            'sporsmal': 'Spørsmål og Svar',
            'annet': 'Annet'
        };
        
        return categories[categoryValue] || categoryValue;
    }

    // Listen for login status changes
    document.addEventListener('userLoggedIn', function() {
        // Update UI when user logs in
        createPostForm.style.display = 'block';
        loginRequiredMessage.style.display = 'none';
        loadPosts(); // Reload posts to update action buttons
    });
    
    document.addEventListener('userLoggedOut', function() {
        // Update UI when user logs out
        createPostForm.style.display = 'none';
        loginRequiredMessage.style.display = 'block';
        loadPosts(); // Reload posts to update action buttons
    });
});
