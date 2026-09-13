// Advanced Particle System for Guild of Travelers
// Uses HTML5 Canvas for magical effects

class AdvancedParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container #${containerId} not found`);
            return;
        }
        
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.options = {
            count: options.count || 50,
            type: options.type || 'default', // ember, magic, sparkle, leaf
            color: options.color || 'rgba(212, 175, 55, 0.6)',
            speed: options.speed || 1,
            size: options.size || 3
        };
        
        this.resize();
        this.init();
        this.animate();
        
        // Track mouse movement
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticle() {
        const type = this.options.type;
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * this.options.size + 1,
            speedX: (Math.random() - 0.5) * this.options.speed,
            speedY: (Math.random() - 0.5) * this.options.speed,
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2
        };
        
        // Type-specific properties
        if (type === 'ember') {
            particle.speedY = -Math.random() * 2 - 0.5; // Move upward
            particle.life = 100;
            particle.decay = Math.random() * 0.5 + 0.2;
        } else if (type === 'magic') {
            particle.pulse = Math.random() * Math.PI * 2;
            particle.pulseSpeed = Math.random() * 0.05 + 0.02;
        } else if (type === 'sparkle') {
            particle.twinkle = Math.random() * Math.PI * 2;
            particle.twinkleSpeed = Math.random() * 0.1 + 0.05;
        } else if (type === 'leaf') {
            particle.swing = Math.random() * Math.PI * 2;
            particle.swingSpeed = Math.random() * 0.02 + 0.01;
            particle.speedY = Math.random() * 0.5 + 0.2;
        }
        
        return particle;
    }
    
    drawParticle(p) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = p.opacity;
        
        const color = this.options.color;
        
        if (this.options.type === 'ember') {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.options.type === 'magic') {
            this.ctx.fillStyle = color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.options.type === 'sparkle') {
            this.ctx.fillStyle = color;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = color;
            // Draw star shape
            this.ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                const x = Math.cos(angle) * p.size;
                const y = Math.sin(angle) * p.size;
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.fill();
        } else if (this.options.type === 'leaf') {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, p.size * 2, p.size, 0, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Default particle
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    updateParticle(p) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Type-specific physics
        if (this.options.type === 'ember') {
            p.life -= p.decay;
            p.opacity = (p.life / 100) * 0.8;
            if (p.life <= 0) {
                p.x = Math.random() * this.canvas.width;
                p.y = this.canvas.height + 10;
                p.life = 100;
            }
        } else if (this.options.type === 'magic') {
            p.pulse += p.pulseSpeed;
            p.size = (Math.sin(p.pulse) + 2) * (this.options.size / 3);
        } else if (this.options.type === 'sparkle') {
            p.twinkle += p.twinkleSpeed;
            p.opacity = 0.3 + Math.sin(p.twinkle) * 0.5;
        } else if (this.options.type === 'leaf') {
            p.swing += p.swingSpeed;
            p.x += Math.sin(p.swing) * 0.5;
        }
        
        // Mouse interaction
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                p.x -= (dx / distance) * force * 2;
                p.y -= (dy / distance) * force * 2;
            }
        }
        
        // Screen boundaries
        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;
    }
    
    init() {
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            this.updateParticle(p);
            this.drawParticle(p);
        });
        requestAnimationFrame(() => this.animate());
    }
}

// Export to global scope
window.AdvancedParticleSystem = AdvancedParticleSystem;
