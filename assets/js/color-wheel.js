class ColorWheel {
    constructor(colors, app) {
        this.colors = colors;
        this.app = app;
        this.selectedColor = null;
        this.currentPostId = null;
        this.modal = null;
        
        this.createModal();
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay hidden';
        modal.id = 'color-wheel-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="close-color-wheel">×</button>
                
                <div class="modal-header">
                    <h2 class="modal-title">Rate This Post</h2>
                    <p class="modal-subtitle">Choose a color that represents your feeling</p>
                </div>
                
                <div class="color-wheel-container">
                    <div class="color-wheel" id="color-wheel">
                        ${this.createWheelSegments()}
                        <div class="wheel-center">
                            <span>🎨</span>
                        </div>
                    </div>
                    
                    <div class="selected-color-display" id="selected-color-display">
                        <div class="selected-color-swatch" id="color-swatch" style="background-color: #2a2a2a;"></div>
                        <div class="selected-color-name" id="color-name">Select a color</div>
                        <div class="selected-color-description" id="color-description">Tap any segment on the wheel</div>
                    </div>
                    
                    <div class="color-wheel-actions">
                        <button class="btn btn-secondary" id="cancel-rating">Cancel</button>
                        <button class="btn btn-primary" id="submit-rating" disabled>
                            Submit Rating
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        
        this.attachEventListeners();
    }
    
    createWheelSegments() {
        const segmentAngle = 360 / this.colors.length;
        
        return this.colors.map((color, index) => {
            const rotation = segmentAngle * index;
            return `
                <div class="color-segment" 
                     data-color-id="${color.id}"
                     data-color-name="${color.name}"
                     data-color-hex="${color.hex}"
                     data-color-description="${color.description}"
                     style="background-color: ${color.hex}; transform: rotate(${rotation}deg); clip-path: polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((segmentAngle - 90) * Math.PI / 180)}%);">
                </div>
            `;
        }).join('');
    }
    
    attachEventListeners() {
        this.modal.querySelector('#close-color-wheel').addEventListener('click', () => {
            this.close();
        });
        
        this.modal.querySelector('#cancel-rating').addEventListener('click', () => {
            this.close();
        });
        
        this.modal.querySelector('#submit-rating').addEventListener('click', () => {
            this.submitRating();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        this.modal.querySelectorAll('.color-segment').forEach(segment => {
            segment.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectColor(segment);
            });
        });
        
        const wheel = this.modal.querySelector('#color-wheel');
        wheel.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-segment')) {
                this.addWheelAnimation();
            }
        });
    }
    
    selectColor(segment) {
        const colorId = parseInt(segment.dataset.colorId);
        const colorName = segment.dataset.colorName;
        const colorHex = segment.dataset.colorHex;
        const colorDescription = segment.dataset.colorDescription;
        
        this.modal.querySelectorAll('.color-segment').forEach(s => {
            s.classList.remove('selected');
        });
        segment.classList.add('selected');
        
        this.selectedColor = {
            id: colorId,
            name: colorName,
            hex: colorHex,
            description: colorDescription
        };
        
        const swatch = this.modal.querySelector('#color-swatch');
        const name = this.modal.querySelector('#color-name');
        const description = this.modal.querySelector('#color-description');
        const submitBtn = this.modal.querySelector('#submit-rating');
        
        swatch.style.backgroundColor = colorHex;
        swatch.classList.add('pulse');
        setTimeout(() => swatch.classList.remove('pulse'), 600);
        
        name.textContent = colorName;
        description.textContent = colorDescription;
        
        submitBtn.disabled = false;
    }
    
    addWheelAnimation() {
        const wheel = this.modal.querySelector('#color-wheel');
        wheel.classList.add('spinning');
        setTimeout(() => wheel.classList.remove('spinning'), 600);
    }
    
    open(postId, currentRating = null) {
        this.currentPostId = postId;
        this.selectedColor = null;
        
        this.modal.querySelector('#submit-rating').disabled = true;
        
        this.modal.querySelectorAll('.color-segment').forEach(segment => {
            segment.classList.remove('selected');
        });
        
        if (currentRating) {
            const segment = this.modal.querySelector(`[data-color-id="${currentRating.color_id}"]`);
            if (segment) {
                this.selectColor(segment);
                this.modal.querySelector('.modal-subtitle').textContent = 'Change your rating';
            }
        } else {
            const swatch = this.modal.querySelector('#color-swatch');
            const name = this.modal.querySelector('#color-name');
            const description = this.modal.querySelector('#color-description');
            
            swatch.style.backgroundColor = '#2a2a2a';
            name.textContent = 'Select a color';
            description.textContent = 'Tap any segment on the wheel';
            
            this.modal.querySelector('.modal-subtitle').textContent = 'Choose a color that represents your feeling';
        }
        
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.selectedColor = null;
        this.currentPostId = null;
    }
    
    async submitRating() {
        if (!this.selectedColor || !this.currentPostId) {
            return;
        }
        
        const submitBtn = this.modal.querySelector('#submit-rating');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        const success = await this.app.submitRating(this.currentPostId, this.selectedColor.id);
        
        if (success) {
            this.close();
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Rating';
        }
    }
}
