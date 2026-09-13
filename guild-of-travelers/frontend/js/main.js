// Main page logic for Guild of Travelers
// Handles login form and validation

const API_BASE_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system - ember type for tavern atmosphere
    new AdvancedParticleSystem('particleContainer', {
        count: 60,
        type: 'ember',
        color: 'rgba(255, 200, 100, 0.7)',
        speed: 1.5,
        size: 4
    });
    
    // Add sparkle particles
    setTimeout(() => {
        new AdvancedParticleSystem('particleContainer', {
            count: 30,
            type: 'sparkle',
            color: 'rgba(255, 215, 0, 0.6)',
            speed: 0.8,
            size: 3
        });
    }, 100);
    
    // Set background
    const background = document.getElementById('background');
    background.style.backgroundImage = "url('images/tavern.jpg')";
    
    // Form handling
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const code = document.getElementById('questCode').value.trim();
        const heroName = document.getElementById('heroName').value.trim();
        
        // Validate code format with regex
        const codePattern = /^\d{1,2}[А-ЯA-Z]\d{2}$/i;
        if (!codePattern.test(code)) {
            showError('Неверный формат кода. Пример: 8А02, 11Б15');
            return;
        }
        
        if (heroName.length < 2) {
            showError('Имя героя должно быть не менее 2 символов');
            return;
        }
        
        try {
            // Send to backend for validation
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code.toUpperCase(),
                    heroName: heroName
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Save to localStorage
                localStorage.setItem('questCode', data.code);
                localStorage.setItem('questHeroName', data.hero_name);
                localStorage.setItem('questClassName', data.class_name);
                
                // Redirect to hero name page
                window.location.href = 'hero-name.html';
            } else {
                showError(data.detail || 'Ошибка входа');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Fallback: save locally without backend validation
            localStorage.setItem('questCode', code.toUpperCase());
            localStorage.setItem('questHeroName', heroName);
            localStorage.setItem('questClassName', code.match(/^(\d{1,2}[А-ЯA-Z])/i)[1].toUpperCase());
            
            // Show warning but proceed
            console.warn('Backend unavailable, using local mode');
            window.location.href = 'hero-name.html';
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Shake animation
        const form = document.querySelector('.registration-form');
        form.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
});
