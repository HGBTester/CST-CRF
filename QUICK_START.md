# Quick Start Guide - L3 Company CST-CRF Audit System

## 🚀 Getting Started

### Step 1: Open PowerShell in Project Directory
```powershell
cd "C:\Users\hgb_m\Downloads\CODING\CST Audit"
```

### Step 2: Install Dependencies (if not already done)
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```

### Step 3: Start the Application
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### Step 4: Access the Application
Open your browser and go to: **http://localhost:3000**

---

## 📋 What You Have Now

### ✅ Complete Document Management System
- **200+ CST-CRF Control Documents**: All controls from CL1 to CL3 are included
- **6 Major Categories**: Governance, Asset Management, Risk Management, Logical Security, Physical Security, Third Party Security
- **Professional Templates**: Each document includes proper structure, approval sections, and signature areas

### ✅ Tree View Navigation
- Organized by category → subcategory → control
- Easy navigation with expand/collapse functionality
- Visual indicators for selected documents

### ✅ Document Features
- **Header Section**: Company name, control details, compliance level
- **Content Sections**: Purpose, scope, requirements, responsibilities
- **Evidence Guidelines**: What evidence to collect for CST auditors
- **Approval Section**: 
  - Prepared by (Cybersecurity Manager)
  - Reviewed by (CISO)
  - Approved by (CEO)
  - Company stamp placeholder

### ✅ Export Capabilities
- **Print**: Print-ready documents with proper formatting
- **Download**: Save as HTML files for offline access

---

## 🎯 How to Use

### Navigate Documents
1. Click on a category (e.g., "Governance")
2. Click on a subcategory (e.g., "1.1 Cybersecurity Strategy")
3. Click on any control to view its document
4. The document appears in the main area with all details

### Generate Documents for CST
1. Select a control from the left panel
2. Review the generated document
3. Print or download the document
4. Fill in the signature fields manually (Stage 1)
5. Add company stamp manually (Stage 1)

### For CST Audit Submission
1. Navigate through each required control
2. Download all necessary documents
3. Sign and stamp each document
4. Collect the evidence mentioned in each document
5. Organize in folders by category
6. Submit to CST entity

---

## 📁 Document Organization Recommendation

For CST submission, organize your documents as follows:

```
L3_CST_Audit_Submission/
├── 1_Governance/
│   ├── 1.1_Cybersecurity_Strategy/
│   ├── 1.2_Cybersecurity_Management/
│   ├── 1.3_Cybersecurity_Compliance/
│   ├── 1.4_Cybersecurity_Audit/
│   ├── 1.5_Cybersecurity_Awareness_Training/
│   ├── 1.6_Customer_Cybersecurity_Awareness/
│   ├── 1.7_Cybersecurity_in_Project_Management/
│   └── 1.8_Cybersecurity_in_Human_Resources/
├── 2_Asset_Management/
├── 3_Cybersecurity_Risk_Management/
├── 4_Logical_Security/
├── 5_Physical_Security/
└── 6_Third_Party_Security/
```

---

## 🔄 Stage 2 Enhancements (Coming Next)

When ready for Stage 2, we will add:

1. **Digital Signatures**
   - Upload signature images
   - Select signatories from dropdown
   - Auto-populate names and positions
   - Date auto-filling

2. **Company Stamp**
   - Upload digital stamp
   - Auto-place on documents
   - Multiple stamp options

3. **Evidence Management**
   - Attach evidence files to each control
   - Evidence repository
   - Link evidence to specific requirements

4. **User Management**
   - Multiple users with different roles
   - Approval workflow
   - Review and comment features

5. **Advanced Export**
   - PDF export with embedded signatures
   - Batch export all documents
   - Zip archive creation

---

## 💡 Tips

### For Current Stage (Stage 1)
- Download all documents you need first
- Print to PDF if you want PDF versions
- Use the same signature style across all documents
- Keep a master copy of all generated documents

### Best Practices
- Review each document before signing
- Ensure all evidence mentioned is collected
- Keep a checklist of completed controls
- Organize by priority (CL1 first, then CL2, then CL3)

---

## 🆘 Troubleshooting

### Application Won't Start
```powershell
# Try clearing node_modules and reinstalling
Remove-Item -Recurse -Force node_modules
powershell -ExecutionPolicy Bypass -Command "npm install"
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### Port Already in Use
If port 3000 is busy, edit `vite.config.js` and change the port number.

### Browser Doesn't Open Automatically
Manually navigate to `http://localhost:3000` in your browser.

---

## 📞 Next Steps

1. **Review the application** - Navigate through all categories
2. **Select priority controls** - Start with CL1 requirements
3. **Download key documents** - Get the most critical ones first
4. **Prepare for Stage 2** - Think about who will sign which documents
5. **Collect evidence** - Start gathering the evidence mentioned in documents

---

## 🎉 You're Ready!

Your CST-CRF Audit Management System is now ready to use. Start by exploring the Governance category and work your way through each control.

The application includes everything L3 Company needs to prepare for CST audit compliance!
