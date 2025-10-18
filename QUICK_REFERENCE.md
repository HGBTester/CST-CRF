# Quick Reference - CST-CRF Audit System (Stage 2)

## 🚀 Starting the Application

```powershell
cd "C:\Users\hgb_m\Downloads\CODING\CST Audit"
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

Then open: **http://localhost:3000**

---

## 🔑 Login Credentials

**Username**: `helkhider`  
**Password**: `demo123`  
**Role**: CEO (Full permissions)

---

## 📝 Quick Actions

### Generate a New Document
1. Expand Category → Subcategory
2. Click green **➕** button next to control
3. Document created and opens automatically

### Sign a Document (3 Steps Required)
1. **Prepare**: Click "Sign as Prepared By" (becomes available immediately)
2. **Review**: Click "Sign as Reviewed By" (available after Step 1)
3. **Approve**: Click "Sign as Approved By" (available after Step 2)
4. **Stamp Applied Automatically** ✓

### View Document Status
- **○ Gray**: Pending (no signatures)
- **● Orange**: In Progress (1-2 signatures)
- **✓ Green**: Completed (all 3 signatures + stamp)

---

## 🎯 Workflow Summary

```
Generate Document → Prepare → Review → Approve → Auto-Stamp
     (➕)            (Sign 1)  (Sign 2)  (Sign 3)     (✓)
```

---

## 🎨 Visual Guide

### Tree View Icons
- **➕ Green button** = Generate new document
- **▶ Arrow** = Expand/collapse
- **✓ Checkmark** = Document completed
- **● Orange dot** = Document in progress
- **○ Gray circle** = Document pending

### Document Status Colors
- **Green left border** = Completed
- **Orange left border** = In progress  
- **Gray left border** = Pending

---

## 📋 Key Features

✅ **Login System** - Secure authentication  
✅ **Dynamic Generation** - Create multiple document instances  
✅ **3-Stage Approval** - Prepare → Review → Approve  
✅ **Auto-Stamping** - Company stamp after all signatures  
✅ **Status Tracking** - Real-time visual indicators  
✅ **Print & Download** - Export documents anytime  

---

## 🔄 Multiple Documents

You can create **multiple versions** of the same control:
- DOC-00001 (Version 1.0) - Completed ✓
- DOC-00002 (Version 1.0) - In Progress ●
- DOC-00003 (Version 1.0) - Pending ○

Each document tracks independently!

---

## ⚡ Pro Tips

1. **Expand controls** to see all generated documents underneath
2. **Color-coded borders** show status at a glance
3. **Documents stay** in tree view for easy access
4. **Sign in sequence** - can't skip steps
5. **Logout** to switch users (Stage 3 will add more users)

---

## 🎓 Remember

- **Only CEO (Haitham)** can do all 3 signatures currently
- **Real workflow** needs 3 different users (Stage 3)
- **Data resets** on page refresh (Stage 3 adds database)
- **Signatures** are placeholders (Stage 3 adds real ones)

---

## 📞 Need Help?

1. Check **STAGE2_FEATURES.md** for detailed documentation
2. Check **README.md** for full project information
3. Look at the welcome screen for step-by-step instructions

---

**The system is live and ready to use!**

Login now at: **http://localhost:3000**
