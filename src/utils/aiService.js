// AI Service for document editing
// Supports: OpenAI, Anthropic Claude, Google Gemini, and intelligent simulation

// ===== CONFIGURATION =====
// Set your API keys here or in environment variables
const AI_CONFIG = {
  // Preferred provider: 'openai', 'anthropic', 'google', 'simulation'
  provider: 'simulation', // Change to 'openai' when you add API key
  
  openai: {
    apiKey: '', // Add your OpenAI API key
    model: 'gpt-4o', // or 'gpt-4-turbo', 'gpt-3.5-turbo'
    apiUrl: 'https://api.openai.com/v1/chat/completions'
  },
  
  anthropic: {
    apiKey: '', // Add your Anthropic API key
    model: 'claude-3-5-sonnet-20241022', // or 'claude-3-opus-20240229'
    apiUrl: 'https://api.anthropic.com/v1/messages'
  },
  
  google: {
    apiKey: '', // Add your Google AI API key
    model: 'gemini-pro',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models'
  }
};

// Auto-detect available AI provider
const detectProvider = () => {
  if (AI_CONFIG.openai.apiKey) return 'openai';
  if (AI_CONFIG.anthropic.apiKey) return 'anthropic';
  if (AI_CONFIG.google.apiKey) return 'google';
  return 'simulation';
};

export const editDocumentWithAI = async (documentContent, userInstructions, controlInfo) => {
  const provider = AI_CONFIG.provider === 'simulation' ? detectProvider() : AI_CONFIG.provider;
  
  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(documentContent, userInstructions, controlInfo);
      case 'anthropic':
        return await callAnthropic(documentContent, userInstructions, controlInfo);
      case 'google':
        return await callGoogle(documentContent, userInstructions, controlInfo);
      default:
        return await intelligentSimulation(documentContent, userInstructions, controlInfo);
    }
  } catch (error) {
    console.error('AI Service Error:', error);
    // Fallback to intelligent simulation if real AI fails
    return await intelligentSimulation(documentContent, userInstructions, controlInfo);
  }
};

// Intelligent simulation with pattern matching and content manipulation
const intelligentSimulation = async (documentContent, userInstructions, controlInfo) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let modifiedContent = documentContent;
  const lowerInstructions = userInstructions.toLowerCase();
  const modifications = [];
  
  // ========== REMOVAL OPERATIONS ==========
  
  // Remove budget/pricing/cost information
  if (lowerInstructions.match(/remove|delete|don't.*mention|exclude|take out.*budget|price|pricing|cost|\$|money|financial/)) {
    // Remove budget tables
    modifiedContent = modifiedContent.replace(/<h[34][^>]*>.*?budget.*?<\/h[34]>[\s\S]*?<\/table>/gi, '');
    // Remove budget sections
    modifiedContent = modifiedContent.replace(/<h[234][^>]*>.*?(?:budget|cost|pricing|resource allocation).*?<\/h[234]>[\s\S]*?(?=<h[234]|<div class="mt-12">|$)/gi, '');
    // Remove dollar amounts
    modifiedContent = modifiedContent.replace(/\$[\d,]+(?:\.\d{2})?(?:\/year)?/g, '[Amount Removed]');
    // Remove pricing-related list items
    modifiedContent = modifiedContent.replace(/<li>.*?(?:budget|cost|\$|pricing).*?<\/li>/gi, '');
    modifications.push('Removed all budget and pricing information');
  }
  
  // Remove tables
  if (lowerInstructions.match(/remove|delete.*table/)) {
    modifiedContent = modifiedContent.replace(/<table[\s\S]*?<\/table>/g, '');
    modifications.push('Removed tables');
  }
  
  // Remove specific sections by number or name
  const sectionMatch = lowerInstructions.match(/remove|delete.*section\s+(\d+|\w+)/i);
  if (sectionMatch) {
    const sectionId = sectionMatch[1];
    modifiedContent = modifiedContent.replace(
      new RegExp(`<h2>${sectionId}\..*?<\/h2>[\\s\\S]*?(?=<h2|<div class="mt-12">|$)`, 'i'),
      ''
    );
    modifications.push(`Removed section ${sectionId}`);
  }
  
  // ========== ADDITION OPERATIONS ==========
  
  // Add Saudi/regulatory context
  if (lowerInstructions.match(/add|include.*saudi|nca|pdpl|citc|regulatory|compliance/)) {
    const regulatorySection = `
      <h3>Saudi Arabian Regulatory Context</h3>
      <p>This control aligns with the following Saudi Arabian regulations:</p>
      <ul>
        <li><strong>CST-CRF:</strong> Communications and Information Technology Commission Cybersecurity Regulatory Framework</li>
        <li><strong>NCA ECC-1:2018:</strong> National Cybersecurity Authority Essential Cybersecurity Controls</li>
        <li><strong>PDPL:</strong> Personal Data Protection Law (effective March 2023)</li>
        <li><strong>CITC:</strong> Telecommunications and IT sector requirements</li>
      </ul>
    `;
    modifiedContent = modifiedContent.replace('</div>', regulatorySection + '</div>', 1);
    modifications.push('Added Saudi regulatory context');
  }
  
  // ========== MODIFICATION OPERATIONS ==========
  
  // Date changes
  if (lowerInstructions.match(/change|update|set.*date|\d{4}/)) {
    const yearMatch = userInstructions.match(/(20\d{2})/);
    if (yearMatch) {
      modifiedContent = modifiedContent.replace(/20\d{2}/g, yearMatch[1]);
      modifications.push(`Updated years to ${yearMatch[1]}`);
    }
    const monthYear = userInstructions.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
    if (monthYear) {
      modifiedContent = modifiedContent.replace(
        /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/g,
        `${monthYear[1]} 1, ${monthYear[2]}`
      );
      modifications.push(`Updated dates to ${monthYear[1]} ${monthYear[2]}`);
    }
  }
  
  // Version changes
  if (lowerInstructions.match(/version|ver\./)) {
    const versionMatch = userInstructions.match(/version\s+(\d+\.\d+)/i) || userInstructions.match(/(\d+\.\d+)/);
    if (versionMatch) {
      modifiedContent = modifiedContent.replace(/Version:\s*\d+\.\d+/gi, `Version: ${versionMatch[1]}`);
      modifiedContent = modifiedContent.replace(/<td>\d+\.\d+<\/td>/, `<td>${versionMatch[1]}</td>`);
      modifications.push(`Updated version to ${versionMatch[1]}`);
    }
  }
  
  // Make content shorter/concise
  if (lowerInstructions.match(/shorter|concise|brief|reduce|trim/)) {
    modifiedContent = modifiedContent.replace(/<p>([^<]{150,}?)<\/p>/g, (match, content) => {
      const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
      return `<p>${sentences.slice(0, 2).join(' ')}</p>`;
    });
    modifiedContent = modifiedContent.replace(/<li>([^<]{100,}?)<\/li>/g, (match, content) => {
      const firstSentence = content.match(/^[^.!?]+[.!?]/);
      return `<li>${firstSentence ? firstSentence[0] : content.substring(0, 80) + '...'}</li>`;
    });
    modifications.push('Made content more concise');
  }
  
  // Make content more detailed
  if (lowerInstructions.match(/detailed|elaborate|expand|comprehensive|more info/)) {
    modifiedContent = modifiedContent.replace(
      /This document outlines/g,
      'This comprehensive document provides detailed information and outlines'
    );
    modifiedContent = modifiedContent.replace(
      /requirements/g,
      'specific detailed requirements'
    );
    modifications.push('Added more detail to content');
  }
  
  // Formal tone
  if (lowerInstructions.match(/formal|professional|business/)) {
    modifiedContent = modifiedContent.replace(/\bwe\b/gi, 'the organization');
    modifiedContent = modifiedContent.replace(/\bour\b/gi, "the organization's");
    modifiedContent = modifiedContent.replace(/\byou\b/gi, 'personnel');
    modifications.push('Changed tone to formal/professional');
  }
  
  // Casual tone
  if (lowerInstructions.match(/casual|simple|easy|plain/)) {
    modifiedContent = modifiedContent.replace(/the organization/gi, 'we');
    modifiedContent = modifiedContent.replace(/personnel/gi, 'you');
    modifiedContent = modifiedContent.replace(/shall/gi, 'should');
    modifications.push('Changed tone to casual/simple');
  }
  
  // ========== TEXT REPLACEMENT ==========
  
  // Replace specific text
  const replaceMatch = userInstructions.match(/replace\s+["']([^"']+)["']\s+with\s+["']([^"']+)["']/i);
  if (replaceMatch) {
    const [, oldText, newText] = replaceMatch;
    modifiedContent = modifiedContent.replace(new RegExp(oldText, 'gi'), newText);
    modifications.push(`Replaced "${oldText}" with "${newText}"`);
  }
  
  // Add modification note
  if (modifications.length > 0) {
    const note = `<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <p class="text-sm text-blue-800"><strong>✨ AI Modified (Simulation):</strong> ${userInstructions}</p>
      <p class="text-xs text-blue-600 mt-1">Changes: ${modifications.join(', ')}</p>
      <p class="text-xs text-blue-600">Modified on ${new Date().toLocaleString()}</p>
      <p class="text-xs text-orange-600 mt-2">💡 For better AI editing, add OpenAI/Anthropic API key in src/utils/aiService.js</p>
    </div>\n\n`;
    modifiedContent = note + modifiedContent;
  }
  
  return {
    success: true,
    content: modifiedContent,
    message: modifications.length > 0 
      ? `Applied ${modifications.length} modification(s)` 
      : 'No matching modifications found. Try: "remove budget sections" or "add more details"'
  };
};

// ========== REAL AI PROVIDERS ==========

// OpenAI (GPT-4, GPT-3.5) Implementation
const callOpenAI = async (documentContent, userInstructions, controlInfo) => {
  const config = AI_CONFIG.openai;
  if (!config.apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
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

// Anthropic Claude Implementation
const callAnthropic = async (documentContent, userInstructions, controlInfo) => {
  const config = AI_CONFIG.anthropic;
  if (!config.apiKey) {
    throw new Error('Anthropic API key not configured');
  }
  
  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are a professional cybersecurity documentation expert for CST-CRF compliance.

Control: ${controlInfo.id} - ${controlInfo.name}
Category: ${controlInfo.category}

Current Document (HTML):
${documentContent}

User Instructions:
${userInstructions}

IMPORTANT RULES:
- Modify ANY content the user requests (remove budget, change dates, add sections, etc.)
- NEVER modify <div class="signature-box"> or approval sections
- Keep all HTML formatting valid
- Follow instructions EXACTLY
- Return ONLY the modified HTML, no explanations

Modified Document:`
        }]
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || response.status}`);
    }
    
    const data = await response.json();
    const modifiedContent = data.content[0].text;
    
    return {
      success: true,
      content: modifiedContent,
      message: 'Document modified with Claude AI'
    };
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw error;
  }
};

// Google Gemini Implementation  
const callGoogle = async (documentContent, userInstructions, controlInfo) => {
  const config = AI_CONFIG.google;
  if (!config.apiKey) {
    throw new Error('Google AI API key not configured');
  }
  
  try {
    const response = await fetch(
      `${config.apiUrl}/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional cybersecurity documentation expert for CST-CRF compliance.

Control: ${controlInfo.id} - ${controlInfo.name}

Document HTML:
${documentContent}

User Instructions:
${userInstructions}

Rules:
- Modify ANY content requested (remove budgets, change dates, etc.)
- NEVER modify signature sections
- Keep HTML valid
- Return ONLY modified HTML

Modified Document:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }
    
    const data = await response.json();
    const modifiedContent = data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      content: modifiedContent,
      message: 'Document modified with Gemini AI'
    };
  } catch (error) {
    console.error('Google AI Error:', error);
    throw error;
  }
};

// Configure AI service at runtime
export const configureAIService = (provider, apiKey) => {
  if (provider && AI_CONFIG[provider]) {
    AI_CONFIG.provider = provider;
    if (apiKey) {
      AI_CONFIG[provider].apiKey = apiKey;
    }
  }
};
