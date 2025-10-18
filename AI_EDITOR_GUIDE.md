# AI Editor Feature - Complete Guide

## ✨ Overview

The **AI Editor** is a powerful new feature that allows you to customize document templates using artificial intelligence. You can modify the content of any control document while preserving the signature sections, and save it as a custom template for future use.

---

## 🎯 Key Features

### 1. **AI-Powered Content Modification**
- Describe changes in natural language
- AI modifies only the content sections
- Signature sections remain untouched
- Preserves document structure and formatting

### 2. **Template Saving**
- Save AI-modified content as custom template
- Custom templates are used for all future document generations
- Each control can have its own custom template
- Templates persist across document instances

### 3. **Visual Indicators**
- **Purple sparkle icon** (✨) appears next to controls with custom templates
- Easy identification in tree view
- Know at a glance which templates have been customized

### 4. **Quick Prompts**
- Pre-defined common modifications
- One-click application
- Saves time on frequent changes

---

## 🚀 How to Use

### Step 1: Open a Document
1. Navigate to any control in the tree view
2. Click on the control to view its document
3. The document will display with default content

### Step 2: Open AI Editor
1. Click the **"AI Edit"** button in the top bar (purple gradient button with sparkles icon)
2. The AI Editor modal opens with:
   - Control information (ID, name, category)
   - Text area for instructions
   - Quick prompt buttons
   - Preview area

### Step 3: Provide Instructions
**Option A: Type Custom Instructions**
```
Example: "Make this document more concise and add specific examples 
for Saudi Arabian financial institutions"
```

**Option B: Use Quick Prompts**
- Click any quick prompt button
- Predefined prompts include:
  - "Make it more concise and brief"
  - "Add more detailed explanations and examples"
  - "Make the tone more formal and professional"
  - "Simplify the language for easier understanding"
  - "Add specific Saudi Arabian regulatory references"
  - "Include step-by-step implementation guidelines"

### Step 4: Modify with AI
1. Click the **"Modify with AI"** button
2. Wait for AI processing (2-3 seconds in simulation mode)
3. Preview the modified content
4. Review the changes in the preview area

### Step 5: Save Template
1. If satisfied with the changes, click **"Save Template"**
2. The template is saved for this specific control
3. A purple sparkle icon (✨) appears next to the control in the tree view
4. All future documents for this control will use the custom template

### Step 6: Reset (Optional)
- Click **"Reset"** to discard changes and start over
- Click **"Cancel"** to close without saving

---

## 🎨 AI Editor Interface

### Layout
```
┌─────────────────────────────────────────────────────┐
│  ✨ AI Document Editor                       [X]   │
│  Modify document content with AI assistance         │
│  ─────────────────────────────────────────────────  │
│  📄 1.1.1 - Define Cybersecurity Strategy          │
│  Governance                                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  What would you like to change?                     │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │  [Your instructions here...]                   │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Quick Prompts:                                      │
│  [Make it concise]  [Add detail]  [Make formal]     │
│  [Simplify]  [Add Saudi references]  [Add steps]    │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Preview (Modified Content):         [Reset]   │ │
│  │  ─────────────────────────────────────────────  │ │
│  │  [Preview of modified content appears here]    │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ℹ️ Note: AI only modifies content sections.        │
│     Signatures remain unchanged.                    │
│                                                      │
├─────────────────────────────────────────────────────┤
│         [Cancel]           [Modify with AI] 🚀      │
│                      or    [Save Template] 💾       │
└─────────────────────────────────────────────────────┘
```

---

## 💡 Use Cases

### 1. **Industry-Specific Content**
**Before**: Generic document suitable for all industries
**Instruction**: "Customize this for a banking institution with references to SAMA regulations"
**After**: Document tailored for Saudi banking sector

### 2. **Simplification for Non-Technical Staff**
**Before**: Technical cybersecurity document
**Instruction**: "Simplify the technical language for non-technical managers"
**After**: Easy-to-understand document for executives

### 3. **Adding Detailed Examples**
**Before**: High-level overview
**Instruction**: "Add specific examples and step-by-step procedures for implementation"
**After**: Detailed implementation guide

### 4. **Compliance Focus**
**Before**: General control description
**Instruction**: "Add specific NCA-ECC references and CST-CRF compliance requirements"
**After**: Compliance-focused document with regulatory citations

### 5. **Size Optimization**
**Before**: Very long detailed document
**Instruction**: "Make this more concise while keeping all key points"
**After**: Streamlined document, easier to read

---

## 🔧 Technical Details

### AI Service Configuration

**Current Mode**: Simulation (for demo/testing)
- No API key required
- Instant processing
- Basic text transformations
- Adds notification banner to modified content

**Production Mode**: Real AI Integration
- Requires OpenAI API key
- Configure in `src/utils/aiService.js`
- Set `USE_SIMULATION = false`
- Add API key: `const API_KEY = 'your-api-key-here'`

### Supported AI Models
1. **OpenAI GPT-4** (recommended for quality)
2. **OpenAI GPT-3.5-turbo** (faster, cheaper)
3. **Compatible APIs**: Any OpenAI-compatible API

### Alternative AI Services
The system can be adapted for:
- **Azure OpenAI**
- **Anthropic Claude**
- **Google PaLM**
- **Local Models** (Ollama, LLaMA, etc.)

---

## 📊 Template Management

### How Templates Are Stored
```javascript
{
  "1.1.1": {
    content: "<div>Modified content...</div>",
    modifiedAt: "2025-10-18T22:00:00.000Z",
    version: 1
  },
  "1.1.2": {
    content: "<div>Another modified content...</div>",
    modifiedAt: "2025-10-18T22:05:00.000Z",
    version: 1
  }
}
```

### Template Lifecycle
1. **Creation**: User modifies document with AI, clicks Save
2. **Usage**: All new document instances use custom template
3. **Update**: Modify again to create new version (version number increments)
4. **Deletion**: Reset to default template (future feature)

### Template Scope
- **Per Control**: Each control has its own template
- **Reusable**: Used for all document instances of that control
- **Persistent**: Stored in browser memory (Stage 3 will add database)

---

## 🎨 Visual Indicators

### In Tree View
```
📄 1.1.1 Define Cybersecurity Strategy         [+]  (Default)
📄 1.1.2 Top Management Approval ✨             [+]  (Custom Template)
📄 1.1.3 Action Plan Implementation            [+]  (Default)
```

### Color Coding
- **Gray** = Default template
- **Green** = Has generated documents
- **Purple sparkle** = Has custom AI-modified template
- Combinations:
  - Gray + No sparkle = Default, no documents
  - Green + No sparkle = Has documents, default template
  - Green + Purple sparkle = Has documents, custom template

---

## 🔐 Safety Features

### Content Protection
- ✅ **Signature sections protected** - Never modified
- ✅ **Document structure preserved** - HTML intact
- ✅ **Metadata unchanged** - Control ID, dates, etc.
- ✅ **Preview before save** - Review changes first
- ✅ **Reset option** - Discard unwanted changes

### AI Guardrails
- System prompt ensures AI follows rules
- Only content sections are extracted for modification
- Signature sections are never sent to AI
- Modified content is re-attached to signature sections

---

## 📝 Best Practices

### Writing Good Instructions

**✅ DO:**
- Be specific: "Add examples from Saudi banking sector"
- Focus on content: "Make the requirements section more detailed"
- Use clear language: "Simplify technical terms"
- Request additions: "Add a section about mobile device management"

**❌ DON'T:**
- Be vague: "Make it better"
- Request signature changes: "Change the CEO signature"
- Break structure: "Remove all tables"
- Ask for unrelated content: "Add marketing information"

### Testing Modified Content

After modification:
1. **Review preview carefully**
2. **Check for accuracy** - Ensure technical correctness
3. **Verify compliance** - Confirm regulatory alignment
4. **Test formatting** - Ensure HTML renders properly
5. **Generate test document** - Create instance to verify

---

## 🔄 Workflow Example

### Complete Modification Process

**Scenario**: Customize "Access Control" document for healthcare sector

1. **Navigate**: Go to "4.7 Identity and Access Management" → "4.7.1 Access Control Policy"

2. **Open AI Editor**: Click "AI Edit" button

3. **Enter Instructions**:
   ```
   Customize this document for a healthcare provider. Add specific 
   references to HIPAA requirements and patient data access controls. 
   Include examples of role-based access for doctors, nurses, and 
   administrative staff.
   ```

4. **Modify**: Click "Modify with AI", wait for processing

5. **Review**: Check preview for:
   - Healthcare-specific content
   - HIPAA references
   - Role examples (doctor, nurse, admin)
   - Proper formatting

6. **Save**: Click "Save Template"

7. **Verify**: 
   - Purple sparkle appears next to control
   - Generate new document
   - Confirm custom content is used

8. **Iterate**: If needed, modify again for refinement

---

## 🚀 Advanced Features (Coming in Stage 3)

### Planned Enhancements

1. **Template Version History**
   - See all versions of a template
   - Rollback to previous versions
   - Compare versions side-by-side

2. **Template Sharing**
   - Export templates
   - Import templates from other users
   - Company-wide template library

3. **Batch Modifications**
   - Apply same modification to multiple controls
   - Category-wide updates
   - Bulk template management

4. **AI Suggestions**
   - AI proposes improvements
   - Compliance gap analysis
   - Automatic regulatory updates

5. **Collaboration**
   - Multiple users can modify templates
   - Approval workflow for template changes
   - Comments and feedback system

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: AI Edit button is grayed out
- **Cause**: No document selected
- **Solution**: Select a control from tree view first

**Issue**: Modification fails
- **Cause**: Network error (production mode) or invalid instructions
- **Solution**: Check internet connection, retry with clearer instructions

**Issue**: Preview shows no changes
- **Cause**: Instructions too vague or simulation limitations
- **Solution**: Be more specific in instructions

**Issue**: Sparkle icon doesn't appear
- **Cause**: Template not saved properly
- **Solution**: Click Save Template button, refresh page

**Issue**: Custom template not used
- **Cause**: Cache issue or incorrect control
- **Solution**: Refresh page, verify sparkle icon exists

---

## 📊 Comparison: Before vs After AI Editor

### Before AI Editor
```
❌ Static templates only
❌ Manual HTML editing required
❌ No customization capability
❌ One-size-fits-all documents
❌ Difficult to industry-specific content
```

### After AI Editor
```
✅ AI-powered customization
✅ Natural language instructions
✅ Industry-specific templates
✅ Company-specific branding
✅ Regulatory compliance focus
✅ Easy content refinement
```

---

## 💾 Data Management

### Current Stage (Browser Memory)
- Templates stored in JavaScript object
- Lost on page refresh
- No persistence across sessions
- Suitable for testing and evaluation

### Stage 3 (Database)
- PostgreSQL/MySQL backend
- Persistent storage
- User-specific templates
- Backup and restore
- Template audit trail

---

## 📚 Additional Resources

### Files Created
- `src/components/AIEditor.jsx` - AI Editor UI component
- `src/data/customTemplates.js` - Template storage system
- `src/utils/aiService.js` - AI integration service
- `AI_EDITOR_GUIDE.md` - This guide

### Related Documentation
- `STAGE2_FEATURES.md` - Stage 2 overview
- `QUICK_REFERENCE.md` - Quick user guide
- `README.md` - Full project documentation

---

## ✅ Summary

The AI Editor feature transforms the CST-CRF Audit System from a static template generator into a dynamic, customizable documentation platform. Key benefits:

1. **Flexibility**: Customize any document to your needs
2. **Ease of Use**: Natural language instructions
3. **Safety**: Signatures always protected
4. **Efficiency**: Save templates for reuse
5. **Quality**: AI ensures professional content
6. **Scalability**: Works for all 200+ controls

**Ready to customize your audit documents with AI!** 🚀✨
