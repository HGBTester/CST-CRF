// Document instance management
// In Stage 2, this will be connected to a real database

let documentInstances = [];
let documentIdCounter = 1;

export const createDocumentInstance = (category, subcategory, item, createdBy) => {
  // Calculate next version for this control
  const existingDocs = documentInstances.filter(doc => doc.controlId === item.id);
  const latestVersion = existingDocs.length > 0 
    ? Math.max(...existingDocs.map(d => parseFloat(d.version))) 
    : 0;
  const nextVersion = (latestVersion + 1).toFixed(1);
  
  const newDoc = {
    id: `DOC-${String(documentIdCounter).padStart(5, '0')}`,
    controlId: item.id,
    controlName: item.name,
    category,
    subcategory,
    level: item.level,
    createdAt: new Date().toISOString(),
    createdBy: createdBy,
    status: 'pending', // pending, in_progress, completed
    signatures: {
      prepared: null, // { userId, userName, position, signedAt, signature }
      reviewed: null,
      approved: null
    },
    stamped: false,
    version: nextVersion,
    revisionNote: existingDocs.length > 0 ? `Revision ${Math.floor(nextVersion)}` : 'Initial version'
  };
  
  documentInstances.push(newDoc);
  documentIdCounter++;
  return newDoc;
};

export const getDocumentInstances = (controlId) => {
  return documentInstances.filter(doc => doc.controlId === controlId);
};

export const getAllDocumentInstances = () => {
  return [...documentInstances];
};

export const getDocumentById = (docId) => {
  return documentInstances.find(doc => doc.id === docId);
};

export const signDocument = (docId, role, userInfo) => {
  const doc = documentInstances.find(d => d.id === docId);
  if (!doc) return null;
  
  const signatureData = {
    userId: userInfo.id,
    userName: userInfo.fullName,
    position: userInfo.position,
    signedAt: new Date().toISOString(),
    signature: userInfo.signatureImage
  };
  
  if (role === 'prepared') {
    doc.signatures.prepared = signatureData;
  } else if (role === 'reviewed') {
    doc.signatures.reviewed = signatureData;
  } else if (role === 'approved') {
    doc.signatures.approved = signatureData;
  }
  
  // Update status
  updateDocumentStatus(doc);
  
  return doc;
};

const updateDocumentStatus = (doc) => {
  const { prepared, reviewed, approved } = doc.signatures;
  
  if (!prepared && !reviewed && !approved) {
    doc.status = 'pending';
  } else if (prepared && reviewed && approved) {
    doc.status = 'completed';
    doc.stamped = true;
  } else {
    doc.status = 'in_progress';
  }
};

export const revokeSignature = (docId, role) => {
  const doc = documentInstances.find(d => d.id === docId);
  if (!doc) return null;
  
  if (role === 'prepared') {
    doc.signatures.prepared = null;
    // Also revoke subsequent signatures
    doc.signatures.reviewed = null;
    doc.signatures.approved = null;
  } else if (role === 'reviewed') {
    doc.signatures.reviewed = null;
    // Also revoke subsequent signatures
    doc.signatures.approved = null;
  } else if (role === 'approved') {
    doc.signatures.approved = null;
  }
  
  // Update status
  updateDocumentStatus(doc);
  
  return doc;
};

export const deleteDocumentInstance = (docId) => {
  const index = documentInstances.findIndex(d => d.id === docId);
  if (index > -1) {
    documentInstances.splice(index, 1);
    return true;
  }
  return false;
};

// For demo purposes - reset all data
export const resetDocumentStore = () => {
  documentInstances = [];
  documentIdCounter = 1;
};
