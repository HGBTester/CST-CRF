# 📋 Evidence Types Guide - Complete Implementation

## 🎯 Two Types of Evidence in the System

Your compliance system now supports **TWO distinct types of evidence** based on the nature of each control:

---

## 1️⃣ **Operational Evidence Forms** (For Ongoing Activities)

### **What Are They?**
Structured forms that record **ongoing operational activities** - things that happen repeatedly in your daily cybersecurity operations.

### **Examples:**
- 🔄 **Change Requests** - Every time you make a system change
- ⚠️ **Incident Reports** - When security incidents occur
- 🎯 **Risk Assessments** - Periodic risk reviews
- ✅ **Access Reviews** - Regular permission audits
- 🎓 **Training Records** - Employee training sessions
- 📋 **Meeting Minutes** - Committee meetings
- 🏢 **Vendor Assessments** - Third-party evaluations

### **Which Controls Use Operational Forms:**

#### **Change Management (4.2)**
- **Forms:** Change Request
- **Why:** You make changes constantly - each needs documented approval
- **Example:** "Add firewall rule for CRM system"

#### **Incident Management (2.2)**
- **Forms:** Incident Report
- **Why:** Security incidents must be logged and resolved
- **Example:** "Phishing email reported by user"

#### **Risk Management (1.3)**
- **Forms:** Risk Assessment
- **Why:** Regular risk evaluations are ongoing
- **Example:** "Q4 2025 Risk Assessment"

#### **Access Control (4.3, 4.4)**
- **Forms:** Access Review
- **Why:** User permissions must be reviewed regularly
- **Example:** "Monthly privileged access audit"

#### **Training (1.5)**
- **Forms:** Training Record
- **Why:** Track every training session
- **Example:** "Security Awareness - October 2025"

#### **Governance (1.1, 1.2)**
- **Forms:** Meeting Minutes
- **Why:** Committee meetings happen regularly
- **Example:** "Security Committee Meeting - Oct 15"

#### **Supply Chain (3.1)**
- **Forms:** Vendor Assessment
- **Why:** Evaluate vendors periodically
- **Example:** "Cloud Provider Security Review"

#### **Compliance/Monitoring (1.4, 2.1)**
- **Forms:** Audit Report
- **Why:** Regular audits and monitoring
- **Example:** "Internal Audit Q3 2025"

---

## 2️⃣ **Static Evidence Files** (For Fixed Documentation)

### **What Are They?**
**Photos, documents, certificates, and files** that prove compliance - things that don't change often and don't need a structured form.

### **Examples:**
- 📷 **Photos** - Physical security controls (cameras, locks, badges)
- 📄 **Documents** - Policies, procedures, certificates
- 🗺️ **Diagrams** - Network maps, floor plans
- 📋 **Logs** - Backup logs, access logs
- 🎓 **Certificates** - Training certificates, security certs
- 📑 **Contracts** - Vendor agreements, insurance policies

### **Which Controls Use Static Evidence:**

#### **Physical Security (1.6)** ⭐
- **Why:** Need photos/videos of physical controls
- **Upload:**
  - Photos of badge readers
  - Camera footage screenshots
  - Access log reports
  - Visitor sign-in sheets
  - Photos of server room locks
  - Fire suppression system images
  - CCTV system documentation

#### **Organization Structure (1.2)**
- **Why:** Documentation of roles and structure
- **Upload:**
  - Organizational charts
  - Committee rosters
  - Role descriptions
  - Authority matrices
  - Responsibility assignment documents

#### **Asset Management (3.2)**
- **Why:** Inventory documentation with photos
- **Upload:**
  - Equipment photos with asset tags
  - Purchase receipts
  - Warranty documents
  - Equipment inventory spreadsheets
  - Asset labels/barcodes

#### **Policies Documentation (4.1)**
- **Why:** Signed policy documents
- **Upload:**
  - Signed policy acknowledgments
  - Policy distribution records
  - Employee signature sheets
  - Policy review documents

#### **Network Security (4.5)**
- **Why:** Network configuration documentation
- **Upload:**
  - Network diagrams
  - Firewall rule screenshots
  - Security zone maps
  - Network configuration files
  - VLAN documentation

#### **Cryptography (4.7)**
- **Why:** Encryption certificates and documentation
- **Upload:**
  - SSL/TLS certificates
  - Encryption key documentation
  - Certificate management policies
  - Crypto algorithm specifications

#### **Backup & Recovery (4.8)**
- **Why:** Backup logs and test results
- **Upload:**
  - Backup success logs
  - Recovery test reports
  - Backup schedules
  - Storage location photos
  - Backup verification screenshots

---

## 📊 Complete Control-to-Evidence Mapping

### Controls WITH Operational Forms (Evidence Tab Shown):

| Control | Category | Evidence Type | Button Shows |
|---------|----------|---------------|--------------|
| 1.1 | Information Security Policies | Meeting Minutes | "Add Evidence" |
| 1.3 | Risk Management | Risk Assessment | "Add Evidence" |
| 1.4 | Compliance | Audit Report | "Add Evidence" |
| 1.5 | Training | Training Record | "Add Evidence" |
| 2.1 | Monitoring | Audit Report, Risk Assessment | "Add Evidence" |
| 2.2 | Incident Management | Incident Report | "Add Evidence" |
| 3.1 | Supply Chain | Vendor Assessment | "Add Evidence" |
| 4.2 | Change Management | Change Request | "Add Evidence" |
| 4.3 | Access Control | Access Review | "Add Evidence" |
| 4.4 | Privileged Access | Access Review | "Add Evidence" |
| 4.6 | System Development | Change Request | "Add Evidence" |
| 4.9 | Configuration Management | Change Request | "Add Evidence" |
| 4.10 | Vulnerability Management | Incident Report | "Add Evidence" |

### Controls WITH Static Evidence Only (Different Button):

| Control | Category | Upload | Button Shows |
|---------|----------|--------|--------------|
| 1.2 | Organization Structure | Org charts, rosters | "Upload Evidence Files" 📤 |
| 1.6 | Physical Security | Photos, logs | "Upload Evidence Files" 📤 |
| 3.2 | Asset Management | Inventory photos | "Upload Evidence Files" 📤 |
| 4.1 | Policies Documentation | Signed docs | "Upload Evidence Files" 📤 |
| 4.5 | Network Security | Diagrams, configs | "Upload Evidence Files" 📤 |
| 4.7 | Cryptography | Certificates | "Upload Evidence Files" 📤 |
| 4.8 | Backup & Recovery | Logs, test results | "Upload Evidence Files" 📤 |

### Controls WITHOUT Evidence Capability (No Tab Shown):

| Control | Category | Why No Evidence |
|---------|----------|-----------------|
| 4.11 | Logging and Monitoring | Covered by 2.1 Monitoring |
| 4.12 | Information Transfer | Network-level, covered by 4.5 |
| Other controls | Various | May not require separate evidence |

---

## 🎨 Visual Differences

### **Operational Evidence Controls:**

```
Control 4.2.1 - Change Management
┌─────────────────────────────────────┐
│ Template Editor                     │
│ [📋 Template] [📝 Evidence 5]      │  ← Evidence tab shown
│                                     │
│ Button: [+ Add Evidence]            │  ← Creates structured form
└─────────────────────────────────────┘
```

### **Static Evidence Controls:**

```
Control 1.6.1 - Physical Security
┌─────────────────────────────────────┐
│ Template Editor                     │
│ [📋 Template] [📝 Evidence 3]      │  ← Evidence tab shown
│                                     │
│ Button: [📤 Upload Evidence Files]  │  ← Opens file uploader
└─────────────────────────────────────┘
```

### **No Evidence Controls:**

```
Control 4.11.1 - Logging
┌─────────────────────────────────────┐
│ Template Editor                     │
│ [📋 Template]                       │  ← No Evidence tab!
│                                     │
│ (No evidence button)                │
└─────────────────────────────────────┘
```

---

## 🔄 How to Use Each Type

### **Using Operational Forms:**

```
1. Navigate to control (e.g., 4.2.1 Change Management)
2. Click "Evidence" tab
3. Click "Add Evidence" button
4. Fill structured form:
   - Change title
   - Risk level
   - Implementation plan
   - Rollback plan
5. Upload supporting files (optional)
6. Submit for approval
7. Get signatures (Requester → Reviewer → Approver)
8. Form appears in list with status
```

### **Using Static Evidence Upload:**

```
1. Navigate to control (e.g., 1.6.1 Physical Access Control)
2. Click "Evidence" tab
3. Click "Upload Evidence Files" button
4. Enter package details:
   - Title: "Q4 2025 Physical Security Photos"
   - Description: "Access control systems and badges"
5. Select multiple files:
   - badge-reader-main-entrance.jpg
   - server-room-door-lock.jpg
   - visitor-log-october.pdf
   - cctv-camera-layout.png
6. Click "Upload Evidence"
7. Files are stored and linked to control
8. Package appears in evidence list
```

---

## 📝 Real-World Scenarios

### **Scenario 1: Making a System Change**

**Control:** 4.2.1 Change Management  
**Evidence Type:** Operational Form

```
Action: Network admin needs to add firewall rule
  ↓
1. Go to Control 4.2.1 → Evidence tab
2. Click "Add Evidence"
3. Fill Change Request form:
   - Title: "Allow HTTPS for CRM system"
   - Risk: Medium
   - Implementation: "Add rule to firewall"
   - Rollback: "Remove rule if issues occur"
4. Upload: firewall-config-before.png
5. Submit
  ↓
Result: Change Request CHG-00123 created
        Signed by all 3 roles
        Audit trail complete
```

### **Scenario 2: Physical Security Audit**

**Control:** 1.6.2 Physical Access Control  
**Evidence Type:** Static Files

```
Action: Auditor needs proof of physical security
  ↓
1. Go to Control 1.6.2 → Evidence tab
2. Click "Upload Evidence Files"
3. Package details:
   - Title: "Physical Access Control Evidence"
   - Description: "Q4 2025 Physical Security Photos"
4. Upload files:
   - main-entrance-badge-reader.jpg
   - server-room-biometric-lock.jpg
   - visitor-management-system.jpg
   - cctv-camera-coverage-map.png
   - access-log-october-2025.pdf
5. Click "Upload Evidence"
  ↓
Result: Evidence package created
        5 files attached to control
        Ready for audit review
```

### **Scenario 3: Training Session**

**Control:** 1.5.1 Security Awareness Training  
**Evidence Type:** Operational Form

```
Action: HR conducted security training
  ↓
1. Go to Control 1.5.1 → Evidence tab
2. Click "Add Evidence"
3. Fill Training Record form:
   - Title: "Q4 2025 Security Awareness"
   - Date: October 15, 2025
   - Attendees: [list of 25 employees]
   - Topics: Phishing, passwords, data handling
4. Upload:
   - attendance-sheet-signed.pdf
   - training-slides.pdf
   - quiz-results.xlsx
5. Submit
  ↓
Result: Training Record TRN-00045 created
        25 employees documented
        Certificates attached
```

---

## ⚙️ Technical Implementation

### **Control Detection Logic:**

```javascript
// Check if control has operational forms
getApplicableFormTypes('4.2.1')
→ Returns: ['change_request']
→ Shows: "Add Evidence" button with + icon

// Check if control needs static evidence only
needsStaticEvidence('1.6.1')
→ Returns: true
→ Shows: "Upload Evidence Files" button with 📤 icon

// Check if control has any evidence capability
hasEvidenceCapability('4.11.1')
→ Returns: false
→ Hides: Evidence tab entirely
```

### **Button Behavior:**

```javascript
// In ControlEvidenceView.jsx
const isStaticOnly = needsStaticEvidence(control.item.id) && 
                     getApplicableFormTypes(control.item.id).length === 0;

// Button changes based on evidence type
<button onClick={() => 
  isStaticOnly ? 
    setShowStaticUploader(true) :  // Opens file uploader
    setShowCreateForm(true)         // Opens form builder
}>
  {isStaticOnly ? '📤 Upload Evidence Files' : '+ Add Evidence'}
</button>
```

---

## ✅ Benefits of Two-Type System

### **For Operational Evidence:**
- ✅ Structured data capture
- ✅ Consistent format across all instances
- ✅ Built-in approval workflow
- ✅ Trackable status (Draft → Review → Approved)
- ✅ Searchable fields
- ✅ Automatic numbering (CHG-00123)

### **For Static Evidence:**
- ✅ Simple file upload
- ✅ No unnecessary form fields
- ✅ Faster evidence collection
- ✅ Supports any file type
- ✅ Perfect for photos and documents
- ✅ Flexible for audit materials

### **For System Clarity:**
- ✅ No confusion about what to create
- ✅ Right tool for right job
- ✅ Clean UI (no evidence tab where not needed)
- ✅ Efficient workflows
- ✅ Complete audit coverage

---

## 🎯 Quick Reference

| Need | Evidence Type | Where | Action |
|------|---------------|-------|--------|
| Record change | Operational | 4.2 Change Mgmt | Add Evidence → Form |
| Upload photos | Static | 1.6 Physical Sec | Upload Files → Files |
| Log incident | Operational | 2.2 Incidents | Add Evidence → Form |
| Network diagram | Static | 4.5 Network Sec | Upload Files → Files |
| Training session | Operational | 1.5 Training | Add Evidence → Form |
| Asset photos | Static | 3.2 Assets | Upload Files → Files |
| Risk assessment | Operational | 1.3 Risk | Add Evidence → Form |
| Certificates | Static | 4.7 Crypto | Upload Files → Files |

---

## 🚀 System Status

**Your compliance system now intelligently handles:**
- ✅ 8 operational form types with full workflow
- ✅ Static file uploads for documentary evidence
- ✅ Smart UI that shows only relevant options
- ✅ Complete coverage of all control types
- ✅ Efficient evidence collection for audits

**Every control gets exactly the evidence capability it needs - no more, no less!** 🎉
