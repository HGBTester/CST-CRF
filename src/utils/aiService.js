// AI Service for document editing
// This uses OpenAI API structure - you can replace with any AI service

const API_KEY = ''; // Add your OpenAI API key here or use environment variable
const API_URL = 'https://api.openai.com/v1/chat/completions';

// For demo purposes, we'll simulate AI responses
// In production, replace simulateAI with actual callOpenAI
const USE_SIMULATION = true; // Set to false when you add real API key

export const editDocumentWithAI = async (documentContent, userInstructions, controlInfo) => {
  if (USE_SIMULATION) {
    return simulateAI(documentContent, userInstructions, controlInfo);
  } else {
    return callOpenAI(documentContent, userInstructions, controlInfo);
  }
};

// Simulation for demo/testing
const simulateAI = async (documentContent, userInstructions, controlInfo) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple text transformation based on common instructions
  let modifiedContent = documentContent;
  
  const lowerInstructions = userInstructions.toLowerCase();
  
  // Date modifications
  if (lowerInstructions.includes('date') || lowerInstructions.includes('2024') || lowerInstructions.includes('2025')) {
    const dateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/g;
    const newDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    modifiedContent = modifiedContent.replace(dateRegex, newDate);
    
    // Also handle date spans in content
    if (lowerInstructions.match(/\d{4}/)) {
      const yearMatch = lowerInstructions.match(/\d{4}/);
      if (yearMatch) {
        modifiedContent = modifiedContent.replace(/\d{4}/g, yearMatch[0]);
      }
    }
  }
  
  // Title/Header modifications
  if (lowerInstructions.includes('title') || lowerInstructions.includes('heading') || lowerInstructions.includes('header')) {
    const titleMatch = userInstructions.match(/["']([^"']+)["']/);
    if (titleMatch) {
      modifiedContent = modifiedContent.replace(
        /<h3 class="text-xl text-gray-700">(.*?)<\/h3>/,
        `<h3 class="text-xl text-gray-700">${titleMatch[1]}</h3>`
      );
    }
  }
  
  // Content length modifications
  if (lowerInstructions.includes('shorter') || lowerInstructions.includes('concise') || lowerInstructions.includes('brief')) {
    modifiedContent = modifiedContent.replace(/<p>(.*?)<\/p>/g, (match, p1) => {
      if (p1.length > 100) {
        return `<p>${p1.substring(0, 100)}...</p>`;
      }
      return match;
    });
  }
  
  if (lowerInstructions.includes('detailed') || lowerInstructions.includes('expand') || lowerInstructions.includes('elaborate')) {
    modifiedContent = modifiedContent.replace(
      'This section outlines',
      'This comprehensive section provides detailed information and outlines'
    );
    modifiedContent = modifiedContent.replace(
      'This document',
      'This comprehensive document'
    );
  }
  
  // Tone modifications
  if (lowerInstructions.includes('formal') || lowerInstructions.includes('professional')) {
    modifiedContent = modifiedContent.replace(/\bwe\b/gi, 'the organization')
      .replace(/\bour\b/gi, 'the organization\'s');
  }
  
  // Add specific content
  if (lowerInstructions.includes('saudi') || lowerInstructions.includes('sama') || lowerInstructions.includes('nca')) {
    modifiedContent = modifiedContent.replace(
      '</div>',
      '<div class="mt-4"><h4><strong>Saudi Arabian Regulatory Context:</strong></h4><p>This control aligns with SAMA Cybersecurity Framework and NCA-ECC requirements for organizations operating in the Kingdom of Saudi Arabia.</p></div></div>',
      1
    );
  }
  
  // Version number changes
  if (lowerInstructions.includes('version')) {
    const versionMatch = userInstructions.match(/version\s+(\d+\.?\d*)/i);
    if (versionMatch) {
      modifiedContent = modifiedContent.replace(
        /Version:\s*\d+\.?\d*/g,
        `Version: ${versionMatch[1]}`
      );
    }
  }
  
  // Add a note that AI modified the content
  modifiedContent = `<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
    <p class="text-sm text-blue-800"><strong>✨ AI Modified:</strong> ${userInstructions}</p>
    <p class="text-xs text-blue-600 mt-1">Modified on ${new Date().toLocaleString()}</p>
  </div>\n\n` + modifiedContent;
  
  return {
    success: true,
    content: modifiedContent,
    message: 'Document modified successfully (Simulated AI)'
  };
};

// Real OpenAI API call
const callOpenAI = async (documentContent, userInstructions, controlInfo) => {
  if (!API_KEY) {
    throw new Error('OpenAI API key not configured. Please add your API key in src/utils/aiService.js');
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // or 'gpt-3.5-turbo' for faster/cheaper
        messages: [
          {
            role: 'system',
            content: `You are a professional cybersecurity documentation expert. You help modify CST-CRF audit documents for Saudi Arabian companies. 

You have FULL ACCESS to modify any part of the document content including:
- Headers and titles
- Dates and version numbers
- Document metadata
- Purpose, scope, requirements sections
- All content areas

The ONLY sections you should NEVER modify are:
- Signature sections (anything within signature-box divs)
- Document approval sections
- Stamp areas

Rules:
1. Modify ANY content the user requests (titles, dates, metadata, sections, etc.)
2. NEVER modify signature or approval sections
3. Keep HTML formatting intact and valid
4. Follow user instructions exactly
5. Maintain professional tone unless asked otherwise
6. Ensure compliance with CST-CRF requirements
7. Return ONLY the modified HTML content, no explanations
8. If user asks to change dates, change ALL occurrences of dates
9. If user asks to change version, update version numbers
10. Make changes exactly as requested`
          },
          {
            role: 'user',
            content: `Control: ${controlInfo.id} - ${controlInfo.name}
Category: ${controlInfo.category}

Current Document Content:
${documentContent}

User Instructions:
${userInstructions}

Please modify the document content according to the user's instructions while maintaining all HTML structure and not touching any signature sections.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const modifiedContent = data.choices[0].message.content;
    
    return {
      success: true,
      content: modifiedContent,
      message: 'Document modified successfully with AI'
    };
    
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      success: false,
      content: documentContent,
      message: `Error: ${error.message}`
    };
  }
};

// Alternative: Use local AI or other services
export const configureAIService = (apiKey, apiUrl = API_URL) => {
  // Allow runtime configuration
  // This can be extended to support other AI services like:
  // - Azure OpenAI
  // - Anthropic Claude
  // - Google PaLM
  // - Local models (Ollama, etc.)
};
