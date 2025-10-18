import React from 'react';
import { Check, Clock, AlertCircle, X } from 'lucide-react';
import { placeholderSignature, placeholderStamp } from '../data/users';

function DocumentViewer({ document, docInstance, onSign, onRevokeSignature, currentUser, baseContent }) {
  if (!document) return null;

  const canSign = (role) => {
    if (!currentUser || !docInstance) return false;
    
    // Check if already signed by someone
    if (docInstance.signatures[role]) return false;
    
    // Check if user has permission to sign this role
    if (role === 'prepared' && currentUser.permissions.includes('sign_as_prepared')) {
      return true;
    }
    if (role === 'reviewed' && currentUser.permissions.includes('sign_as_reviewed')) {
      // Can only review if already prepared
      return docInstance.signatures.prepared !== null;
    }
    if (role === 'approved' && currentUser.permissions.includes('sign_as_approved')) {
      // Can only approve if already prepared and reviewed
      return docInstance.signatures.prepared !== null && docInstance.signatures.reviewed !== null;
    }
    
    return false;
  };

  const renderSignatureSection = (role, label) => {
    const signature = docInstance?.signatures[role];
    const canSignThis = canSign(role);

    return (
      <div className={`signature-box ${signature ? 'border-green-500 bg-green-50' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{label}</h3>
          {signature && (
            <div className="flex items-center gap-2 text-green-600">
              <Check size={20} />
              <span className="text-sm font-medium">Signed</span>
            </div>
          )}
          {!signature && docInstance && (
            <div className="flex items-center gap-2 text-orange-600">
              <Clock size={20} />
              <span className="text-sm font-medium">Pending</span>
            </div>
          )}
        </div>

        {signature ? (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p><strong>Name:</strong> {signature.userName}</p>
              </div>
              {currentUser && (
                <button
                  onClick={() => onRevokeSignature(role)}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                  title="Revoke this signature"
                >
                  <X size={12} />
                  Revoke
                </button>
              )}
            </div>
            <p className="mt-3"><strong>Position:</strong> {signature.position}</p>
            <div className="mt-3">
              <p className="mb-2"><strong>Signature:</strong></p>
              <img 
                src={placeholderSignature} 
                alt="Signature" 
                className="h-16 border-b-2 border-gray-400"
              />
            </div>
            <p className="mt-3"><strong>Date:</strong> {new Date(signature.signedAt).toLocaleString()}</p>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> <span className="border-b-2 border-gray-400 inline-block w-64 ml-2"></span></p>
            <p className="mt-3"><strong>Position:</strong> {role === 'prepared' ? 'Cybersecurity Manager' : role === 'reviewed' ? 'Chief Information Security Officer' : 'Chief Executive Officer'}</p>
            <p className="mt-3"><strong>Signature:</strong> <span className="border-b-2 border-gray-400 inline-block w-64 ml-2"></span></p>
            <p className="mt-3"><strong>Date:</strong> <span className="border-b-2 border-gray-400 inline-block w-48 ml-2"></span></p>
            
            {canSignThis && (
              <button
                onClick={() => onSign(role)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check size={18} />
                <span>Sign as {label}</span>
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  const renderStampSection = () => {
    const isComplete = docInstance?.stamped;

    return (
      <div className={`stamp-box ${isComplete ? 'border-green-500 bg-green-50' : ''}`}>
        {isComplete ? (
          <>
            <img 
              src={placeholderStamp} 
              alt="Company Stamp" 
              className="mx-auto mb-2"
              style={{ width: '150px', height: '150px' }}
            />
            <p className="text-green-700 text-xl font-bold">APPROVED</p>
            <p className="text-sm text-green-600 mt-2">All required signatures obtained</p>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-xl font-bold">COMPANY STAMP</p>
            <p className="text-sm text-gray-400 mt-2">(Official company seal will be affixed after all signatures)</p>
          </>
        )}
      </div>
    );
  };

  // Generate the document content
  const content = baseContent.replace(
    /<div class="mt-12">[\s\S]*?<\/div>\s*<\/div>\s*$/,
    `<div class="mt-12">
      <h2>Document Approval</h2>
      <div id="signature-sections"></div>
    </div>
  </div>`
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      {docInstance && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-blue-900">Document ID: {docInstance.id}</p>
              <p className="text-sm text-blue-700">Created: {new Date(docInstance.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {docInstance.status === 'completed' && (
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                  <Check size={16} />
                  Completed
                </span>
              )}
              {docInstance.status === 'in_progress' && (
                <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                  <Clock size={16} />
                  In Progress
                </span>
              )}
              {docInstance.status === 'pending' && (
                <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                  <AlertCircle size={16} />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: content }} />
      
      {docInstance && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">Document Approval</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {renderSignatureSection('prepared', 'Prepared By')}
            {renderSignatureSection('reviewed', 'Reviewed By')}
          </div>
          
          <div className="mt-6">
            {renderSignatureSection('approved', 'Approved By Top Management')}
          </div>
          
          <div className="mt-6">
            {renderStampSection()}
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentViewer;
