/**
 * MentalMosaic - Authentication JavaScript
 * Handles login, registration, and user authentication
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if already authenticated
    const authToken = localStorage.getItem('nungo-auth-token') || sessionStorage.getItem('nungo-auth-token');
    if (authToken) {
      window.location.href = 'dashboard.html';
      return;
    }
    
    // Initialize form switching
    initializeFormSwitching();
    
    // Initialize form submissions
    initializeLoginForm();
    initializeSignupForm();
    
    // Initialize social login
    initializeSocialLogin();
  });
  
  /**
   * Switch between login and signup forms
   */
  function initializeFormSwitching() {
    const showLoginButton = document.getElementById('show-login');
    const showSignupButton = document.getElementById('show-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (showLoginButton && showSignupButton && loginForm && signupForm) {
      showLoginButton.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
      });
      
      showSignupButton.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
      });
    }
  }
  
  /**
   * Handle login form submission
   */
  function initializeLoginForm() {
    const loginForm = document.getElementById('login-form-element');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me') ? document.getElementById('remember-me').checked : false;
        
        // Validate form
        if (!validateLoginForm(email, password)) {
          return;
        }
        
        // Show loading state
        toggleLoginLoadingState(true);
        
        // For hackathon demo purposes, we'll simulate authentication
        setTimeout(() => {
          // Create auth token
          const authToken = 'auth-token-' + Math.random().toString(36).substring(2);
          
          // Store in localStorage or sessionStorage based on remember me
          if (rememberMe) {
            localStorage.setItem('nungo-auth-token', authToken);
          } else {
            sessionStorage.setItem('nungo-auth-token', authToken);
          }
          
          // Store user data
          const userData = {
            id: 'user-' + Math.random().toString(36).substring(2),
            name: 'John Doe', // Use a default name for demo
            email: email,
            avatar: 'https://via.placeholder.com/40'
          };
          
          localStorage.setItem('nungo-user-data', JSON.stringify(userData));
          
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        }, 1000);
      });
    }
  }
  
  /**
   * Validate login form
   */
  function validateLoginForm(email, password) {
    let isValid = true;
    
    // Clear previous errors
    clearLoginErrors();
    
    // Validate email
    if (!email) {
      showLoginError('Please enter your email address.', 'login-email');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showLoginError('Please enter a valid email address.', 'login-email');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      showLoginError('Please enter your password.', 'login-password');
      isValid = false;
    }
    
    return isValid;
  }
  
  /**
   * Show login error message
   */
  function showLoginError(message, inputId = null) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.textContent = message;
    
    if (inputId) {
      // Show error below specific input
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.classList.add('error');
        inputElement.parentNode.appendChild(errorContainer);
      }
    } else {
      // Show general error at top of form
      const loginForm = document.getElementById('login-form-element');
      loginForm.insertBefore(errorContainer, loginForm.firstChild);
    }
  }
  
  /**
   * Clear all login form errors
   */
  function clearLoginErrors() {
    // Remove error messages
    const errorMessages = document.querySelectorAll('#login-form-element .form-error');
    errorMessages.forEach(message => message.remove());
    
    // Remove error classes from inputs
    const inputs = document.querySelectorAll('#login-form-element input');
    inputs.forEach(input => input.classList.remove('error'));
  }
  
  /**
   * Toggle loading state for login form
   */
  function toggleLoginLoadingState(isLoading) {
    const submitButton = document.querySelector('#login-form-element button[type="submit"]');
    
    if (submitButton) {
      if (isLoading) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      } else {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Login';
      }
    }
  }
  
  /**
   * Handle signup form submission
   */
  function initializeSignupForm() {
    const signupForm = document.getElementById('signup-form-element');
    
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsAccepted = document.getElementById('terms') ? document.getElementById('terms').checked : false;
        
        // Validate form
        if (!validateSignupForm(name, email, password, confirmPassword, termsAccepted)) {
          return;
        }
        
        // Show loading state
        toggleSignupLoadingState(true);
        
        // For hackathon demo purposes, simulate account creation
        setTimeout(() => {
          // Store user data
          const userData = {
            id: 'user-' + Math.random().toString(36).substring(2),
            name: name,
            email: email,
            avatar: 'https://via.placeholder.com/40'
          };
          
          localStorage.setItem('nungo-user-data', JSON.stringify(userData));
          
          // Create auth token
          const authToken = 'auth-token-' + Math.random().toString(36).substring(2);
          localStorage.setItem('nungo-auth-token', authToken);
          
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        }, 1000);
      });
    }
  }
  
  /**
   * Validate signup form
   */
  function validateSignupForm(name, email, password, confirmPassword, termsAccepted) {
    let isValid = true;
    
    // Clear previous errors
    clearSignupErrors();
    
    // Validate name
    if (!name) {
      showSignupError('Please enter your name.', 'signup-name');
      isValid = false;
    }
    
    // Validate email
    if (!email) {
      showSignupError('Please enter your email address.', 'signup-email');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showSignupError('Please enter a valid email address.', 'signup-email');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      showSignupError('Please enter a password.', 'signup-password');
      isValid = false;
    } else if (password.length < 8) {
      showSignupError('Password must be at least 8 characters.', 'signup-password');
      isValid = false;
    }
    
    // Validate password confirmation
    if (!confirmPassword) {
      showSignupError('Please confirm your password.', 'signup-confirm-password');
      isValid = false;
    } else if (password !== confirmPassword) {
      showSignupError('Passwords do not match.', 'signup-confirm-password');
      isValid = false;
    }
    
    // Validate terms
    if (!termsAccepted) {
      showSignupError('You must accept the Terms of Service and Privacy Policy.', 'terms');
      isValid = false;
    }
    
    return isValid;
  }
  
  /**
   * Show signup error message
   */
  function showSignupError(message, inputId = null) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.textContent = message;
    
    if (inputId) {
      // Show error below specific input
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.classList.add('error');
        
        // Special handling for checkbox
        if (inputId === 'terms') {
          inputElement.parentNode.parentNode.appendChild(errorContainer);
        } else {
          inputElement.parentNode.appendChild(errorContainer);
        }
      }
    } else {
      // Show general error at top of form
      const signupForm = document.getElementById('signup-form-element');
      signupForm.insertBefore(errorContainer, signupForm.firstChild);
    }
  }
  
  /**
   * Clear all signup form errors
   */
  function clearSignupErrors() {
    // Remove error messages
    const errorMessages = document.querySelectorAll('#signup-form-element .form-error');
    errorMessages.forEach(message => message.remove());
    
    // Remove error classes from inputs
    const inputs = document.querySelectorAll('#signup-form-element input');
    inputs.forEach(input => input.classList.remove('error'));
  }
  
  /**
   * Toggle loading state for signup form
   */
  function toggleSignupLoadingState(isLoading) {
    const submitButton = document.querySelector('#signup-form-element button[type="submit"]');
    
    if (submitButton) {
      if (isLoading) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      } else {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Create Account';
      }
    }
  }
  
  /**
   * Initialize social login buttons
   */
  function initializeSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-button');
    
    socialButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        this.disabled = true;
        
        // Simulate authentication after delay
        setTimeout(() => {
          // Store user data
          const userData = {
            id: 'user-' + Math.random().toString(36).substring(2),
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'https://via.placeholder.com/40'
          };
          
          localStorage.setItem('nungo-user-data', JSON.stringify(userData));
          
          // Generate auth token
          const authToken = 'auth-token-' + Math.random().toString(36).substring(2);
          localStorage.setItem('nungo-auth-token', authToken);
          
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        }, 1000);
      });
    });
  }
  
  /**
   * Validate email format
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }