import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuditStructure from '../models/AuditStructure.js';
import EvidenceRequirement from '../models/EvidenceRequirement.js';
import FormTypeDefinition from '../models/FormTypeDefinition.js';
import { EvidenceMapping, StaticEvidenceControl, TemplateOnlyControl } from '../models/EvidenceMapping.js';
import TemplateContent from '../models/TemplateContent.js';

dotenv.config();

// Import static data
import { auditStructureData } from './data/auditStructureData.js';
import { evidenceRequirementsData } from './data/evidenceRequirementsData.js';
import { formTypeDefinitionsData } from './data/formTypeDefinitionsData.js';
import { evidenceMappingData, staticEvidenceControlsData, templateOnlyControlsData } from './data/evidenceMappingData.js';
import { templateContentsData } from './data/templateContentsData.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cst-audit';

async function migrateData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing configuration data...');
    await AuditStructure.deleteMany({});
    await EvidenceRequirement.deleteMany({});
    await FormTypeDefinition.deleteMany({});
    await EvidenceMapping.deleteMany({});
    await StaticEvidenceControl.deleteMany({});
    await TemplateOnlyControl.deleteMany({});
    await TemplateContent.deleteMany({});
    console.log('✅ Cleared existing data');

    // Migrate Audit Structure
    console.log('\n📊 Migrating Audit Structure...');
    await AuditStructure.insertMany(auditStructureData);
    console.log(`✅ Migrated ${auditStructureData.length} categories`);

    // Migrate Evidence Requirements
    console.log('\n📋 Migrating Evidence Requirements...');
    await EvidenceRequirement.insertMany(evidenceRequirementsData);
    console.log(`✅ Migrated ${evidenceRequirementsData.length} evidence requirements`);

    // Migrate Form Type Definitions
    console.log('\n📝 Migrating Form Type Definitions...');
    await FormTypeDefinition.insertMany(formTypeDefinitionsData);
    console.log(`✅ Migrated ${formTypeDefinitionsData.length} form types`);

    // Migrate Evidence Mapping
    console.log('\n🔗 Migrating Evidence Mappings...');
    await EvidenceMapping.insertMany(evidenceMappingData);
    console.log(`✅ Migrated ${evidenceMappingData.length} evidence mappings`);

    // Migrate Static Evidence Controls
    console.log('\n📸 Migrating Static Evidence Controls...');
    await StaticEvidenceControl.insertMany(staticEvidenceControlsData);
    console.log(`✅ Migrated ${staticEvidenceControlsData.length} static evidence controls`);

    // Migrate Template-Only Controls
    console.log('\n📄 Migrating Template-Only Controls...');
    await TemplateOnlyControl.insertMany(templateOnlyControlsData);
    console.log(`✅ Migrated ${templateOnlyControlsData.length} template-only controls`);

    // Migrate Template Contents
    console.log('\n📑 Migrating Template Contents...');
    await TemplateContent.insertMany(templateContentsData);
    console.log(`✅ Migrated ${templateContentsData.length} template contents`);

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Audit Categories: ${auditStructureData.length}`);
    console.log(`   - Evidence Requirements: ${evidenceRequirementsData.length}`);
    console.log(`   - Form Types: ${formTypeDefinitionsData.length}`);
    console.log(`   - Evidence Mappings: ${evidenceMappingData.length}`);
    console.log(`   - Static Evidence Controls: ${staticEvidenceControlsData.length}`);
    console.log(`   - Template-Only Controls: ${templateOnlyControlsData.length}`);
    console.log(`   - Template Contents: ${templateContentsData.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run migration
migrateData();
