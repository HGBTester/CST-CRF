# Stage 2 - Dynamic Document Management & Approval Workflow

## 🎉 New Features Implemented

### ✅ User Authentication System
- **Login/Logout**: Secure authentication for authorized users
- **User Profiles**: Each user has a profile with name, position, and permissions
- **Role-Based Access**: Permissions control who can generate and sign documents

### ✅ Dynamic Document Generation
- **Generate Button** (➕): Click the green plus button next to any control to create a new document instance
- **Multiple Instances**: Create multiple document copies for the same control
- **Unique Document IDs**: Each generated document gets a unique ID (e.g., DOC-00001, DOC-00002)
- **Version Tracking**: Each document instance tracks its version number

### ✅ Tree View Enhancement
- **Expandable Controls**: Click on any control to expand and see all generated documents
- **Status Indicators**:
  - **Green checkmark (✓)**: Completed (all 3 signatures obtained)
  - **Orange dot (●)**: In Progress (some signatures obtained)
  - **Gray circle (○)**: Pending (no signatures yet)
- **Color-Coded Borders**:
  - **Green left border**: Completed documents
  - **Orange left border**: In-progress documents
  - **Gray left border**: Pending documents

### ✅ Three-Stage Approval Workflow

#### 1. Prepared By (First Signature)
- **Role**: Any user with `sign_as_prepared` permission
- **When**: Document must be generated first
- **Action**: Click "Sign as Prepared By" button
- **Auto-fills**: Name, position, signature, and timestamp

#### 2. Reviewed By (Second Signature)
- **Role**: Any user with `sign_as_reviewed` permission
- **When**: After document is prepared
- **Requirement**: Document must be signed by preparer first
- **Action**: Click "Sign as Reviewed By" button
- **Auto-fills**: Name, position, signature, and timestamp

#### 3. Approved By (Third Signature)
- **Role**: Any user with `sign_as_approved` permission (typically CEO/Management)
- **When**: After document is prepared AND reviewed
- **Requirement**: Both previous signatures must be complete
- **Action**: Click "Sign as Approved By Top Management" button
- **Auto-fills**: Name, position, signature, and timestamp

### ✅ Automatic Stamping
- **Trigger**: Automatically applied when all 3 signatures are obtained
- **Visual**: Company stamp appears in the stamp section
- **Status**: Document turns **green** and shows "APPROVED" status
- **Indicator**: Green checkmark appears in the tree view

### ✅ Digital Signatures
- **Placeholder Signatures**: Using SVG-based signature placeholders
- **Consistent Style**: All signatures use the same style (Stage 3 will allow custom uploads)
- **Timestamp**: Each signature includes the exact date and time

### ✅ Company Stamp
- **Placeholder Stamp**: Blue circular stamp with "L3 Company" branding
- **Auto-placement**: Automatically placed after all signatures
- **Stage 3**: Will allow uploading real company stamp

---

## 👤 Current User: Haitham Elkhider

### User Details
- **Username**: `helkhider`
- **Password**: `demo123`
- **Full Name**: Haitham Elkhider
- **Position**: Chief Executive Officer
- **Role**: CEO
- **Group**: Management

### Permissions
✅ **generate_documents** - Can create new document instances  
✅ **approve_documents** - Can approve documents (final signature)  
✅ **view_all** - Can view all documents  
✅ **sign_as_prepared** - Can sign as "Prepared By"  
✅ **sign_as_reviewed** - Can sign as "Reviewed By"  
✅ **sign_as_approved** - Can sign as "Approved By"

**Note**: Haitham has full permissions and can perform all roles. In production, these would be separated among different users.

---

## 🎯 How to Use the New System

### Step 1: Login
1. Open the application
2. Enter username: `helkhider`
3. Enter password: `demo123`
4. Click "Sign In"

### Step 2: Generate a Document
1. Expand a category (e.g., "Governance")
2. Expand a subcategory (e.g., "1.1 Cybersecurity Strategy")
3. Find a control (e.g., "1.1.1 Define Cybersecurity Strategy Requirements")
4. Click the green **➕ Plus button** next to the control
5. A new document instance will be created and displayed

### Step 3: Sign as Prepared By
1. The newly created document will open automatically
2. Scroll down to the "Document Approval" section
3. Find the "Prepared By" signature box
4. Click the blue **"Sign as Prepared By"** button
5. Your signature will be automatically added

### Step 4: Sign as Reviewed By
1. After preparing, the "Reviewed By" section becomes active
2. Click the blue **"Sign as Reviewed By"** button
3. Your signature will be automatically added

### Step 5: Sign as Approved By
1. After reviewing, the "Approved By" section becomes active
2. Click the blue **"Sign as Approved By Top Management"** button
3. Your signature will be automatically added
4. **The company stamp appears automatically**
5. **Document status changes to "Completed" (green)**

### Step 6: View Completed Documents
1. In the tree view, completed documents show a **green left border**
2. A **green checkmark (✓)** appears next to the document ID
3. The stamp section shows "APPROVED" status

---

## 📊 Document Status Flow

```
Pending (Gray) → In Progress (Orange) → Completed (Green)
     ○                    ●                      ✓
```

### Status Breakdown:
- **Pending**: No signatures yet (gray border, gray circle)
- **In Progress**: 1 or 2 signatures obtained (orange border, orange dot)
- **Completed**: All 3 signatures + stamp (green border, green checkmark)

---

## 🔄 Workflow Example

**Control**: 1.1.1 - Define Cybersecurity Strategy Requirements

1. **Generate**: Click ➕ → Document DOC-00001 created (Status: Pending ○)
2. **Prepare**: Click "Sign as Prepared By" (Status: In Progress ●)
3. **Review**: Click "Sign as Reviewed By" (Status: In Progress ●)
4. **Approve**: Click "Sign as Approved By" (Status: Completed ✓ + Stamp)

---

## 🗂️ Multiple Documents Per Control

You can create **multiple document instances** for the same control:

- **DOC-00001** - First version (Completed ✓)
- **DOC-00002** - Second version (In Progress ●)
- **DOC-00003** - Third version (Pending ○)

This is useful for:
- **Revisions**: Creating updated versions
- **Different scenarios**: Different implementations of the same control
- **Historical tracking**: Keeping old versions while creating new ones

---

## 🎨 Visual Indicators

### In Tree View:
- **Green ➕ button**: Generate new document (only for users with permission)
- **Expand/collapse arrows**: Show/hide document instances
- **Status icons**: ✓ (completed), ● (in progress), ○ (pending)
- **Border colors**: Green/Orange/Gray based on status

### In Document Viewer:
- **Green signature boxes**: Signature already obtained
- **White signature boxes**: Awaiting signature
- **Blue "Sign" buttons**: Available for current user to sign
- **Company stamp**: Only appears when all signatures complete

---

## 💾 Data Persistence

**Current Stage**: Data stored in browser memory (resets on page refresh)

**Stage 3 Plans**:
- Backend database integration
- Persistent storage of documents
- Document history and audit trail
- Real file attachments for evidence

---

## 🔐 Security Notes

### Current Implementation (Demo):
- ✅ Login authentication
- ✅ Permission-based access control
- ✅ Role-based signing workflow
- ❌ Passwords are **not** encrypted (plain text for demo)
- ❌ No session management
- ❌ No backend authentication

### Production Requirements (Stage 3):
- 🔒 Encrypted password storage (bcrypt/scrypt)
- 🔒 JWT or session-based authentication
- 🔒 HTTPS/SSL encryption
- 🔒 Backend API with proper authentication
- 🔒 Database with access controls
- 🔒 Audit logging of all signature actions

---

## 📱 User Experience Improvements

### What's Better:
1. **No more manual filling**: Signatures auto-populate with user info
2. **Clear workflow**: Step-by-step signing process
3. **Visual feedback**: Instant status updates with colors
4. **Easy navigation**: Find documents quickly in tree view
5. **Multiple versions**: Create as many document instances as needed
6. **Automatic stamping**: No need to manually add stamp after completion

---

## 🚀 Next Steps (Stage 3)

When you're ready for Stage 3, we'll add:

1. **Additional Users**
   - Add more staff members
   - Separate roles (Preparer, Reviewer, Approver)
   - Permission restrictions

2. **Real Signatures**
   - Upload actual signature images for each user
   - Upload real company stamp
   - Custom signature styles

3. **Evidence Attachments**
   - Attach files (screenshots, logs, policies)
   - Evidence repository
   - Link evidence to specific requirements

4. **Backend Integration**
   - Database storage (PostgreSQL/MySQL)
   - REST API
   - Persistent data storage

5. **Advanced Features**
   - PDF export with embedded signatures
   - Email notifications for pending signatures
   - Document workflow tracking
   - Comments and feedback system
   - Document comparison (version diff)

---

## 🎓 Training Notes

For other users who will use this system:

1. **Remember your credentials**: Username and password
2. **Check your permissions**: Know which signatures you can provide
3. **Follow the sequence**: Prepare → Review → Approve (in order)
4. **Use the tree view**: Colors and icons show status at a glance
5. **Generate wisely**: Only create documents when needed
6. **Review before signing**: Read the document before clicking "Sign"

---

## ✅ Summary

Stage 2 transforms the static document viewer into a **fully functional approval workflow system** with:
- ✅ User authentication and permissions
- ✅ Dynamic document generation
- ✅ Three-stage signature workflow
- ✅ Automatic company stamping
- ✅ Real-time status tracking
- ✅ Multiple document instances per control
- ✅ Visual status indicators

**The system is now ready for L3 Company to start generating and approving CST-CRF audit documents!**
