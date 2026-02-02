class ScrollHandler {
    constructor(container, app) {
        this.container = container;
        this.app = app;
        this.currentIndex = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupScrollListener();
        this.createScrollIndicators();
    }
    
    setupScrollListener() {
        let lastScrollTop = 0;
        let ticking = false;
        
        this.container.addEventListener('scroll', () => {
            lastScrollTop = this.container.scrollTop;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll(lastScrollTop);
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        this.container.addEventListener('scroll', () => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.snapToNearestPost();
            }, 150);
        });
    }
    
    handleScroll(scrollTop) {
        const posts = document.querySelectorAll('.post-card');
        const containerHeight = this.container.clientHeight;
        const threshold = containerHeight / 2;
        
        posts.forEach((post, index) => {
            const rect = post.getBoundingClientRect();
            const postTop = rect.top;
            
            if (postTop < threshold && postTop > -threshold) {
                if (this.currentIndex !== index) {
                    this.currentIndex = index;
                    this.updateScrollIndicators();
                }
            }
        });
    }
    
    snapToNearestPost() {
        const posts = document.querySelectorAll('.post-card');
        let closestPost = null;
        let closestDistance = Infinity;
        
        posts.forEach((post) => {
            const rect = post.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPost = post;
            }
        });
        
        if (closestPost && closestDistance > 10) {
            closestPost.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    scrollToIndex(index) {
        const posts = document.querySelectorAll('.post-card');
        if (posts[index]) {
            this.isScrolling = true;
            posts[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                this.isScrolling = false;
            }, 500);
        }
    }
    
    scrollToNext() {
        const posts = document.querySelectorAll('.post-card');
        if (this.currentIndex < posts.length - 1) {
            this.scrollToIndex(this.currentIndex + 1);
        }
    }
    
    scrollToPrevious() {
        if (this.currentIndex > 0) {
            this.scrollToIndex(this.currentIndex - 1);
        }
    }
    
    createScrollIndicators() {
        const existingIndicator = document.querySelector('.scroll-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        document.body.appendChild(indicator);
        
        this.indicatorContainer = indicator;
        this.updateScrollIndicators();
    }
    
    updateScrollIndicators() {
        if (!this.indicatorContainer) return;
        
        const posts = document.querySelectorAll('.post-card');
        
        if (posts.length <= 1) {
            this.indicatorContainer.style.display = 'none';
            return;
        }
        
        this.indicatorContainer.style.display = 'flex';
        this.indicatorContainer.innerHTML = '';
        
        posts.forEach((post, index) => {
            const dot = document.createElement('div');
            dot.className = `scroll-dot ${index === this.currentIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => this.scrollToIndex(index));
            this.indicatorContainer.appendChild(dot);
        });
    }
}
