import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Evidence folder paths
const evidenceFolders = [
  'c:\\Users\\hgb_m\\Downloads\\CODING\\CST Older Files\\1-Governance\\Evidence Folder 1',
  'c:\\Users\\hgb_m\\Downloads\\CODING\\CST Older Files\\2-Asset Management\\Evidence Folder 2',
  'c:\\Users\\hgb_m\\Downloads\\CODING\\CST Older Files\\3-Cybersecurity Risk Management\\Evidence Folder 3',
  'c:\\Users\\hgb_m\\Downloads\\CODING\\CST Older Files\\4-Logical Security\\Evidence Folder 4',
  'c:\\Users\\hgb_m\\Downloads\\CODING\\CST Older Files\\5-Physical Security\\Evidence Folder 5',
  'c:\\Users\\hgb_m\\Downloads\\CODING\\CST Older Files\\6-Third Party Security\\Evidence Folder 6'
];

// CST-CRF Control Structure (simplified)
const controlStructure = {
  'Governance': ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'],
  'Asset Management': ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'],
  'Risk Management': ['3.1', '3.2'],
  'Logical Security': ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12', '4.13', '4.14', '4.15', '4.16'],
  'Physical Security': ['5.1', '5.2'],
  'Third Party Security': ['6.1', '6.2']
};

// Analyze evidence files
function analyzeEvidenceFolders() {
  const results = {
    totalFiles: 0,
    byCategory: {},
    byType: { docx: 0, xlsx: 0, jpeg: 0, png: 0, jpg: 0, doc: 0, other: 0 },
    controlCoverage: {},
    fileList: []
  };

  evidenceFolders.forEach((folderPath, index) => {
    const categoryName = path.basename(path.dirname(folderPath));
    
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Folder not found: ${folderPath}`);
      return;
    }

    const files = fs.readdirSync(folderPath);
    const categoryFiles = [];

    files.forEach(file => {
      const ext = path.extname(file).toLowerCase().replace('.', '');
      const fullPath = path.join(folderPath, file);
      const stats = fs.statSync(fullPath);

      if (stats.isFile()) {
        results.totalFiles++;
        results.byType[ext] = (results.byType[ext] || 0) + 1;

        // Extract control ID from filename (e.g., 1.1.1.docx → 1.1.1)
        const controlMatch = file.match(/^(\d+\.\d+\.\d+)/);
        const controlId = controlMatch ? controlMatch[1] : null;

        const fileInfo = {
          fileName: file,
          controlId,
          category: categoryName,
          extension: ext,
          size: stats.size,
          path: fullPath
        };

        categoryFiles.push(fileInfo);

        if (controlId) {
          if (!results.controlCoverage[controlId]) {
            results.controlCoverage[controlId] = [];
          }
          results.controlCoverage[controlId].push(fileInfo);
        }
      }
    });

    results.byCategory[categoryName] = {
      count: categoryFiles.length,
      files: categoryFiles
    };
  });

  return results;
}

// Generate import script for MongoDB
function generateImportData(analysis) {
  const importData = [];

  Object.entries(analysis.controlCoverage).forEach(([controlId, files]) => {
    const mainFile = files.find(f => f.extension === 'docx') || files[0];
    
    importData.push({
      controlId,
      evidenceFiles: files.map(f => ({
        fileName: f.fileName,
        type: f.extension,
        size: f.size,
        path: f.path,
        isPrimary: f === mainFile
      })),
      status: 'existing',
      importDate: new Date().toISOString()
    });
  });

  return importData;
}

// Main execution
console.log('🔍 Analyzing Evidence Files...\n');

const analysis = analyzeEvidenceFolders();

console.log('📊 Analysis Results:');
console.log('='.repeat(50));
console.log(`Total Files: ${analysis.totalFiles}`);
console.log(`\nBy File Type:`);
Object.entries(analysis.byType).forEach(([type, count]) => {
  console.log(`  ${type.toUpperCase()}: ${count}`);
});

console.log(`\nBy Category:`);
Object.entries(analysis.byCategory).forEach(([category, data]) => {
  console.log(`  ${category}: ${data.count} files`);
});

console.log(`\nControl Coverage: ${Object.keys(analysis.controlCoverage).length} controls have evidence`);

// Save detailed results
const outputPath = path.join(__dirname, '..', '..', 'EVIDENCE_ANALYSIS_DETAILED.json');
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
console.log(`\n✅ Detailed analysis saved to: ${outputPath}`);

// Generate import data
const importData = generateImportData(analysis);
const importPath = path.join(__dirname, '..', '..', 'EVIDENCE_IMPORT_DATA.json');
fs.writeFileSync(importPath, JSON.stringify(importData, null, 2));
console.log(`✅ Import data generated: ${importPath}`);

console.log('\n📝 Summary:');
console.log(`  - ${importData.length} controls have evidence ready for import`);
console.log(`  - ${analysis.totalFiles} total evidence files identified`);
console.log(`  - ${analysis.byType.docx + analysis.byType.doc} Word documents`);
console.log(`  - ${analysis.byType.jpeg + analysis.byType.jpg + analysis.byType.png} images`);
console.log(`  - ${analysis.byType.xlsx} Excel files`);

export { analyzeEvidenceFolders, generateImportData };
