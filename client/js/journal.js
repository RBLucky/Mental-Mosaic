/**
 * Nungo Builds Calm - Journal JavaScript
 * Handles journal entries, view switching, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!window.NungoApp.checkAuth()) {
      return;
    }
    
    // Initialize journal functionality
    initializeJournal();
    
    // Load journal entries
    loadJournalEntries();
    
    // Set up event listeners
    setupEventListeners();
  });
  
  /**
   * Initialize journal functionality
   */
  function initializeJournal() {
    // Initialize view options
    initializeViewOptions();
    
    // Initialize new entry modal
    initializeNewEntryModal();
    
    // Initialize entry selection
    initializeEntrySelection();
    
    // Initialize search functionality
    initializeSearch();
  }
  
  /**
   * Initialize view options (grid/list view)
   */
  function initializeViewOptions() {
    const viewOptions = document.querySelectorAll('.view-option');
    
    viewOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Remove active class from all options
        viewOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        this.classList.add('active');
        
        // Update view
        const viewType = this.getAttribute('data-view');
        updateJournalView(viewType);
      });
    });
  }
  
  /**
   * Update journal view (grid/list)
   */
  function updateJournalView(viewType) {
    const entriesList = document.querySelector('.entries-list');
    
    if (entriesList) {
      if (viewType === 'grid') {
        entriesList.classList.remove('list-view');
        entriesList.classList.add('grid-view');
      } else {
        entriesList.classList.remove('grid-view');
        entriesList.classList.add('list-view');
      }
    }
  }
  
  /**
   * Initialize new entry modal
   */
  function initializeNewEntryModal() {
    const newEntryButton = document.getElementById('new-entry-button');
    const newEntryModal = document.getElementById('new-entry-modal');
    
    if (newEntryButton && newEntryModal) {
      newEntryButton.addEventListener('click', function() {
        window.NungoApp.openModal(newEntryModal);
      });
    }
  }
  
  /**
   * Initialize entry selection
   */
  function initializeEntrySelection() {
    // This will be populated when entries are loaded
    document.addEventListener('click', function(e) {
      if (e.target.closest('.journal-entry-item')) {
        const entryItem = e.target.closest('.journal-entry-item');
        const entryId = entryItem.getAttribute('data-id');
        
        // Remove active class from all entries
        document.querySelectorAll('.journal-entry-item').forEach(entry => {
          entry.classList.remove('active');
        });
        
        // Add active class to clicked entry
        entryItem.classList.add('active');
        
        // Show entry details
        showEntryDetails(entryId);
      }
    });
  }
  
  /**
   * Show entry details
   */
  function showEntryDetails(entryId) {
    // Get entry data
    const journalEntries = window.NungoApp.getJournalEntries();
    const entry = journalEntries.find(entry => entry.id === entryId);
    
    if (!entry) {
      return;
    }
    
    // Get all entry details
    const entryDetails = document.querySelectorAll('.entry-detail');
    
    // Hide all entry details
    entryDetails.forEach(detail => {
      detail.style.display = 'none';
    });
    
    // Check if detail panel exists
    let detailPanel = document.getElementById(`${entryId}-detail`);
    
    if (!detailPanel) {
      // Create new detail panel
      detailPanel = createEntryDetailPanel(entry);
      
      // Add to journal detail panel
      const journalDetailPanel = document.querySelector('.journal-detail-panel');
      if (journalDetailPanel) {
        journalDetailPanel.appendChild(detailPanel);
      }
    } else {
      // Show existing detail panel
      detailPanel.style.display = 'block';
    }
  }
  
  /**
   * Create entry detail panel
   */
  function createEntryDetailPanel(entry) {
    const detailPanel = document.createElement('div');
    detailPanel.className = 'entry-detail';
    detailPanel.id = `${entry.id}-detail`;
    
    // Format date
    const entryDate = new Date(entry.timestamp);
    const formattedDate = window.NungoApp.formatDateTime(entryDate);
    
    // Create detail content
    detailPanel.innerHTML = `
      <div class="entry-detail-header">
        <h2>${entry.title}</h2>
        <div class="entry-meta">
          <span class="entry-timestamp">${formattedDate}</span>
          <div class="entry-actions">
            <button class="entry-action-button edit-entry" title="Edit" data-id="${entry.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="entry-action-button delete-entry" title="Delete" data-id="${entry.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="entry-detail-content">
        ${formatJournalContent(entry.content)}
      </div>
    `;
    
    // Add AI feedback if available
    if (entry.ai_feedback) {
      const aiFeedback = document.createElement('div');
      aiFeedback.className = 'entry-ai-feedback';
      
      aiFeedback.innerHTML = `
        <div class="ai-feedback-header">
          <h3><i class="fas fa-robot"></i> AI Insights</h3>
        </div>
        <div class="ai-feedback-content">
          <p>${entry.ai_feedback}</p>
        </div>
      `;
      
      detailPanel.appendChild(aiFeedback);
    }
    
    // Add related resources if available
    if (entry.resources && entry.resources.length > 0) {
      const relatedResources = document.createElement('div');
      relatedResources.className = 'entry-related';
      
      let resourcesHTML = `<h3>Related Resources</h3><div class="related-resources">`;
      
      entry.resources.forEach(resource => {
        resourcesHTML += `
          <a href="${resource.link}" class="related-resource">
            <i class="fas fa-link"></i>
            <span>${resource.title}</span>
          </a>
        `;
      });
      
      resourcesHTML += `</div>`;
      relatedResources.innerHTML = resourcesHTML;
      
      detailPanel.appendChild(relatedResources);
    }
    
    // Add event listeners for actions
    setTimeout(() => {
      // Edit button
      const editButton = detailPanel.querySelector('.edit-entry');
      if (editButton) {
        editButton.addEventListener('click', function() {
          const entryId = this.getAttribute('data-id');
          editJournalEntry(entryId);
        });
      }
      
      // Delete button
      const deleteButton = detailPanel.querySelector('.delete-entry');
      if (deleteButton) {
        deleteButton.addEventListener('click', function() {
          const entryId = this.getAttribute('data-id');
          confirmDeleteEntry(entryId);
        });
      }
    }, 0);
    
    return detailPanel;
  }
  
  /**
   * Format journal content with paragraphs
   */
  function formatJournalContent(content) {
    if (!content) return '';
    
    // Split by newlines and create paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map(paragraph => {
      // Skip empty paragraphs
      if (!paragraph.trim()) return '';
      
      // Handle line breaks within paragraphs
      const formattedParagraph = paragraph.replace(/\n/g, '<br>');
      
      return `<p>${formattedParagraph}</p>`;
    }).join('');
  }
  
  /**
   * Initialize search functionality
   */
  function initializeSearch() {
    const searchInput = document.getElementById('journal-search-input');
    
    if (searchInput) {
      searchInput.addEventListener('input', window.NungoApp.debounce(function() {
        const searchTerm = this.value.toLowerCase().trim();
        searchJournalEntries(searchTerm);
      }, 300));
    }
  }
  
  /**
   * Search journal entries
   */
  function searchJournalEntries(searchTerm) {
    const journalEntries = window.NungoApp.getJournalEntries();
    
    if (searchTerm === '') {
      // Reset to show all entries
      loadJournalEntries();
      return;
    }
    
    // Filter entries by search term
    const filteredEntries = journalEntries.filter(entry => {
      return (
        entry.title.toLowerCase().includes(searchTerm) ||
        entry.content.toLowerCase().includes(searchTerm)
      );
    });
    
    // Render filtered entries
    renderJournalEntries(filteredEntries);
    
    // If no entries match, show empty state
    if (filteredEntries.length === 0) {
      const entriesList = document.querySelector('.entries-list');
      
      if (entriesList) {
        entriesList.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-search"></i>
            </div>
            <h3>No entries found</h3>
            <p>No journal entries match your search term.</p>
          </div>
        `;
      }
    }
  }
  
  /**
   * Load journal entries
   */
  function loadJournalEntries() {
    // Get journal entries
    const journalEntries = window.NungoApp.getJournalEntries();
    
    // Sort by date (newest first)
    journalEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Filter based on selected option
    const entriesFilter = document.getElementById('entries-filter');
    const filterValue = entriesFilter ? entriesFilter.value : 'recent';
    
    let filteredEntries = [...journalEntries];
    
    // Apply filter
    if (filterValue === 'oldest') {
      filteredEntries.reverse();
    } else if (filterValue === 'positive') {
      filteredEntries = filteredEntries.filter(entry => entry.sentiment >= 0.6);
    } else if (filterValue === 'negative') {
      filteredEntries = filteredEntries.filter(entry => entry.sentiment <= 0.4);
    }
    
    // Render entries
    renderJournalEntries(filteredEntries);
  }
  
  /**
   * Render journal entries
   */
  function renderJournalEntries(entries) {
    const entriesList = document.querySelector('.entries-list');
    
    if (entriesList) {
      // Clear existing entries
      entriesList.innerHTML = '';
      
      if (entries.length === 0) {
        // No entries available
        entriesList.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-book"></i>
            </div>
            <h3>No journal entries yet</h3>
            <p>Start your journaling journey by adding your first entry.</p>
          </div>
        `;
        return;
      }
      
      // Add entries
      entries.forEach((entry, index) => {
        const entryItem = document.createElement('div');
        entryItem.className = 'journal-entry-item';
        entryItem.setAttribute('data-id', entry.id);
        
        // Make first entry active
        if (index === 0) {
          entryItem.classList.add('active');
        }
        
        // Format date
        const entryDate = new Date(entry.timestamp);
        const day = entryDate.getDate();
        const month = entryDate.toLocaleString('default', { month: 'short' });
        const year = entryDate.getFullYear();
        
        // Determine sentiment class
        let sentimentClass = 'neutral';
        if (entry.sentiment >= 0.6) {
          sentimentClass = 'positive';
        } else if (entry.sentiment <= 0.4) {
          sentimentClass = 'negative';
        }
        
        // Create entry item
        entryItem.innerHTML = `
          <div class="entry-date">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
            <span class="year">${year}</span>
          </div>
          <div class="entry-preview">
            <h3>${entry.title}</h3>
            <p>${window.NungoApp.truncateText(entry.content.replace(/\n/g, ' '), 100)}</p>
          </div>
          <div class="entry-sentiment ${sentimentClass}">
            <i class="fas fa-${sentimentClass === 'positive' ? 'arrow-up' : sentimentClass === 'negative' ? 'arrow-down' : 'minus'}"></i>
          </div>
        `;
        
        entriesList.appendChild(entryItem);
      });
      
      // Show first entry details
      if (entries.length > 0) {
        showEntryDetails(entries[0].id);
      }
    }
  }
  
  /**
   * Edit journal entry
   */
  function editJournalEntry(entryId) {
    const journalEntries = window.NungoApp.getJournalEntries();
    const entry = journalEntries.find(entry => entry.id === entryId);
    
    if (!entry) {
      return;
    }
    
    // Populate new entry modal with entry data
    const titleInput = document.getElementById('entry-title');
    const contentTextarea = document.getElementById('entry-content');
    const aiToggle = document.getElementById('ai-toggle');
    
    if (titleInput && contentTextarea) {
      titleInput.value = entry.title;
      contentTextarea.value = entry.content;
      
      if (aiToggle) {
        aiToggle.checked = true;
      }
      
      // Open modal
      const newEntryModal = document.getElementById('new-entry-modal');
      if (newEntryModal) {
        // Update modal title
        const modalHeader = newEntryModal.querySelector('.modal-header h2');
        if (modalHeader) {
          modalHeader.textContent = 'Edit Journal Entry';
        }
        
        // Update save button
        const saveButton = newEntryModal.querySelector('#save-entry-button');
        if (saveButton) {
          saveButton.textContent = 'Update Entry';
          saveButton.setAttribute('data-mode', 'edit');
          saveButton.setAttribute('data-id', entryId);
        }
        
        window.NungoApp.openModal(newEntryModal);
      }
    }
  }
  
  /**
   * Confirm delete entry
   */
  function confirmDeleteEntry(entryId) {
    const confirmationModal = document.getElementById('delete-confirmation-modal');
    
    if (confirmationModal) {
      // Set entry ID for delete confirmation
      const confirmButton = confirmationModal.querySelector('#confirm-delete');
      if (confirmButton) {
        confirmButton.setAttribute('data-id', entryId);
      }
      
      // Open modal
      window.NungoApp.openModal(confirmationModal);
    }
  }
  
  /**
   * Delete journal entry
   */
  function deleteJournalEntry(entryId) {
    // Get journal entries
    let journalEntries = window.NungoApp.getJournalEntries();
    
    // Filter out the entry to delete
    const updatedEntries = journalEntries.filter(entry => entry.id !== entryId);
    
    // Save updated entries
    localStorage.setItem('nungo-journal-data', JSON.stringify(updatedEntries));
    
    // Reload entries
    loadJournalEntries();
    
    // Show notification
    window.NungoApp.showNotification('Journal entry deleted successfully', 'success');
  }
  
  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Filter change
    const entriesFilter = document.getElementById('entries-filter');
    if (entriesFilter) {
      entriesFilter.addEventListener('change', function() {
        loadJournalEntries();
      });
    }
    
    // Delete confirmation
    const confirmDeleteButton = document.getElementById('confirm-delete');
    if (confirmDeleteButton) {
      confirmDeleteButton.addEventListener('click', function() {
        const entryId = this.getAttribute('data-id');
        
        if (entryId) {
          // Delete entry
          deleteJournalEntry(entryId);
          
          // Close modal
          const modal = document.getElementById('delete-confirmation-modal');
          if (modal) {
            window.NungoApp.closeModal(modal);
          }
        }
      });
    }
    
    // Save entry button
    const saveEntryButton = document.getElementById('save-entry-button');
    if (saveEntryButton) {
      saveEntryButton.addEventListener('click', function() {
        const mode = this.getAttribute('data-mode') || 'create';
        const entryId = this.getAttribute('data-id');
        
        const titleInput = document.getElementById('entry-title');
        const contentTextarea = document.getElementById('entry-content');
        const aiToggle = document.getElementById('ai-toggle');
        
        if (!titleInput || !contentTextarea) {
          return;
        }
        
        const title = titleInput.value.trim();
        const content = contentTextarea.value.trim();
        
        if (!title) {
          window.NungoApp.showNotification('Please enter a title for your journal entry', 'error');
          return;
        }
        
        if (!content) {
          window.NungoApp.showNotification('Please enter content for your journal entry', 'error');
          return;
        }
        
        // Show loading state
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        if (mode === 'edit' && entryId) {
          // Update existing entry
          updateJournalEntry(entryId, title, content, aiToggle.checked);
        } else {
          // Create new entry
          createJournalEntry(title, content, aiToggle.checked);
        }
      });
    }
  }
  
  /**
   * Create new journal entry
   */
  function createJournalEntry(title, content, useAI) {
    if (useAI) {
      // Analyze using Azure AI
      window.NungoAzure.analyzeJournalEntry(content)
        .then(analysis => {
          saveEntryWithAnalysis(null, title, content, analysis);
        })
        .catch(error => {
          console.error('Error analyzing journal entry:', error);
          saveEntryWithAnalysis(null, title, content, null);
        });
    } else {
      saveEntryWithAnalysis(null, title, content, null);
    }
  }
  
  /**
   * Update existing journal entry
   */
  function updateJournalEntry(entryId, title, content, useAI) {
    if (useAI) {
      // Analyze using Azure AI
      window.NungoAzure.analyzeJournalEntry(content)
        .then(analysis => {
          saveEntryWithAnalysis(entryId, title, content, analysis);
        })
        .catch(error => {
          console.error('Error analyzing journal entry:', error);
          saveEntryWithAnalysis(entryId, title, content, null);
        });
    } else {
      saveEntryWithAnalysis(entryId, title, content, null);
    }
  }
  
  /**
   * Save entry with analysis
   */
  function saveEntryWithAnalysis(entryId, title, content, analysis) {
    // Get existing journal entries
    let journalEntries = window.NungoApp.getJournalEntries();
    
    if (entryId) {
      // Update existing entry
      const entryIndex = journalEntries.findIndex(entry => entry.id === entryId);
      
      if (entryIndex !== -1) {
        journalEntries[entryIndex] = {
          ...journalEntries[entryIndex],
          title: title,
          content: content,
          sentiment: analysis ? analysis.sentiment : journalEntries[entryIndex].sentiment,
          ai_feedback: analysis ? analysis.feedback : journalEntries[entryIndex].ai_feedback,
          resources: analysis ? analysis.resources : journalEntries[entryIndex].resources
        };
      }
    } else {
      // Create new entry
      const newEntry = {
        id: window.NungoApp.generateId('journal'),
        title: title,
        content: content,
        sentiment: analysis ? analysis.sentiment : 0.5,
        ai_feedback: analysis ? analysis.feedback : null,
        resources: analysis ? analysis.resources : [],
        timestamp: new Date().toISOString()
      };
      
      journalEntries.push(newEntry);
    }
    
    // Save to storage
    localStorage.setItem('nungo-journal-data', JSON.stringify(journalEntries));
    
    // Reload entries
    loadJournalEntries();
    
    // Reset and close modal
    const newEntryModal = document.getElementById('new-entry-modal');
    if (newEntryModal) {
      // Reset form
      const titleInput = document.getElementById('entry-title');
      const contentTextarea = document.getElementById('entry-content');
      
      if (titleInput && contentTextarea) {
        titleInput.value = '';
        contentTextarea.value = '';
      }
      
      // Reset modal title
      const modalHeader = newEntryModal.querySelector('.modal-header h2');
      if (modalHeader) {
        modalHeader.textContent = 'New Journal Entry';
      }
      
      // Reset save button
      const saveButton = newEntryModal.querySelector('#save-entry-button');
      if (saveButton) {
        saveButton.textContent = 'Save Entry';
        saveButton.removeAttribute('data-mode');
        saveButton.removeAttribute('data-id');
        saveButton.disabled = false;
      }
      
      // Close modal
      window.NungoApp.closeModal(newEntryModal);
    }
    
    // Show notification
    window.NungoApp.showNotification(
      entryId ? 'Journal entry updated successfully' : 'Journal entry saved successfully', 
      'success'
    );
  }