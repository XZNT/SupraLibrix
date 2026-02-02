class Analytics {
    constructor(app) {
        this.app = app;
        this.panel = null;
        this.currentPostId = null;
        this.analyticsData = null;
        
        this.createPanel();
    }
    
    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'analytics-panel';
        panel.id = 'analytics-panel';
        panel.innerHTML = `
            <div class="analytics-header">
                <h2 class="analytics-title">Color Analytics</h2>
                <button class="close-analytics" id="close-analytics">×</button>
            </div>
            <div class="analytics-content" id="analytics-content">
                <div class="loading-spinner"></div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.panel = panel;
        
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        this.panel.querySelector('#close-analytics').addEventListener('click', () => {
            this.close();
        });
    }
    
    async open(postId) {
        this.currentPostId = postId;
        this.panel.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        await this.loadAnalytics(postId);
    }
    
    close() {
        this.panel.classList.remove('active');
        document.body.style.overflow = '';
        this.currentPostId = null;
    }
    
    async loadAnalytics(postId) {
        const content = this.panel.querySelector('#analytics-content');
        content.innerHTML = '<div class="loading-spinner"></div>';
        
        try {
            const response = await fetch(`api/analytics.php?post_id=${postId}`);
            const data = await response.json();
            
            if (data.success) {
                this.analyticsData = data;
                this.renderAnalytics(data);
            } else {
                throw new Error(data.error || 'Failed to load analytics');
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            content.innerHTML = `
                <div class="error-message">
                    Failed to load analytics. Please try again.
                </div>
            `;
        }
    }
    
    renderAnalytics(data) {
        const content = this.panel.querySelector('#analytics-content');
        
        const mostVoted = data.insights.most_voted || { color_name: 'N/A', vote_count: 0 };
        const leastVoted = data.insights.least_voted || { color_name: 'N/A', vote_count: 0 };
        
        content.innerHTML = `
            <div class="analytics-stats">
                <div class="stat-card">
                    <div class="stat-value">${data.total_votes}</div>
                    <div class="stat-label">Total Votes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${data.insights.unique_voters}</div>
                    <div class="stat-label">Colors Used</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${mostVoted.vote_count}</div>
                    <div class="stat-label">Top Votes</div>
                </div>
            </div>
            
            ${data.total_votes > 0 ? this.renderDonutChart(data.color_distribution) : ''}
            
            <div class="chart-container">
                <h3 class="chart-title">Color Breakdown</h3>
                <div class="color-breakdown">
                    ${this.renderColorBreakdown(data.color_distribution)}
                </div>
            </div>
            
            ${data.total_votes > 0 ? `
                <div class="chart-container">
                    <h3 class="chart-title">Insights</h3>
                    <div class="color-breakdown">
                        <div class="color-item">
                            <div class="color-item-swatch" style="background-color: ${mostVoted.hex_value}"></div>
                            <div class="color-item-info">
                                <div class="color-item-name">Most Popular</div>
                                <div class="color-item-bar">
                                    <div class="color-item-bar-fill" style="width: 100%; background-color: ${mostVoted.hex_value}"></div>
                                </div>
                            </div>
                            <div class="color-item-stats">
                                <div>${mostVoted.percentage}%</div>
                                <div class="color-item-votes">${mostVoted.color_name}</div>
                            </div>
                        </div>
                        ${data.insights.unique_voters > 1 ? `
                            <div class="color-item">
                                <div class="color-item-swatch" style="background-color: ${leastVoted.hex_value}"></div>
                                <div class="color-item-info">
                                    <div class="color-item-name">Least Popular</div>
                                    <div class="color-item-bar">
                                        <div class="color-item-bar-fill" style="width: ${leastVoted.percentage}%; background-color: ${leastVoted.hex_value}"></div>
                                    </div>
                                </div>
                                <div class="color-item-stats">
                                    <div>${leastVoted.percentage}%</div>
                                    <div class="color-item-votes">${leastVoted.color_name}</div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
        `;
    }
    
    renderDonutChart(distribution) {
        const votedColors = distribution.filter(c => c.vote_count > 0);
        
        if (votedColors.length === 0) {
            return '';
        }
        
        const radius = 100;
        const strokeWidth = 40;
        const center = 140;
        const circumference = 2 * Math.PI * radius;
        
        let currentAngle = 0;
        const segments = votedColors.map(color => {
            const percentage = color.percentage / 100;
            const segmentLength = circumference * percentage;
            const offset = circumference - currentAngle;
            currentAngle += segmentLength;
            
            return {
                color: color.hex_value,
                length: segmentLength,
                offset: offset,
                percentage: color.percentage,
                name: color.color_name
            };
        });
        
        const total = votedColors.reduce((sum, c) => sum + c.vote_count, 0);
        
        return `
            <div class="chart-container">
                <h3 class="chart-title">Color Distribution</h3>
                <div class="donut-chart">
                    <svg width="280" height="280" viewBox="0 0 280 280">
                        ${segments.map(segment => `
                            <circle
                                class="donut-segment"
                                cx="${center}"
                                cy="${center}"
                                r="${radius}"
                                fill="none"
                                stroke="${segment.color}"
                                stroke-width="${strokeWidth}"
                                stroke-dasharray="${segment.length} ${circumference}"
                                stroke-dashoffset="${segment.offset}"
                            />
                        `).join('')}
                    </svg>
                    <div class="chart-center-text">
                        <div class="chart-total">${total}</div>
                        <div class="chart-label">Votes</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderColorBreakdown(distribution) {
        return distribution.map(color => `
            <div class="color-item">
                <div class="color-item-swatch" style="background-color: ${color.hex_value}"></div>
                <div class="color-item-info">
                    <div class="color-item-name">${color.color_name}</div>
                    <div class="color-item-bar">
                        <div class="color-item-bar-fill" 
                             style="width: ${color.percentage}%; background-color: ${color.hex_value}">
                        </div>
                    </div>
                </div>
                <div class="color-item-stats">
                    <div>${color.percentage}%</div>
                    <div class="color-item-votes">${color.vote_count} vote${color.vote_count !== 1 ? 's' : ''}</div>
                </div>
            </div>
        `).join('');
    }
}
