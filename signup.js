document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // Real-time password strength checker
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
    
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
        form.querySelectorAll('input').forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Submit form via AJAX
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
        case 'fullname':
            if (value.length < 3) {
                showError(field, errorElement, 'Name must be at least 3 characters');
                return false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, errorElement, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[0-9]{8,}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                showError(field, errorElement, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'password':
            if (value.length < 6) {
                showError(field, errorElement, 'Password must be at least 6 characters');
                return false;
            }
            
            // Check confirm password if it has value
            const confirmPassword = document.getElementById('confirm-password');
            if (confirmPassword.value) {
                validateField(confirmPassword);
            }
            break;
            
        case 'confirm-password':
            const password = document.getElementById('password').value;
            if (value !== password) {
                showError(field, errorElement, 'Passwords do not match');
                return false;
            }
            break;
            
        case 'terms':
            if (!field.checked) {
                showError(field, document.getElementById('terms-error'), 'You must accept the terms and conditions');
                return false;
            }
            break;
    }
    
    // Show success
    if (fieldId !== 'terms') {
        field.classList.add('success');
    }
    return true;
}

function showError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('password-strength');
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    strengthBar.className = 'password-strength';
    
    if (strength <= 2) {
        strengthBar.classList.add('weak');
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
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
    const form = document.getElementById('signupForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    fetch('signup.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text(); // Changé de .json() à .text()
    })
    .then(text => {
        console.log('Response text:', text); // Afficher la réponse brute
        
        try {
            const data = JSON.parse(text);
            
            if (data.success) {
                showSuccessMessage('Account created successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                alert(data.message || 'An error occurred. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (e) {
            console.error('JSON parse error:', e);
            console.error('Response was:', text);
            alert('Server error: ' + text);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Network error: ' + error.message);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showSuccessMessage(message) {
    const form = document.getElementById('signupForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;
    form.insertBefore(successDiv, form.firstChild);
}