document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    
    // Real-time validation
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        form.querySelectorAll('input[required]').forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitForm();
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    // Clear previous errors
    field.classList.remove('error', 'success');
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    switch(fieldId) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, errorElement, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'password':
            if (value.length < 6) {
                showError(field, errorElement, 'Password must be at least 6 characters');
                return false;
            }
            break;
    }
    
    // Show success
    field.classList.add('success');
    return true;
}

function showError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function togglePassword() {
    const field = document.getElementById('password');
    const button = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        button.textContent = '🙈';
    } else {
        field.type = 'password';
        button.textContent = '👁️';
    }
}

function submitForm() {
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    fetch('login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        console.log('Response:', text);
        
        try {
            const data = JSON.parse(text);
            
            if (data.success) {
                showMessage('Login successful! Redirecting...', 'success');
                
                // Save user data to localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirect after 1 second
                setTimeout(() => {
                    window.location.href = 'projet.html';
                }, 1000);
            } else {
                showMessage(data.message || 'Invalid email or password', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (e) {
            console.error('JSON parse error:', e);
            console.error('Response was:', text);
            showMessage('Server error. Please try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        showMessage('Cannot connect to server. Make sure Apache is running.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showMessage(message, type) {
    const container = document.getElementById('message-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(messageDiv);
    
    // Auto-remove error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}