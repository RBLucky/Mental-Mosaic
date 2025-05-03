/**
 * Nungo Builds Calm - Mood Tracker JavaScript
 * Handles mood tracking, history, and insights
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!window.NungoApp.checkAuth()) {
      return;
    }
    
    // Initialize tabs
    window.NungoApp.initializeTabs();
    
    // Initialize mood selection
    initializeMoodSelection();
    
    // Initialize factor selection
    initializeFactorSelection();
    
    // Initialize save button
    initializeSaveButton();
    
    // Load mood history
    loadMoodHistory();
    
    // Load insights data
    loadInsightsData();
  });
  
  /**
   * Initialize mood selection functionality
   */
  function initializeMoodSelection() {
    const moodOptions = document.querySelectorAll('.mood-option');
    
    moodOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Remove selected class from all options
        moodOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        this.classList.add('selected');
      });
    });
  }
  
  /**
   * Initialize factor selection functionality
   */
  function initializeFactorSelection() {
    const factorOptions = document.querySelectorAll('.factor-option');
    
    factorOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Toggle selected class
        this.classList.toggle('selected');
      });
    });
  }
  
  /**
   * Initialize save button functionality
   */
  function initializeSaveButton() {
    const saveButton = document.getElementById('save-mood');
    
    if (saveButton) {
      saveButton.addEventListener('click', function() {
        saveMoodEntry();
      });
    }
  }
  
  /**
   * Save mood entry
   */
  function saveMoodEntry() {
    // Get selected mood
    const selectedMood = document.querySelector('.mood-option.selected');
    if (!selectedMood) {
      window.NungoApp.showNotification('Please select a mood', 'error');
      return;
    }
    
    // Get mood data
    const moodValue = selectedMood.getAttribute('data-value');
    const moodName = selectedMood.getAttribute('data-mood');
    
    // Get selected factors
    const selectedFactors = document.querySelectorAll('.factor-option.selected');
    const factors = Array.from(selectedFactors).map(factor => factor.getAttribute('data-factor'));
    
    // Get notes
    const notes = document.getElementById('mood-notes').value;
    
    // Create mood data object
    const moodData = {
      mood: moodName,
      moodValue: parseInt(moodValue),
      factors: factors,
      notes: notes,
      date: new Date().toISOString()
    };
    
    // Show loading state
    toggleSaveButtonLoadingState(true);
    
    // Save mood data
    window.NungoApp.saveMoodData(moodData)
      .then(response => {
        // Show success message
        window.NungoApp.showNotification('Mood logged successfully', 'success');
        
        // Show saved container
        showSavedContainer(moodData);
        
        // Update history and insights
        loadMoodHistory();
        loadInsightsData();
      })
      .catch(error => {
        console.error('Error saving mood data:', error);
        window.NungoApp.showNotification('Error saving mood data', 'error');
      })
      .finally(() => {
        toggleSaveButtonLoadingState(false);
      });
  }
  
  /**
   * Toggle save button loading state
   */
  function toggleSaveButtonLoadingState(isLoading) {
    const saveButton = document.getElementById('save-mood');
    
    if (saveButton) {
      if (isLoading) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveButton.classList.add('save-button-progress');
      } else {
        saveButton.disabled = false;
        saveButton.innerHTML = 'Save Mood Entry';
        saveButton.classList.remove('save-button-progress');
      }
    }
  }
  
  /**
   * Show saved container with recommendations
   */
  function showSavedContainer(moodData) {
    const moodLoggingContainer = document.querySelector('.mood-logging-container');
    const moodDetailsContainer = document.querySelector('.mood-details-container');
    const moodSavedContainer = document.querySelector('.mood-saved-container');
    
    if (moodLoggingContainer && moodDetailsContainer && moodSavedContainer) {
      // Hide details container
      moodDetailsContainer.style.display = 'none';
      
      // Show saved container
      moodSavedContainer.style.display = 'block';
      
      // Generate recommendations based on mood
      generateRecommendations(moodData);
      
      // Handle buttons
      const viewInsightsButton = document.getElementById('view-insights');
      const logAnotherButton = document.getElementById('log-another');
      
      if (viewInsightsButton) {
        viewInsightsButton.addEventListener('click', function() {
          // Switch to insights tab
          document.querySelector('.tab-button[data-tab="insights"]').click();
        });
      }
      
      if (logAnotherButton) {
        logAnotherButton.addEventListener('click', function() {
          // Reset form and show details container
          resetMoodForm();
          moodDetailsContainer.style.display = 'block';
          moodSavedContainer.style.display = 'none';
        });
      }
    }
  }
  
  /**
   * Generate recommendations based on mood data
   */
  function generateRecommendations(moodData) {
    const recommendationsContainer = document.querySelector('.mood-saved-container .recommendations');
    
    if (recommendationsContainer) {
      // Clear existing recommendations
      recommendationsContainer.innerHTML = '';
      
      // Generate recommendations based on mood and factors
      let recommendations = [];
      
      if (moodData.moodValue <= 2) {
        // Negative mood recommendations
        recommendations.push({
          icon: 'fas fa-heart',
          title: 'Self-Care Activity',
          description: 'Take a few minutes for a quick meditation or deep breathing exercise.'
        });
        
        if (moodData.factors.includes('work')) {
          recommendations.push({
            icon: 'fas fa-briefcase',
            title: 'Work Stress Management',
            description: 'Try the Pomodoro technique: work for 25 minutes, then take a 5-minute break.'
          });
        }
        
        if (moodData.factors.includes('sleep')) {
          recommendations.push({
            icon: 'fas fa-bed',
            title: 'Sleep Improvement',
            description: 'Consider a consistent sleep schedule and avoiding screens before bed.'
          });
        }
      } else if (moodData.moodValue === 3) {
        // Neutral mood recommendations
        recommendations.push({
          icon: 'fas fa-balance-scale',
          title: 'Mood Booster',
          description: 'Listen to your favorite uplifting song or take a short walk outside.'
        });
      } else {
        // Positive mood recommendations
        recommendations.push({
          icon: 'fas fa-star',
          title: 'Maintain Your Positive Mood',
          description: 'Journal about what went well today to reinforce positive feelings.'
        });
      }
      
      // Add general recommendation
      recommendations.push({
        icon: 'fas fa-book',
        title: 'Further Reading',
        description: 'Check out our resources section for more personalized content.'
      });
      
      // Add recommendations to container
      recommendations.forEach(recommendation => {
        const recommendationElement = document.createElement('div');
        recommendationElement.className = 'recommendation-item';
        
        recommendationElement.innerHTML = `
          <div class="recommendation-icon">
            <i class="${recommendation.icon}"></i>
          </div>
          <div class="recommendation-content">
            <h4>${recommendation.title}</h4>
            <p>${recommendation.description}</p>
          </div>
        `;
        
        recommendationsContainer.appendChild(recommendationElement);
      });
    }
  }
  
  /**
   * Reset mood form
   */
  function resetMoodForm() {
    // Clear mood selection
    const moodOptions = document.querySelectorAll('.mood-option.selected');
    moodOptions.forEach(option => option.classList.remove('selected'));
    
    // Clear factor selection
    const factorOptions = document.querySelectorAll('.factor-option.selected');
    factorOptions.forEach(option => option.classList.remove('selected'));
    
    // Clear notes
    const notesTextarea = document.getElementById('mood-notes');
    if (notesTextarea) {
      notesTextarea.value = '';
    }
  }
  
  /**
   * Load mood history
   */
  function loadMoodHistory() {
    // Get tab content
    const historyTab = document.getElementById('history');
    
    if (historyTab) {
      // Get mood data
      const moodData = window.NungoApp.getMoodData();
      
      if (moodData.length === 0) {
        // No mood data available
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
          <div class="empty-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3>No mood data yet</h3>
          <p>Start tracking your mood to see your history and insights.</p>
        `;
        
        historyTab.querySelector('.mood-entries-list').innerHTML = '';
        historyTab.querySelector('.mood-entries-list').appendChild(emptyState);
        
        // Hide chart
        const chartContainer = historyTab.querySelector('.mood-chart-container');
        if (chartContainer) {
          chartContainer.style.display = 'none';
        }
        
        return;
      }
      
      // Show chart
      const chartContainer = historyTab.querySelector('.mood-chart-container');
      if (chartContainer) {
        chartContainer.style.display = 'block';
        renderMoodHistoryChart(moodData);
      }
      
      // Sort mood data by date (newest first)
      moodData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Filter based on selected date range and mood type
      const dateFilter = document.getElementById('date-filter').value;
      const moodFilter = document.getElementById('mood-filter').value;
      const factorFilter = document.getElementById('factor-filter').value;
      
      const filteredData = filterMoodData(moodData, dateFilter, moodFilter, factorFilter);
      
      // Render mood entries
      renderMoodEntries(filteredData);
    }
  }
  
  /**
   * Filter mood data based on selected filters
   */
  function filterMoodData(moodData, dateFilter, moodFilter, factorFilter) {
    let filteredData = [...moodData];
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateFilter) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case '3months':
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }
      
      filteredData = filteredData.filter(entry => new Date(entry.date) >= startDate);
    }
    
    // Apply mood filter
    if (moodFilter !== 'all') {
      if (moodFilter === 'positive') {
        filteredData = filteredData.filter(entry => entry.moodValue >= 4);
      } else if (moodFilter === 'negative') {
        filteredData = filteredData.filter(entry => entry.moodValue <= 2);
      }
    }
    
    // Apply factor filter
    if (factorFilter !== 'all') {
      filteredData = filteredData.filter(entry => entry.factors.includes(factorFilter));
    }
    
    return filteredData;
  }
  
  /**
   * Render mood entries in the history tab
   */
  function renderMoodEntries(moodData) {
    const entriesList = document.querySelector('.mood-entries-list');
    
    if (entriesList) {
      // Clear existing entries
      entriesList.innerHTML = '';
      
      if (moodData.length === 0) {
        // No matching entries
        const noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results';
        noResultsMessage.innerHTML = `
          <p>No entries match your selected filters. Try adjusting your filters.</p>
        `;
        
        entriesList.appendChild(noResultsMessage);
        return;
      }
      
      // Add entries
      moodData.forEach(entry => {
        const entryDate = new Date(entry.date);
        const formattedDate = window.NungoApp.formatDate(entryDate);
        
        // Determine mood class
        let moodClass = 'neutral';
        if (entry.moodValue >= 4) {
          moodClass = 'positive';
        } else if (entry.moodValue <= 2) {
          moodClass = 'negative';
        }
        
        // Determine mood icon
        let moodIcon = '';
        switch (entry.mood) {
          case 'great':
            moodIcon = 'fa-grin-beam';
            break;
          case 'good':
            moodIcon = 'fa-smile';
            break;
          case 'okay':
            moodIcon = 'fa-meh';
            break;
          case 'low':
            moodIcon = 'fa-frown';
            break;
          case 'terrible':
            moodIcon = 'fa-sad-tear';
            break;
        }
        
        const entryElement = document.createElement('div');
        entryElement.className = 'mood-entry';
        
        entryElement.innerHTML = `
          <div class="mood-entry-header">
            <div class="entry-date">${formattedDate}</div>
            <div class="entry-mood ${moodClass}">
              <i class="fas ${moodIcon}"></i> ${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
            </div>
          </div>
          <div class="mood-entry-factors">
            ${entry.factors.map(factor => `<span class="factor-tag">${factor.charAt(0).toUpperCase() + factor.slice(1)}</span>`).join('')}
          </div>
          ${entry.notes ? `
            <div class="mood-entry-notes">
              <p>${entry.notes}</p>
            </div>
          ` : ''}
        `;
        
        entriesList.appendChild(entryElement);
      });
    }
  }
  
  /**
   * Render mood history chart
   */
  function renderMoodHistoryChart(moodData) {
    const chartCanvas = document.getElementById('mood-history-chart');
    
    if (chartCanvas) {
      // Sort data by date (oldest first for chart)
      const sortedData = [...moodData].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Limit to most recent 30 entries
      const limitedData = sortedData.slice(-30);
      
      // Prepare data for chart
      const labels = limitedData.map(entry => {
        const date = new Date(entry.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      const moodValues = limitedData.map(entry => entry.moodValue);
      
      // Create chart
      const moodChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Mood',
            data: moodValues,
            backgroundColor: 'rgba(91, 135, 249, 0.2)',
            borderColor: 'rgba(91, 135, 249, 1)',
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: limitedData.map(entry => {
              // Color points based on mood
              if (entry.moodValue >= 4) {
                return 'rgba(102, 192, 136, 1)'; // Positive
              } else if (entry.moodValue <= 2) {
                return 'rgba(232, 102, 113, 1)'; // Negative
              } else {
                return 'rgba(247, 205, 93, 1)'; // Neutral
              }
            }),
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  switch (value) {
                    case 1: return 'Terrible';
                    case 2: return 'Low';
                    case 3: return 'Okay';
                    case 4: return 'Good';
                    case 5: return 'Great';
                    default: return '';
                  }
                }
              },
              grid: {
                drawBorder: false
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const entry = limitedData[context.dataIndex];
                  const moodLabels = ['', 'Terrible', 'Low', 'Okay', 'Good', 'Great'];
                  const mood = moodLabels[entry.moodValue];
                  const factors = entry.factors.join(', ');
                  
                  return [
                    `Mood: ${mood}`,
                    `Factors: ${factors || 'None'}`
                  ];
                }
              }
            }
          }
        }
      });
    }
  }
  
  /**
   * Load insights data
   */
  function loadInsightsData() {
    // Get mood data
    const moodData = window.NungoApp.getMoodData();
    
    if (moodData.length === 0) {
      // No data available, show empty state
      const insightsTab = document.getElementById('insights');
      
      if (insightsTab) {
        const insightCards = insightsTab.querySelector('.insight-cards');
        
        if (insightCards) {
          insightCards.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-brain"></i>
              </div>
              <h3>Not enough data for insights</h3>
              <p>Log your mood regularly to see personalized insights.</p>
            </div>
          `;
        }
      }
      
      return;
    }
    
    // Generate insights
    renderTrendChart(moodData);
    renderFactorsImpactChart(moodData);
    renderWeeklyPatternChart(moodData);
    generateAISuggestions(moodData);
  }
  
  /**
   * Render trend chart
   */
  function renderTrendChart(moodData) {
    const trendCanvas = document.getElementById('trend-chart');
    
    if (trendCanvas) {
      // Sort data by date (oldest first)
      const sortedData = [...moodData].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Calculate monthly averages
      const monthlyAverages = {};
      
      sortedData.forEach(entry => {
        const date = new Date(entry.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyAverages[monthYear]) {
          monthlyAverages[monthYear] = {
            sum: 0,
            count: 0
          };
        }
        
        monthlyAverages[monthYear].sum += entry.moodValue;
        monthlyAverages[monthYear].count += 1;
      });
      
      const labels = Object.keys(monthlyAverages);
      const data = labels.map(month => monthlyAverages[month].sum / monthlyAverages[month].count);
      
      // Create chart
      new Chart(trendCanvas, {
        type: 'line',
        data: {
          labels: labels.map(month => {
            const [m, y] = month.split('/');
            return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(m) - 1]} ${y}`;
          }),
          datasets: [{
            label: 'Average Mood',
            data: data,
            backgroundColor: 'rgba(91, 135, 249, 0.2)',
            borderColor: 'rgba(91, 135, 249, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }
  
  /**
   * Render factors impact chart
   */
  function renderFactorsImpactChart(moodData) {
    const factorsCanvas = document.getElementById('factors-impact-chart');
    
    if (factorsCanvas) {
      // Calculate average mood for each factor
      const factorAverages = {};
      const factorCounts = {};
      
      moodData.forEach(entry => {
        entry.factors.forEach(factor => {
          if (!factorAverages[factor]) {
            factorAverages[factor] = 0;
            factorCounts[factor] = 0;
          }
          
          factorAverages[factor] += entry.moodValue;
          factorCounts[factor] += 1;
        });
      });
      
      // Calculate averages
      const factors = Object.keys(factorAverages);
      factors.forEach(factor => {
        factorAverages[factor] /= factorCounts[factor];
      });
      
      // Sort factors by average mood
      factors.sort((a, b) => factorAverages[b] - factorAverages[a]);
      
      // Create data for chart
      const labels = factors.map(factor => factor.charAt(0).toUpperCase() + factor.slice(1));
      const data = factors.map(factor => factorAverages[factor]);
      const backgroundColors = data.map(value => {
        if (value >= 4) {
          return 'rgba(102, 192, 136, 0.7)'; // Positive
        } else if (value <= 2) {
          return 'rgba(232, 102, 113, 0.7)'; // Negative
        } else {
          return 'rgba(247, 205, 93, 0.7)'; // Neutral
        }
      });
      
      // Create chart
      new Chart(factorsCanvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Average Mood',
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 0,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }
  
  /**
   * Render weekly pattern chart
   */
  function renderWeeklyPatternChart(moodData) {
    const weeklyCanvas = document.getElementById('weekly-pattern-chart');
    
    if (weeklyCanvas) {
      // Calculate average mood for each day of the week
      const dayAverages = {
        0: { sum: 0, count: 0 }, // Sunday
        1: { sum: 0, count: 0 }, // Monday
        2: { sum: 0, count: 0 }, // Tuesday
        3: { sum: 0, count: 0 }, // Wednesday
        4: { sum: 0, count: 0 }, // Thursday
        5: { sum: 0, count: 0 }, // Friday
        6: { sum: 0, count: 0 }  // Saturday
      };
      
      moodData.forEach(entry => {
        const date = new Date(entry.date);
        const day = date.getDay();
        
        dayAverages[day].sum += entry.moodValue;
        dayAverages[day].count += 1;
      });
      
      // Calculate averages
      const days = [0, 1, 2, 3, 4, 5, 6];
      const data = days.map(day => {
        return dayAverages[day].count > 0 ? dayAverages[day].sum / dayAverages[day].count : 0;
      });
      
      // Create chart
      new Chart(weeklyCanvas, {
        type: 'radar',
        data: {
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [{
            label: 'Average Mood',
            data: data,
            backgroundColor: 'rgba(91, 135, 249, 0.2)',
            borderColor: 'rgba(91, 135, 249, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(91, 135, 249, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }
  
  /**
   * Generate AI suggestions based on mood data
   */
  function generateAISuggestions(moodData) {
    const suggestionsList = document.querySelector('.suggestions-list');
    
    if (suggestionsList && moodData.length >= 5) {
      // Find positive and negative factors
      const factorMoods = {};
      
      moodData.forEach(entry => {
        entry.factors.forEach(factor => {
          if (!factorMoods[factor]) {
            factorMoods[factor] = {
              sum: 0,
              count: 0
            };
          }
          
          factorMoods[factor].sum += entry.moodValue;
          factorMoods[factor].count += 1;
        });
      });
      
      // Calculate average mood for each factor
      const factorAverages = {};
      
      for (const factor in factorMoods) {
        if (factorMoods[factor].count >= 3) {
          factorAverages[factor] = factorMoods[factor].sum / factorMoods[factor].count;
        }
      }
      
      // Find most positive and most negative factors
      let mostPositiveFactor = null;
      let mostNegativeFactor = null;
      let highestAverage = 0;
      let lowestAverage = 6;
      
      for (const factor in factorAverages) {
        if (factorAverages[factor] > highestAverage) {
          highestAverage = factorAverages[factor];
          mostPositiveFactor = factor;
        }
        
        if (factorAverages[factor] < lowestAverage) {
          lowestAverage = factorAverages[factor];
          mostNegativeFactor = factor;
        }
      }
      
      // Generate suggestions
      let suggestions = [];
      
      if (mostPositiveFactor) {
        suggestions.push(`Continue prioritizing ${mostPositiveFactor}, as it significantly boosts your mood.`);
      }
      
      if (mostNegativeFactor) {
        suggestions.push(`Consider developing strategies to manage stress related to ${mostNegativeFactor}.`);
      }
      
      // Add time-based suggestion
      const dayAverages = {
        0: { sum: 0, count: 0 }, // Sunday
        1: { sum: 0, count: 0 }, // Monday
        2: { sum: 0, count: 0 }, // Tuesday
        3: { sum: 0, count: 0 }, // Wednesday
        4: { sum: 0, count: 0 }, // Thursday
        5: { sum: 0, count: 0 }, // Friday
        6: { sum: 0, count: 0 }  // Saturday
      };
      
      moodData.forEach(entry => {
        const date = new Date(entry.date);
        const day = date.getDay();
        
        dayAverages[day].sum += entry.moodValue;
        dayAverages[day].count += 1;
      });
      
      // Find lowest day
      let lowestDay = 0;
      let lowestDayAvg = 5;
      
      for (let i = 0; i < 7; i++) {
        if (dayAverages[i].count > 0) {
          const avg = dayAverages[i].sum / dayAverages[i].count;
          if (avg < lowestDayAvg) {
            lowestDayAvg = avg;
            lowestDay = i;
          }
        }
      }
      
      const days = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
      if (lowestDayAvg < 3) {
        suggestions.push(`Plan mood-boosting activities for ${days[lowestDay]}, when your mood tends to be lower.`);
      }
      
      // Render suggestions
      suggestionsList.innerHTML = '';
      
      suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check-circle"></i> ${suggestion}`;
        suggestionsList.appendChild(li);
      });
    }
  }
  
  // Add event listeners for filter changes
  document.addEventListener('DOMContentLoaded', function() {
    const dateFilter = document.getElementById('date-filter');
    const moodFilter = document.getElementById('mood-filter');
    const factorFilter = document.getElementById('factor-filter');
    
    if (dateFilter && moodFilter && factorFilter) {
      dateFilter.addEventListener('change', loadMoodHistory);
      moodFilter.addEventListener('change', loadMoodHistory);
      factorFilter.addEventListener('change', loadMoodHistory);
    }
  });