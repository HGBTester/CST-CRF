import React, { useState } from 'react';
import { Sparkles, Send, Loader, Save, X, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

function AIEditor({ 
  isOpen, 
  onClose, 
  currentContent, 
  onSave, 
  controlInfo,
  onModify 
}) {
  const [instructions, setInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleModify = async () => {
    if (!instructions.trim()) {
      setError('Please enter instructions for the AI');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const result = await onModify(currentContent, instructions, controlInfo);
      
      if (result.success) {
        setPreviewContent(result.content);
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to process AI request: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (previewContent) {
      onSave(previewContent);
      setSuccess('Template saved successfully! This template will be used for new documents.');
      setTimeout(() => {
        onClose();
        setPreviewContent(null);
        setInstructions('');
        setSuccess('');
      }, 2000);
    }
  };

  const handleReset = () => {
    setPreviewContent(null);
    setInstructions('');
    setError('');
    setSuccess('');
  };

  const quickPrompts = [
    "Make it more concise and brief",
    "Add more detailed explanations and examples",
    "Make the tone more formal and professional",
    "Change the date to 2025",
    "Add specific Saudi Arabian regulatory references",
    "Include step-by-step implementation guidelines",
    "Simplify the language for easier understanding",
    "Update version to 2.0"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Document Editor</h2>
                <p className="text-sm text-purple-100">Modify document content with AI assistance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Control Info */}
          <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-3">
            <p className="text-sm font-medium">{controlInfo.id} - {controlInfo.name}</p>
            <p className="text-xs text-purple-100 mt-1">{controlInfo.category}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Instructions Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What would you like to change?
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Example: Make this document more concise and add specific examples for Saudi Arabian companies..."
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
              disabled={isProcessing}
            />
          </div>

          {/* Quick Prompts */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quick Prompts:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInstructions(prompt)}
                  className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                  disabled={isProcessing}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={20} />
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />
                <p className="font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewContent && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Preview (Modified Content):
                </label>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>
              <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50 max-h-96 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>✨ Full Access:</strong> The AI can modify ANY part of the document including titles, dates, 
              versions, content sections, and metadata. Only signature/approval sections are protected. 
              Click "Save Template" to use this modified version for all future documents of this control.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50 rounded-b-2xl">
          <div className="text-sm text-gray-600">
            {isProcessing && (
              <div className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                <span>AI is processing your request...</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            
            {!previewContent ? (
              <button
                onClick={handleModify}
                disabled={isProcessing || !instructions.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Modify with AI</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <Save size={18} />
                <span>Save Template</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIEditor;
