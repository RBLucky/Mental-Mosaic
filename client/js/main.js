/**
 * Nungo Builds Calm - Main JavaScript
 * Common functions used across the application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all common UI elements
    initializeSidebar();
    initializeUserMenu();
    initializeThemeToggle();
    initializeModals();
    
    // Check for active page and update navigation
    highlightActivePage();
  });
  
  /**
   * Sidebar functionality
   */
  function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
      });
    }
    
    // Close sidebar on mobile when clicking a link
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          sidebar.classList.add('collapsed');
          mainContent.classList.add('expanded');
        }
      });
    });
  }
  
  /**
   * User menu dropdown
   */
  function initializeUserMenu() {
    const userMenuTrigger = document.getElementById('user-menu-trigger');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuTrigger && userDropdown) {
      userMenuTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        userMenuTrigger.classList.toggle('active');
        userDropdown.classList.toggle('active');
      });
      
      // Close dropdown when clicking elsewhere
      document.addEventListener('click', function() {
        userMenuTrigger.classList.remove('active');
        userDropdown.classList.remove('active');
      });
      
      userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      // Handle logout
      const logoutButtons = document.querySelectorAll('#logout-button, #logout-dropdown');
      
      logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          logout();
        });
      });
    }
  }
  
  /**
   * Theme toggle (light/dark mode)
   */
  function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
      // Check for saved theme preference or respect OS preference
      const savedTheme = localStorage.getItem('nungo-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        updateThemeToggleIcon(true);
      }
      
      themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        // Save preference
        localStorage.setItem('nungo-theme', isDark ? 'dark' : 'light');
        
        // Update icon
        updateThemeToggleIcon(isDark);
      });
    }
  }
  
  /**
   * Update theme toggle icon based on current theme
   */
  function updateThemeToggleIcon(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      
      if (icon) {
        if (isDark) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
          themeToggle.querySelector('span').textContent = 'Light Mode';
        } else {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
          themeToggle.querySelector('span').textContent = 'Dark Mode';
        }
      }
    }
  }
  
  /**
   * Highlight the active page in navigation
   */
  function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      
      if (linkPage === currentPage) {
        link.parentElement.classList.add('active');
      }
    });
  }
  
  /**
   * Modal functionality
   */
  function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (modal) {
          openModal(modal);
        }
      });
    });
    
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
      });
    });
    
    // Close modal when clicking outside content
    modals.forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeModal(this);
        }
      });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          closeModal(activeModal);
        }
      }
    });
  }
  
  /**
   * Open a modal
   */
  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  /**
   * Close a modal
   */
  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  /**
   * Tab functionality
   * Used in mood-tracker and other pages
   */
  function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        document.querySelectorAll('.tab-button').forEach(tab => {
          tab.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        
        // Activate selected tab
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  /**
   * Format date for display
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
  
  /**
   * Format time for display
   */
  function formatTime(dateString) {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString(undefined, options);
  }
  
  /**
   * Format date and time for display
   */
  function formatDateTime(dateString) {
    const date = new Date(dateString);
    return `${formatDate(date)} • ${formatTime(date)}`;
  }
  
  /**
   * Show a notification
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
      <div class="notification-content">
        <i class="notification-icon ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="close-notification">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add to notifications container or create if it doesn't exist
    let notificationsContainer = document.querySelector('.notifications-container');
    
    if (!notificationsContainer) {
      notificationsContainer = document.createElement('div');
      notificationsContainer.className = 'notifications-container';
      document.body.appendChild(notificationsContainer);
    }
    
    notificationsContainer.appendChild(notification);
    
    // Add active class after a small delay for animation
    setTimeout(() => {
      notification.classList.add('active');
    }, 10);
    
    // Close button functionality
    const closeButton = notification.querySelector('.close-notification');
    closeButton.addEventListener('click', () => {
      closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
      closeNotification(notification);
    }, 5000);
  }
  
  /**
   * Close a notification
   */
  function closeNotification(notification) {
    notification.classList.remove('active');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
  
  /**
   * Get appropriate icon for notification type
   */
  function getNotificationIcon(type) {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
      default:
        return 'fas fa-info-circle';
    }
  }
  
  /**
   * Logout functionality
   */
  function logout() {
    // Clear any stored authentication tokens
    localStorage.removeItem('nungo-auth-token');
    sessionStorage.removeItem('nungo-auth-token');
    
    // Redirect to login page
    window.location.href = 'index.html';
  }
  
  /**
   * Check if user is authenticated
   * Redirect to login page if not
   */
  function checkAuth() {
    const authToken = localStorage.getItem('nungo-auth-token') || sessionStorage.getItem('nungo-auth-token');
    const isLoginPage = window.location.pathname.includes('index.html');
    
    if (!authToken && !isLoginPage) {
      // Not authenticated, redirect to login
      window.location.href = 'index.html';
      return false;
    } else if (authToken && isLoginPage) {
      // Already authenticated, redirect to dashboard
      window.location.href = 'dashboard.html';
      return true;
    }
    
    return !!authToken;
  }
  
  /**
   * Set user data in UI elements
   */
  function setUserData(userData) {
    // Set user name in header
    const userNameElements = document.querySelectorAll('.user-name');
    const userFirstNameElements = document.querySelectorAll('.user-first-name');
    
    if (userData.name) {
      userNameElements.forEach(element => {
        element.textContent = userData.name;
      });
      
      // Set first name where needed
      const firstName = userData.name.split(' ')[0];
      userFirstNameElements.forEach(element => {
        element.textContent = firstName;
      });
    }
    
    // Set user avatar if available
    if (userData.avatar) {
      const userAvatars = document.querySelectorAll('.user-profile img');
      userAvatars.forEach(avatar => {
        avatar.src = userData.avatar;
      });
    }
  }
  
  /**
   * Format a number with commas
   */
  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  /**
   * Limit text to a certain number of characters and add ellipsis
   */
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Generate a random ID for elements
   */
  function generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
  }
  
  /**
   * Debounce function to limit how often a function can be called
   */
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  /**
   * Throttle function to limit how often a function can be called
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  /**
   * Get current date in yyyy-mm-dd format
   */
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Get current time in hh:mm format
   */
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  /**
   * Calculate time elapsed since a date (e.g., "2 hours ago")
   */
  function timeElapsed(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
  }
  
  /**
   * Create an HTML element with attributes and content
   */
  function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    // Set attributes
    for (const key in attributes) {
      if (key === 'className') {
        element.className = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    }
    
    // Set content
    if (content) {
      if (typeof content === 'string') {
        element.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      }
    }
    
    return element;
  }
  
  /**
   * Add or remove a class from an element based on condition
   */
  function toggleClass(element, className, condition) {
    if (condition) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
  
  /**
   * Simple form validation
   */
  function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
      
      // Email validation
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
          input.classList.add('error');
        }
      }
      
      // Password validation
      if (input.type === 'password' && input.value.trim() && input.minLength) {
        if (input.value.length < input.minLength) {
          isValid = false;
          input.classList.add('error');
        }
      }
    });
    
    return isValid;
  }
  
  /**
   * Display form validation errors
   */
  function showFormErrors(formElement, errors) {
    // Remove any existing error messages
    const existingErrors = formElement.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Add new error messages
    for (const field in errors) {
      const input = formElement.querySelector(`[name="${field}"]`);
      if (input) {
        input.classList.add('error');
        
        const errorElement = createElement('div', {
          className: 'form-error'
        }, errors[field]);
        
        input.parentNode.appendChild(errorElement);
      }
    }
  }
  
  /**
   * Reset form fields
   */
  function resetForm(formElement) {
    formElement.reset();
    
    // Remove error classes
    const inputs = formElement.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.classList.remove('error');
    });
    
    // Remove error messages
    const errorMessages = formElement.querySelectorAll('.form-error');
    errorMessages.forEach(message => message.remove());
  }
  
  /**
   * Dark mode implementation
   */
  function initDarkMode() {
    // Define dark mode variables
    const darkModeVars = {
      '--bg-body': '#1f2937',
      '--bg-card': '#111827',
      '--bg-sidebar': '#111827',
      '--text-primary': '#f9fafb',
      '--text-secondary': '#e5e7eb',
      '--text-light': '#9ca3af',
      '--border-color': '#374151',
      '--border-light': '#1f2937'
    };
    
    // Apply dark mode if enabled
    const isDarkMode = localStorage.getItem('nungo-theme') === 'dark';
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      
      // Apply CSS variables
      for (const [key, value] of Object.entries(darkModeVars)) {
        document.documentElement.style.setProperty(key, value);
      }
    }
    
    // Toggle functionality already implemented in initializeThemeToggle()
  }
  
  /**
   * Mock authentication for demo purposes
   */
  function mockAuth(email, password, remember) {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Accept any credentials for demo
        const userData = {
          id: 'user-123',
          name: 'John Doe',
          email: email,
          avatar: 'https://via.placeholder.com/40'
        };
        
        const authToken = 'mock-auth-token-' + Math.random().toString(36).substring(2);
        
        // Store token based on remember preference
        if (remember) {
          localStorage.setItem('nungo-auth-token', authToken);
        } else {
          sessionStorage.setItem('nungo-auth-token', authToken);
        }
        
        // Store user data
        localStorage.setItem('nungo-user-data', JSON.stringify(userData));
        
        resolve(userData);
      }, 800); // Simulate network delay
    });
  }
  
  /**
   * Get user data from storage
   */
  function getUserData() {
    const userData = localStorage.getItem('nungo-user-data');
    return userData ? JSON.parse(userData) : null;
  }
  
  /**
   * Mock API for saving mood data
   */
  function saveMoodData(moodData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get existing data or initialize empty array
        const existingData = localStorage.getItem('nungo-mood-data');
        const moodDataArray = existingData ? JSON.parse(existingData) : [];
        
        // Add new entry
        moodDataArray.push({
          ...moodData,
          id: generateId('mood'),
          timestamp: new Date().toISOString()
        });
        
        // Save back to storage
        localStorage.setItem('nungo-mood-data', JSON.stringify(moodDataArray));
        
        resolve({ success: true });
      }, 800);
    });
  }
  
  /**
   * Get mood data from storage
   */
  function getMoodData() {
    const moodData = localStorage.getItem('nungo-mood-data');
    return moodData ? JSON.parse(moodData) : [];
  }
  
  /**
   * Mock API for saving journal entries
   */
  function saveJournalEntry(entryData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get existing data or initialize empty array
        const existingData = localStorage.getItem('nungo-journal-data');
        const journalDataArray = existingData ? JSON.parse(existingData) : [];
        
        // Add new entry
        journalDataArray.push({
          ...entryData,
          id: generateId('journal'),
          timestamp: new Date().toISOString()
        });
        
        // Save back to storage
        localStorage.setItem('nungo-journal-data', JSON.stringify(journalDataArray));
        
        resolve({ success: true });
      }, 800);
    });
  }
  
  /**
   * Get journal entries from storage
   */
  function getJournalEntries() {
    const journalData = localStorage.getItem('nungo-journal-data');
    return journalData ? JSON.parse(journalData) : [];
  }
  
  // Export functions for use in other modules
  window.NungoApp = {
    // UI functions
    initializeTabs,
    showNotification,
    openModal,
    closeModal,
    
    // Authentication
    checkAuth,
    mockAuth,
    logout,
    getUserData,
    setUserData,
    
    // Data functions
    saveMoodData,
    getMoodData,
    saveJournalEntry,
    getJournalEntries,
    
    // Utility functions
    formatDate,
    formatTime,
    formatDateTime,
    timeElapsed,
    formatNumber,
    truncateText,
    generateId,
    debounce,
    throttle,
    validateForm,
    resetForm
  };