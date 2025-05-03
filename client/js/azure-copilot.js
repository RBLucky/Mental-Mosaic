/**
 * Nungo Builds Calm - Azure and Copilot Integration
 * Handles integration with Azure services and Microsoft Copilot
 */

// Configuration 
const AZURE_CONFIG = {
    // Azure OpenAI Configuration
    openAI: {
      endpoint: "https://your-azure-openai-endpoint.openai.azure.com/",
      deploymentId: "your-deployment-id",
      apiVersion: "2023-05-15",
      apiKey: "YOUR_AZURE_OPENAI_API_KEY" // Replace with your actual API key or use environment variables
    },
    
    // Azure Cognitive Services Configuration
    cognitiveServices: {
      endpoint: "https://your-cognitive-services-endpoint.cognitiveservices.azure.com/",
      apiKey: "YOUR_COGNITIVE_SERVICES_API_KEY" // Replace with your actual API key or use environment variables
    },
    
    // Azure Health Bot Configuration
    healthBot: {
      endpoint: "https://your-health-bot-endpoint.azurewebsites.net/",
      apiKey: "YOUR_HEALTH_BOT_API_KEY" // Replace with your actual API key or use environment variables
    }
  };
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat if we're on the right page
    initializeChat();
    
    // Initialize journal AI assistance
    initializeJournalAI();
  });
  
  /**
   * Initialize chat functionality
   */
  function initializeChat() {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendMessageButton = document.getElementById('send-message');
    
    if (chatMessages && userMessageInput && sendMessageButton) {
      // Set up event listeners
      sendMessageButton.addEventListener('click', function() {
        sendUserMessage();
      });
      
      userMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendUserMessage();
        }
      });
    }
  }
  
  /**
   * Send user message to chat
   */
  function sendUserMessage() {
    const userMessageInput = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');
    
    if (userMessageInput && chatMessages) {
      const userMessage = userMessageInput.value.trim();
      
      if (userMessage) {
        // Add user message to chat
        addMessageToChat('user', userMessage);
        
        // Clear input
        userMessageInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get AI response
        getAIResponse(userMessage)
          .then(response => {
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add AI response to chat
            addMessageToChat('assistant', response);
            
            // Scroll to bottom
            scrollChatToBottom();
          })
          .catch(error => {
            console.error('Error getting AI response:', error);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add error message
            addMessageToChat('assistant', 'I apologize, but I encountered an error processing your message. Please try again.');
            
            // Scroll to bottom
            scrollChatToBottom();
          });
        
        // Scroll to bottom
        scrollChatToBottom();
      }
    }
  }
  
  /**
   * Add message to chat
   */
  function addMessageToChat(sender, content) {
    const chatMessages = document.getElementById('chat-messages');
    
    if (chatMessages) {
      const messageElement = document.createElement('div');
      messageElement.className = `message ${sender}`;
      
      if (sender === 'assistant') {
        messageElement.innerHTML = `
          <div class="message-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <p>${content}</p>
          </div>
        `;
      } else {
        messageElement.innerHTML = `
          <div class="message-content">
            <p>${content}</p>
          </div>
        `;
      }
      
      chatMessages.appendChild(messageElement);
    }
  }
  
  /**
   * Show typing indicator
   */
  function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    
    if (chatMessages) {
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'message assistant typing-indicator-container';
      typingIndicator.id = 'typing-indicator';
      
      typingIndicator.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      `;
      
      chatMessages.appendChild(typingIndicator);
      scrollChatToBottom();
    }
  }
  
  /**
   * Hide typing indicator
   */
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  /**
   * Scroll chat to bottom
   */
  function scrollChatToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
  
  /**
   * Get AI response using Azure OpenAI
   */
  async function getAIResponse(userMessage) {
    // For hackathon purposes, we'll simulate API calls
    // In a production app, you would make actual API calls to Azure OpenAI
    
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Check for crisis language
        if (detectCrisisLanguage(userMessage)) {
          resolve(getCrisisResponse(userMessage));
          return;
        }
        
        // Get contextual responses based on message content
        if (userMessage.toLowerCase().includes('stress') || userMessage.toLowerCase().includes('stressed')) {
          resolve("I'm sorry to hear you're feeling stressed. This is a common experience. Consider trying a brief breathing exercise: breathe in for 4 counts, hold for 4, and exhale for 6. Would you like me to suggest some other stress management techniques?");
        } else if (userMessage.toLowerCase().includes('sleep') || userMessage.toLowerCase().includes('tired')) {
          resolve("Sleep is crucial for mental wellbeing. If you're having trouble sleeping, you might try establishing a consistent bedtime routine, limiting screen time before bed, and creating a comfortable sleep environment. Would you like some more specific sleep improvement tips?");
        } else if (userMessage.toLowerCase().includes('anxious') || userMessage.toLowerCase().includes('anxiety')) {
          resolve("Anxiety can be challenging to manage. When you notice anxious thoughts, try the 5-4-3-2-1 grounding technique: acknowledge 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. Would you like to explore more anxiety management strategies?");
        } else if (userMessage.toLowerCase().includes('sad') || userMessage.toLowerCase().includes('down')) {
          resolve("I'm sorry you're feeling down. Remember that emotions fluctuate, and it's okay to experience sadness. Consider engaging in an activity that typically brings you joy, even if it's small. Would it help to discuss what might be contributing to these feelings?");
        } else if (userMessage.toLowerCase().includes('meditation') || userMessage.toLowerCase().includes('mindfulness')) {
          resolve("Mindfulness meditation can be a powerful tool for mental health. Even just 5 minutes of focused breathing can help center your thoughts. Would you like me to guide you through a brief mindfulness exercise?");
        } else if (userMessage.toLowerCase().includes('work') || userMessage.toLowerCase().includes('job')) {
          resolve("Work-related stress is very common. Setting boundaries between work and personal life can be helpful, such as designated work hours and taking breaks. Would you like to discuss some specific workplace stress management strategies?");
        } else {
          // Generic responses for other queries
          const genericResponses = [
            "Thank you for sharing that with me. How are you feeling about it right now?",
            "I appreciate you opening up about this. Would you like to explore some coping strategies that might help with these feelings?",
            "That sounds challenging. Would it help to talk more about specific aspects of what you're experiencing?",
            "I understand this is difficult. Sometimes breaking things down into smaller parts can make them feel more manageable. Would that approach be helpful?",
            "Your wellbeing is important. What's one small thing you could do today to support your mental health?"
          ];
          
          const randomIndex = Math.floor(Math.random() * genericResponses.length);
          resolve(genericResponses[randomIndex]);
        }
      }, 1500); // Simulate delay
    });
  }
  
  /**
   * Detect crisis language in message
   */
  function detectCrisisLanguage(message) {
    const crisisTerms = [
      'suicide', 'kill myself', 'end my life', 'don\'t want to live',
      'hurt myself', 'self-harm', 'die', 'death', 'no reason to live',
      'end it all', 'better off dead'
    ];
    
    const lowerMessage = message.toLowerCase();
    
    return crisisTerms.some(term => lowerMessage.includes(term));
  }
  
  /**
   * Get crisis response
   */
  function getCrisisResponse(message) {
    return `I'm concerned about what you're saying. If you're having thoughts of harming yourself, please know that you're not alone and help is available.
  
  Please consider reaching out to a crisis support service:
  
  • National Suicide Prevention Lifeline: 1-800-273-8255
  • Crisis Text Line: Text HOME to 741741
  • Or call your local emergency services: 911
  
  Would you like me to provide more resources or would it help to talk about what's going on?`;
  }
  
  /**
   * Initialize journal AI assistance
   */
  function initializeJournalAI() {
    // Set up event listeners for the journal form
    const journalForm = document.getElementById('entry-content');
    const aiToggle = document.getElementById('ai-toggle');
    
    if (journalForm && aiToggle) {
      // Add event listener for journal prompts
      const promptButtons = document.querySelectorAll('.prompt-button');
      
      promptButtons.forEach(button => {
        button.addEventListener('click', function() {
          const promptType = this.getAttribute('data-prompt');
          applyJournalPrompt(promptType);
        });
      });
      
      // Set up save entry button
      const saveEntryButton = document.getElementById('save-entry-button');
      
      if (saveEntryButton) {
        saveEntryButton.addEventListener('click', function() {
          if (aiToggle.checked) {
            // Get AI analysis before saving
            const entryContent = journalForm.value;
            analyzeJournalEntry(entryContent)
              .then(analysis => {
                // Save journal entry with AI feedback
                saveJournalEntryWithAnalysis(entryContent, analysis);
              })
              .catch(error => {
                console.error('Error analyzing journal entry:', error);
                // Save anyway without analysis
                saveJournalEntryWithAnalysis(entryContent, null);
              });
          } else {
            // Save without AI analysis
            saveJournalEntryWithAnalysis(journalForm.value, null);
          }
        });
      }
    }
  }
  
  /**
   * Apply journal prompt
   */
  function applyJournalPrompt(promptType) {
    const journalForm = document.getElementById('entry-content');
    
    if (journalForm) {
      let promptText = '';
      
      switch (promptType) {
        case 'gratitude':
          promptText = "Today, I'm grateful for...\n\nThese things brought me joy because...\n\nI appreciate the people in my life who...";
          break;
        case 'challenge':
          promptText = "A challenge I'm facing is...\n\nThis makes me feel...\n\nSome ways I might approach this include...";
          break;
        case 'reflection':
          promptText = "When I reflect on today, I notice...\n\nI'm proud of myself for...\n\nTomorrow, I hope to...";
          break;
        case 'growth':
          promptText = "Something I learned recently is...\n\nThis matters to me because...\n\nI can apply this learning by...";
          break;
      }
      
      if (promptText) {
        // Add prompt to journal form
        journalForm.value = promptText;
        journalForm.focus();
      }
    }
  }
  
  /**
   * Analyze journal entry using Azure Cognitive Services
   */
  async function analyzeJournalEntry(entryContent) {
    // For hackathon purposes, we'll simulate API calls
    // In a production app, you would make actual API calls to Azure Cognitive Services
    
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate sentiment analysis
        const sentimentScore = calculateSimulatedSentiment(entryContent);
        
        // Generate feedback based on sentiment
        const feedback = generateJournalFeedback(entryContent, sentimentScore);
        
        // Generate related resources
        const relatedResources = generateRelatedResources(entryContent, sentimentScore);
        
        resolve({
          sentiment: sentimentScore,
          feedback: feedback,
          resources: relatedResources
        });
      }, 1500); // Simulate delay
    });
  }
  
  /**
   * Calculate simulated sentiment score
   */
  function calculateSimulatedSentiment(text) {
    // Simplified sentiment analysis based on positive and negative words
    // In a real app, this would use Azure Cognitive Services
    
    const positiveWords = [
      'happy', 'joy', 'grateful', 'thankful', 'excited', 'love', 'hope',
      'positive', 'success', 'achieve', 'accomplished', 'proud', 'calm',
      'peaceful', 'relaxed', 'content', 'blessing', 'appreciate', 'good'
    ];
    
    const negativeWords = [
      'sad', 'angry', 'upset', 'stressed', 'anxious', 'worried', 'fear',
      'disappointed', 'frustrated', 'tired', 'exhausted', 'overwhelmed',
      'depressed', 'hurt', 'pain', 'struggle', 'difficult', 'bad', 'hate'
    ];
    
    const words = text.toLowerCase().split(/\W+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) {
        positiveCount++;
      } else if (negativeWords.includes(word)) {
        negativeCount++;
      }
    });
    
    // Calculate sentiment score (0 to 1)
    const totalSentimentWords = positiveCount + negativeCount;
    
    if (totalSentimentWords === 0) {
      return 0.5; // Neutral
    }
    
    return positiveCount / totalSentimentWords;
  }
  
  /**
   * Generate journal feedback based on sentiment
   */
  function generateJournalFeedback(entryContent, sentimentScore) {
    // Generate feedback based on sentiment score
    if (sentimentScore >= 0.8) {
      return "I notice a very positive tone in your entry. You seem to be experiencing a sense of joy and fulfillment. Reflecting on positive experiences helps reinforce them in your memory. What specific moments brought you the most happiness today?";
    } else if (sentimentScore >= 0.6) {
      return "Your entry has a generally positive outlook. You appear to be maintaining a constructive perspective. This balanced positivity is associated with resilience. What strategies have been helping you maintain this positive mindset?";
    } else if (sentimentScore >= 0.4) {
      return "Your entry reflects a balanced perspective with both positive and challenging elements. This realistic outlook shows emotional awareness. Consider exploring both the satisfying and difficult aspects of your experiences to gain deeper insights.";
    } else if (sentimentScore >= 0.2) {
      return "I'm noticing some challenging emotions in your entry. It takes courage to acknowledge difficult feelings. Remember that all emotions provide valuable information and are part of the human experience. What support might help you navigate these feelings?";
    } else {
      return "Your entry reflects significant distress. Thank you for being vulnerable and honest about these difficult emotions. During challenging times, it's especially important to be compassionate with yourself. Have you considered reaching out to a supportive person in your life or a mental health professional?";
    }
  }
  
  /**
   * Generate related resources based on journal content
   */
  function generateRelatedResources(entryContent, sentimentScore) {
    const resources = [];
    
    // Check for specific topics in the journal entry
    const lowerEntry = entryContent.toLowerCase();
    
    if (lowerEntry.includes('work') || lowerEntry.includes('job') || lowerEntry.includes('career')) {
      resources.push({
        title: "Work-Life Balance Strategies",
        link: "#"
      });
    }
    
    if (lowerEntry.includes('sleep') || lowerEntry.includes('tired') || lowerEntry.includes('insomnia')) {
      resources.push({
        title: "Improving Sleep Quality",
        link: "#"
      });
    }
    
    if (lowerEntry.includes('meditat') || lowerEntry.includes('mindful')) {
      resources.push({
        title: "Mindfulness Meditation Guide",
        link: "#"
      });
    }
    
    if (lowerEntry.includes('stress') || lowerEntry.includes('overwhelm')) {
      resources.push({
        title: "Stress Management Techniques",
        link: "#"
      });
    }
    
    if (lowerEntry.includes('anxi')) {
      resources.push({
        title: "Understanding and Managing Anxiety",
        link: "#"
      });
    }
    
    if (lowerEntry.includes('depress') || lowerEntry.includes('sad') || lowerEntry.includes('low mood')) {
      resources.push({
        title: "Coping with Depression",
        link: "#"
      });
    }
    
    // Add general resources based on sentiment
    if (sentimentScore < 0.3) {
      resources.push({
        title: "Self-Care During Difficult Times",
        link: "#"
      });
    }
    
    // Limit to 2 resources
    return resources.slice(0, 2);
  }
  
  /**
   * Save journal entry with AI analysis
   */
  function saveJournalEntryWithAnalysis(content, analysis) {
    // Get form values
    const titleInput = document.getElementById('entry-title');
    
    if (!titleInput || !content) {
      window.NungoApp.showNotification('Please enter a title and content for your journal entry', 'error');
      return;
    }
    
    const title = titleInput.value;
    
    // Create entry data
    const entryData = {
      title: title,
      content: content,
      sentiment: analysis ? analysis.sentiment : null,
      ai_feedback: analysis ? analysis.feedback : null,
      resources: analysis ? analysis.resources : []
    };
    
    // Show loading state
    const saveButton = document.getElementById('save-entry-button');
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    }
    
    // Save entry using the app's journal saving function
    window.NungoApp.saveJournalEntry(entryData)
      .then(response => {
        // Close modal
        const entryModal = document.getElementById('new-entry-modal');
        if (entryModal) {
          window.NungoApp.closeModal(entryModal);
        }
        
        // Show success notification
        window.NungoApp.showNotification('Journal entry saved successfully', 'success');
        
        // Reload journal entries (if we're on the journal page)
        if (typeof loadJournalEntries === 'function') {
          loadJournalEntries();
        }
      })
      .catch(error => {
        console.error('Error saving journal entry:', error);
        window.NungoApp.showNotification('Error saving journal entry', 'error');
      })
      .finally(() => {
        // Reset button
        if (saveButton) {
          saveButton.disabled = false;
          saveButton.innerHTML = 'Save Entry';
        }
      });
  }
  
  // Export functions for use in other modules
  window.NungoAzure = {
    // Chat functions
    getAIResponse,
    
    // Journal functions
    analyzeJournalEntry,
    
    // Azure service wrappers (for production use)
    services: {
      /**
       * Azure OpenAI wrapper function
       * For hackathon demo, this is a stub - in production, this would make actual API calls
       */
      async callAzureOpenAI(prompt, options = {}) {
        // In production, this would make a real API call to Azure OpenAI
        console.log(`[Azure OpenAI] Prompt: ${prompt}`);
        return "This is a simulated response from Azure OpenAI for demo purposes.";
      },
      
      /**
       * Azure Cognitive Services wrapper function
       * For hackathon demo, this is a stub - in production, this would make actual API calls
       */
      async analyzeSentiment(text) {
        // In production, this would make a real API call to Azure Cognitive Services
        console.log(`[Azure Cognitive Services] Analyzing sentiment for: ${text.substring(0, 50)}...`);
        return {
          sentiment: calculateSimulatedSentiment(text),
          keyPhrases: [],
          entities: []
        };
      },
      
      /**
       * Azure Health Bot wrapper function
       * For hackathon demo, this is a stub - in production, this would make actual API calls
       */
      async getHealthBotResponse(userId, message) {
        // In production, this would make a real API call to Azure Health Bot
        console.log(`[Azure Health Bot] Message for user ${userId}: ${message}`);
        return "This is a simulated response from Azure Health Bot for demo purposes.";
      }
    }
  };