// User database - Stage 2 will connect to real backend
export const users = [
  {
    id: 'user-001',
    username: 'helkhider',
    password: 'demo123', // In production, this would be hashed
    fullName: 'Haitham Elkhider',
    position: 'Chief Executive Officer',
    role: 'CEO',
    group: 'Management',
    permissions: ['generate_documents', 'approve_documents', 'view_all', 'sign_as_prepared', 'sign_as_reviewed', 'sign_as_approved'],
    signatureImage: '/signatures/helkhider-signature.png', // Placeholder
    email: 'h.elkhider@l3company.sa'
  }
  // More users will be added in Stage 2
];

// Placeholder signature as base64 (simple signature style)
export const placeholderSignature = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='80' viewBox='0 0 300 80'%3E%3Ctext x='10' y='50' font-family='Brush Script MT, cursive' font-size='32' fill='%23000080'%3EHaitham Elkhider%3C/text%3E%3C/svg%3E`;

// Placeholder company stamp as base64
export const placeholderStamp = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='70' fill='none' stroke='%231e40af' stroke-width='3'/%3E%3Ccircle cx='75' cy='75' r='60' fill='none' stroke='%231e40af' stroke-width='2'/%3E%3Ctext x='75' y='65' font-family='Arial' font-size='24' font-weight='bold' fill='%231e40af' text-anchor='middle'%3EL3 Company%3C/text%3E%3Ctext x='75' y='85' font-family='Arial' font-size='12' fill='%231e40af' text-anchor='middle'%3EOfficial Seal%3C/text%3E%3Ctext x='75' y='100' font-family='Arial' font-size='10' fill='%231e40af' text-anchor='middle'%3E2025%3C/text%3E%3C/svg%3E`;

export const authenticateUser = (username, password) => {
  return users.find(u => u.username === username && u.password === password);
};

export const getUserById = (userId) => {
  return users.find(u => u.id === userId);
};
