/**
 * MentalMosaic - Dashboard JavaScript
 * Handles quick mood selection on the dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize quick mood buttons
    initializeQuickMoodButtons();
  });
  
  /**
   * Initialize quick mood buttons on the dashboard
   */
  function initializeQuickMoodButtons() {
    const moodButtons = document.querySelectorAll('.mood-button');
    
    moodButtons.forEach(button => {
      button.addEventListener('click', function() {
        const mood = this.getAttribute('data-mood');
        const moodValue = {
          'great': 5,
          'good': 4,
          'okay': 3,
          'low': 2,
          'terrible': 1
        }[mood] || 3;
        
        // Show selection feedback
        moodButtons.forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        
        // Save mood data
        const moodData = {
          mood: mood,
          moodValue: moodValue,
          factors: [],
          notes: 'Quick mood check from dashboard',
          date: new Date().toISOString()
        };
        
        // Save to localStorage
        saveMoodData(moodData)
          .then(() => {
            // Show success notification
            showNotification('Mood logged successfully!', 'success');
            
            // Remove selection after 2 seconds
            setTimeout(() => {
              this.classList.remove('selected');
            }, 2000);
          })
          .catch(error => {
            console.error('Error saving mood:', error);
            showNotification('Error saving mood. Please try again.', 'error');
          });
      });
    });
  }
  
  /**
   * Save mood data to localStorage
   */
  function saveMoodData(moodData) {
    return new Promise((resolve, reject) => {
      try {
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
      } catch (error) {
        console.error('Error saving mood data:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Generate a random ID
   */
  function generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
  }
  
  /**
   * Show a notification
   */
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${icon}"></i>
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