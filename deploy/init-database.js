#!/usr/bin/env node

/**
 * CST Audit System - Database Initialization Script
 * This script initializes the MongoDB database with required data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

// Import models
const User = require('../backend/models/User');
const AuditStructure = require('../backend/models/AuditStructure');
const FormTypeDefinition = require('../backend/models/FormTypeDefinition');
const EvidenceMapping = require('../backend/models/EvidenceMapping');
const EvidenceRequirement = require('../backend/models/EvidenceRequirement');
const TemplateContent = require('../backend/models/TemplateContent');

// Import data
const auditStructureData = require('../backend/scripts/data/auditStructureData');
const formTypeDefinitionsData = require('../backend/scripts/data/formTypeDefinitionsData');
const evidenceMappingData = require('../backend/scripts/data/evidenceMappingData');
const evidenceRequirementsData = require('../backend/scripts/data/evidenceRequirementsData');
const templateContentsData = require('../backend/scripts/data/templateContentsData');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Helper function for colored console output
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Progress bar helper
function progressBar(current, total, label = '') {
    const barLength = 30;
    const progress = Math.round((current / total) * barLength);
    const bar = '█'.repeat(progress) + '░'.repeat(barLength - progress);
    const percentage = Math.round((current / total) * 100);
    process.stdout.write(`\r${label} [${bar}] ${percentage}% (${current}/${total})`);
    if (current === total) console.log(''); // New line when complete
}

// Main initialization function
async function initializeDatabase() {
    log('\n╔══════════════════════════════════════════════════╗', 'cyan');
    log('║     CST Audit System - Database Initialization    ║', 'cyan');
    log('╚══════════════════════════════════════════════════╝\n', 'cyan');

    try {
        // Connect to MongoDB
        log('Connecting to MongoDB...', 'yellow');
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cst-audit';

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        log('✓ Connected to MongoDB\n', 'green');

        // Check if database already has data
        const existingUsers = await User.countDocuments();
        const existingAudit = await AuditStructure.countDocuments();

        if (existingUsers > 0 || existingAudit > 0) {
            log('⚠ Database already contains data!', 'yellow');

            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const answer = await new Promise(resolve => {
                rl.question('Do you want to reset and reinitialize? (yes/no): ', resolve);
            });
            rl.close();

            if (answer.toLowerCase() !== 'yes') {
                log('Initialization cancelled by user', 'yellow');
                process.exit(0);
            }

            log('\nDropping existing collections...', 'yellow');
            await mongoose.connection.db.dropDatabase();
            log('✓ Database reset complete\n', 'green');
        }

        // Initialize collections
        let totalOperations = 6;
        let currentOperation = 0;

        // 1. Create admin user
        currentOperation++;
        log(`[${currentOperation}/${totalOperations}] Creating admin user...`, 'blue');

        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminUser = await User.create({
            username: process.env.ADMIN_USERNAME || 'admin',
            password: hashedPassword,
            email: process.env.ADMIN_EMAIL || 'admin@cst-audit.local',
            role: 'admin',
            firstName: 'System',
            lastName: 'Administrator',
            isActive: true,
            createdAt: new Date()
        });

        log(`✓ Admin user created (username: ${adminUser.username})\n`, 'green');

        // 2. Create additional users
        currentOperation++;
        log(`[${currentOperation}/${totalOperations}] Creating additional users...`, 'blue');

        const additionalUsers = [
            {
                username: 'auditor',
                password: await bcrypt.hash('auditor123', 10),
                email: 'auditor@cst-audit.local',
                role: 'auditor',
                firstName: 'John',
                lastName: 'Auditor',
                isActive: true
            },
            {
                username: 'viewer',
                password: await bcrypt.hash('viewer123', 10),
                email: 'viewer@cst-audit.local',
                role: 'viewer',
                firstName: 'Jane',
                lastName: 'Viewer',
                isActive: true
            }
        ];

        await User.insertMany(additionalUsers);
        log(`✓ Additional users created (${additionalUsers.length} users)\n`, 'green');

        // 3. Initialize audit structure
        currentOperation++;
        log(`[${currentOperation}/${totalOperations}] Loading audit structure...`, 'blue');

        // Process audit structure data with progress
        const totalAuditItems = auditStructureData.length;
        for (let i = 0; i < totalAuditItems; i++) {
            await AuditStructure.create(auditStructureData[i]);
            progressBar(i + 1, totalAuditItems, 'Audit Structure');
        }

        log(`✓ Audit structure initialized (${totalAuditItems} items)\n`, 'green');

        // 4. Initialize form type definitions
        currentOperation++;
        log(`[${currentOperation}/${totalOperations}] Loading form type definitions...`, 'blue');

        const totalFormTypes = formTypeDefinitionsData.length;
        for (let i = 0; i < totalFormTypes; i++) {
            await FormTypeDefinition.create(formTypeDefinitionsData[i]);
            progressBar(i + 1, totalFormTypes, 'Form Types    ');
        }

        log(`✓ Form type definitions initialized (${totalFormTypes} types)\n`, 'green');

        // 5. Initialize evidence mappings
        currentOperation++;
        log(`[${currentOperation}/${totalOperations}] Loading evidence mappings...`, 'blue');

        await EvidenceMapping.insertMany(evidenceMappingData);
        log(`✓ Evidence mappings initialized (${evidenceMappingData.length} mappings)\n`, 'green');

        // 6. Initialize evidence requirements
        currentOperation++;
        log(`[${currentOperation}/${totalOperations}] Loading evidence requirements...`, 'blue');

        const totalRequirements = evidenceRequirementsData.length;
        for (let i = 0; i < totalRequirements; i++) {
            await EvidenceRequirement.create(evidenceRequirementsData[i]);
            progressBar(i + 1, totalRequirements, 'Requirements  ');
        }

        log(`✓ Evidence requirements initialized (${totalRequirements} requirements)\n`, 'green');

        // Initialize template contents (if available)
        if (templateContentsData && templateContentsData.length > 0) {
            log('Loading template contents...', 'blue');
            await TemplateContent.insertMany(templateContentsData);
            log(`✓ Template contents initialized (${templateContentsData.length} templates)\n`, 'green');
        }

        // Display summary
        log('\n╔══════════════════════════════════════════════════╗', 'green');
        log('║          Database Initialization Complete!        ║', 'green');
        log('╚══════════════════════════════════════════════════╝\n', 'green');

        // Display statistics
        const stats = await getStatistics();
        log('📊 Database Statistics:', 'cyan');
        log('─────────────────────', 'cyan');
        Object.entries(stats).forEach(([key, value]) => {
            const label = key.padEnd(25, '.');
            log(`  ${label} ${value}`, 'bright');
        });

        // Display login credentials
        log('\n🔐 Login Credentials:', 'cyan');
        log('─────────────────────', 'cyan');
        log('  Admin User:', 'bright');
        log(`    Username: ${process.env.ADMIN_USERNAME || 'admin'}`, 'bright');
        log(`    Password: ${adminPassword}`, 'bright');
        log('\n  Auditor User:', 'bright');
        log('    Username: auditor', 'bright');
        log('    Password: auditor123', 'bright');
        log('\n  Viewer User:', 'bright');
        log('    Username: viewer', 'bright');
        log('    Password: viewer123', 'bright');

        log('\n✅ Database is ready for use!', 'green');
        log('You can now start the application.\n', 'green');

        process.exit(0);

    } catch (error) {
        log('\n❌ Database initialization failed!', 'red');
        log(`Error: ${error.message}`, 'red');

        if (error.code === 'ECONNREFUSED') {
            log('\n💡 Troubleshooting tips:', 'yellow');
            log('  1. Make sure MongoDB is installed and running', 'yellow');
            log('  2. Check if MongoDB is listening on the correct port', 'yellow');
            log('  3. Verify the MONGODB_URI in your .env file', 'yellow');
            log('  4. Try: sudo systemctl start mongod (Linux)', 'yellow');
            log('  5. Try: brew services start mongodb-community (macOS)', 'yellow');
        }

        process.exit(1);
    }
}

// Get database statistics
async function getStatistics() {
    const stats = {
        'Total Users': await User.countDocuments(),
        'Admin Users': await User.countDocuments({ role: 'admin' }),
        'Audit Categories': await AuditStructure.countDocuments({ level: 'category' }),
        'Audit Subcategories': await AuditStructure.countDocuments({ level: 'subcategory' }),
        'Audit Controls': await AuditStructure.countDocuments({ level: 'control' }),
        'Form Type Definitions': await FormTypeDefinition.countDocuments(),
        'Evidence Mappings': await EvidenceMapping.countDocuments(),
        'Evidence Requirements': await EvidenceRequirement.countDocuments(),
        'Template Contents': await TemplateContent.countDocuments()
    };

    return stats;
}

// Handle cleanup on exit
process.on('SIGINT', async () => {
    log('\n\nInterrupted by user', 'yellow');
    await mongoose.connection.close();
    process.exit(1);
});

// Run initialization
initializeDatabase();