class ColorGradeApp {
    constructor() {
        this.posts = [];
        this.colors = [];
        this.currentPostIndex = 0;
        this.isLoading = false;
        this.scrollHandler = null;
        this.colorWheel = null;
        this.analytics = null;
        
        this.init();
    }
    
    async init() {
        try {
            this.showLoading();
            await this.loadColors();
            await this.loadPosts();
            this.initializeComponents();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize app. Please refresh the page.');
        }
    }
    
    async loadColors() {
        try {
            const response = await fetch('api/colors.php');
            const data = await response.json();
            
            if (data.success) {
                this.colors = data.colors;
            } else {
                throw new Error('Failed to load colors');
            }
        } catch (error) {
            console.error('Error loading colors:', error);
            throw error;
        }
    }
    
    async loadPosts(offset = 0) {
        try {
            const response = await fetch(`api/posts.php?offset=${offset}&limit=20`);
            const data = await response.json();
            
            if (data.success) {
                if (offset === 0) {
                    this.posts = data.posts;
                } else {
                    this.posts.push(...data.posts);
                }
                this.renderPosts();
            } else {
                throw new Error('Failed to load posts');
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            throw error;
        }
    }
    
    initializeComponents() {
        const feedContainer = document.getElementById('posts-feed');
        this.scrollHandler = new ScrollHandler(feedContainer, this);
        this.colorWheel = new ColorWheel(this.colors, this);
        this.analytics = new Analytics(this);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                this.scrollHandler.scrollToNext();
            } else if (e.key === 'ArrowUp') {
                this.scrollHandler.scrollToPrevious();
            }
        });
    }
    
    renderPosts() {
        const feedContainer = document.getElementById('posts-feed');
        
        if (this.posts.length === 0) {
            feedContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎨</div>
                    <div class="empty-title">No posts yet</div>
                    <div class="empty-subtitle">Check back later for amazing content!</div>
                </div>
            `;
            return;
        }
        
        feedContainer.innerHTML = this.posts.map((post, index) => this.createPostHTML(post, index)).join('');
        this.scrollHandler.updateScrollIndicators();
        this.attachPostEventListeners();
    }
    
    createPostHTML(post, index) {
        const hasRating = post.user_rating !== null;
        const ratingDisplay = hasRating 
            ? `<span class="rating-color-badge" style="background-color: ${post.user_rating.color_hex}"></span>
               <span>${post.user_rating.color_name}</span>`
            : '<span>Rate this post</span>';
        
        return `
            <div class="post-card" data-post-id="${post.id}" data-index="${index}">
                <div class="post-background">
                    <img src="${post.image}" alt="Post image" class="post-image" loading="lazy">
                    <div class="post-overlay"></div>
                </div>
                
                <div class="post-content">
                    <div class="post-header">
                        <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                        <div class="author-info">
                            <div class="author-name">
                                ${post.author.name}
                            </div>
                            <div class="author-bio">${post.author.bio}</div>
                        </div>
                        <div class="post-time">${post.time_ago}</div>
                    </div>
                    
                    <div class="post-body">
                        <div class="post-description">${post.content}</div>
                    </div>
                    
                    <div class="post-footer">
                        <div class="post-actions">
                            <button class="action-button ${hasRating ? 'rated' : 'primary'} rate-btn" 
                                    data-post-id="${post.id}">
                                <span>🎨</span>
                                ${ratingDisplay}
                            </button>
                            <button class="action-button analytics-btn" 
                                    data-post-id="${post.id}">
                                <span>📊</span>
                                <span>Analytics</span>
                            </button>
                        </div>
                        <div class="rating-stats">
                            <span>${post.total_ratings} rating${post.total_ratings !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachPostEventListeners() {
        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(btn.dataset.postId);
                this.openColorWheel(postId);
            });
        });
        
        document.querySelectorAll('.analytics-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(btn.dataset.postId);
                this.openAnalytics(postId);
            });
        });
    }
    
    openColorWheel(postId) {
        const post = this.posts.find(p => p.id === postId);
        this.colorWheel.open(postId, post.user_rating);
    }
    
    openAnalytics(postId) {
        this.analytics.open(postId);
    }
    
    async submitRating(postId, colorId) {
        try {
            const response = await fetch('api/rate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: postId,
                    color_id: colorId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.updatePostRating(postId, data.rating, data.total_ratings);
                this.showToast(`Rated with ${data.rating.color_name}! 🎨`);
                return true;
            } else {
                throw new Error(data.error || 'Failed to submit rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            this.showToast('Failed to submit rating. Please try again.', 'error');
            return false;
        }
    }
    
    updatePostRating(postId, rating, totalRatings) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.user_rating = {
                color_id: rating.color_id,
                color_name: rating.color_name,
                color_hex: rating.color_hex
            };
            post.total_ratings = totalRatings;
            
            const postCard = document.querySelector(`.post-card[data-post-id="${postId}"]`);
            if (postCard) {
                const rateBtn = postCard.querySelector('.rate-btn');
                rateBtn.classList.remove('primary');
                rateBtn.classList.add('rated');
                rateBtn.innerHTML = `
                    <span>🎨</span>
                    <span class="rating-color-badge" style="background-color: ${rating.color_hex}"></span>
                    <span>${rating.color_name}</span>
                `;
                
                const stats = postCard.querySelector('.rating-stats');
                stats.innerHTML = `<span>${totalRatings} rating${totalRatings !== 1 ? 's' : ''}</span>`;
            }
        }
    }
    
    showLoading() {
        document.getElementById('loading-screen').classList.remove('hidden');
    }
    
    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 500);
    }
    
    showError(message) {
        this.hideLoading();
        const feedContainer = document.getElementById('posts-feed');
        feedContainer.innerHTML = `
            <div class="error-message">
                <strong>⚠️ Error</strong><br>
                ${message}
            </div>
        `;
    }
    
    showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const icon = type === 'success' ? '✓' : '⚠️';
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new ColorGradeApp();
});
