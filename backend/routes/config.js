import express from 'express';
import AuditStructure from '../models/AuditStructure.js';
import EvidenceRequirement from '../models/EvidenceRequirement.js';
import FormTypeDefinition from '../models/FormTypeDefinition.js';
import { EvidenceMapping, StaticEvidenceControl, TemplateOnlyControl } from '../models/EvidenceMapping.js';
import TemplateContent from '../models/TemplateContent.js';

const router = express.Router();

// Get complete audit structure
router.get('/audit-structure', async (req, res) => {
  try {
    const structure = await AuditStructure.find().sort({ order: 1 });
    res.json(structure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get audit structure formatted for frontend (original format)
router.get('/audit-structure/formatted', async (req, res) => {
  try {
    const structure = await AuditStructure.find().sort({ order: 1 });
    
    // Convert to original frontend format
    const formatted = {};
    structure.forEach(cat => {
      formatted[cat.category] = {};
      cat.subcategories.forEach(sub => {
        formatted[cat.category][sub.name] = sub.controls;
      });
    });
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get evidence requirements for a specific control
router.get('/evidence-requirements/:controlId', async (req, res) => {
  try {
    const requirement = await EvidenceRequirement.findOne({ 
      controlId: req.params.controlId 
    });
    res.json(requirement || { controlId: req.params.controlId, requirements: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all evidence requirements
router.get('/evidence-requirements', async (req, res) => {
  try {
    const requirements = await EvidenceRequirement.find();
    
    // Convert to object format for frontend compatibility
    const formatted = {};
    requirements.forEach(req => {
      formatted[req.controlId] = req.requirements;
    });
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all form type definitions
router.get('/form-types', async (req, res) => {
  try {
    const formTypes = await FormTypeDefinition.find().sort({ order: 1 });
    res.json(formTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get form type by value
router.get('/form-types/:value', async (req, res) => {
  try {
    const formType = await FormTypeDefinition.findOne({ value: req.params.value });
    res.json(formType || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get evidence mappings
router.get('/evidence-mappings', async (req, res) => {
  try {
    const mappings = await EvidenceMapping.find();
    
    // Convert to object format for frontend compatibility
    const formatted = {};
    mappings.forEach(mapping => {
      formatted[mapping.formType] = mapping.applicableCategories;
    });
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get static evidence controls
router.get('/static-evidence-controls', async (req, res) => {
  try {
    const controls = await StaticEvidenceControl.find();
    res.json(controls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get template-only controls
router.get('/template-only-controls', async (req, res) => {
  try {
    const controls = await TemplateOnlyControl.find();
    res.json(controls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if control is template-only
router.get('/template-only-controls/:controlId', async (req, res) => {
  try {
    const control = await TemplateOnlyControl.findOne({ 
      controlId: req.params.controlId 
    });
    res.json({ isTemplateOnly: !!control });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applicable form types for a control
router.get('/applicable-forms/:controlId', async (req, res) => {
  try {
    const controlId = req.params.controlId;
    const category = controlId.match(/^\d+\.\d+/)?.[0];
    
    if (!category) {
      return res.json([]);
    }
    
    const mappings = await EvidenceMapping.find({
      applicableCategories: category
    });
    
    const formTypes = mappings.map(m => m.formType);
    res.json(formTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get template content for a control
router.get('/template-content/:controlId', async (req, res) => {
  try {
    const template = await TemplateContent.findOne({ 
      controlId: req.params.controlId,
      active: true
    });
    res.json(template || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all active template contents
router.get('/template-contents', async (req, res) => {
  try {
    const templates = await TemplateContent.find({ active: true });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get complete configuration (all data in one call)
router.get('/complete', async (req, res) => {
  try {
    const [
      auditStructure,
      evidenceRequirements,
      formTypes,
      evidenceMappings,
      staticEvidenceControls,
      templateOnlyControls,
      templateContents
    ] = await Promise.all([
      AuditStructure.find().sort({ order: 1 }),
      EvidenceRequirement.find(),
      FormTypeDefinition.find().sort({ order: 1 }),
      EvidenceMapping.find(),
      StaticEvidenceControl.find(),
      TemplateOnlyControl.find(),
      TemplateContent.find({ active: true })
    ]);
    
    // Format for frontend compatibility
    const formattedStructure = {};
    auditStructure.forEach(cat => {
      formattedStructure[cat.category] = {};
      cat.subcategories.forEach(sub => {
        formattedStructure[cat.category][sub.name] = sub.controls;
      });
    });
    
    const formattedRequirements = {};
    evidenceRequirements.forEach(req => {
      formattedRequirements[req.controlId] = req.requirements;
    });
    
    const formattedMappings = {};
    evidenceMappings.forEach(mapping => {
      formattedMappings[mapping.formType] = mapping.applicableCategories;
    });
    
    res.json({
      auditStructure: formattedStructure,
      evidenceRequirements: formattedRequirements,
      formTypes,
      evidenceMappings: formattedMappings,
      staticEvidenceControls,
      templateOnlyControls,
      templateContents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
