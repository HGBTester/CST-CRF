# PowerShell Script to Import Evidence into MongoDB
# Reads Word documents, extracts content, and imports to database

param(
    [string]$MongoURI = "mongodb://localhost:27017/cst-audit",
    [switch]$DryRun = $false
)

Write-Host "🔍 CST Evidence Import Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Evidence folders
$evidenceFolders = @(
    "c:\Users\hgb_m\Downloads\CODING\CST Older Files\1-Governance\Evidence Folder 1",
    "c:\Users\hgb_m\Downloads\CODING\CST Older Files\2-Asset Management\Evidence Folder 2",
    "c:\Users\hgb_m\Downloads\CODING\CST Older Files\3-Cybersecurity Risk Management\Evidence Folder 3",
    "c:\Users\hgb_m\Downloads\CODING\CST Older Files\4-Logical Security\Evidence Folder 4",
    "c:\Users\hgb_m\Downloads\CODING\CST Older Files\5-Physical Security\Evidence Folder 5",
    "c:\Users\hgb_m\Downloads\CODING\CST Older Files\6-Third Party Security\Evidence Folder 6"
)

# Category mapping
$categoryMap = @{
    "1-Governance" = "Governance"
    "2-Asset Management" = "Asset Management"
    "3-Cybersecurity Risk Management" = "Cybersecurity Risk Management"
    "4-Logical Security" = "Logical Security"
    "5-Physical Security" = "Physical Security"
    "6-Third Party Security" = "Third Party Security"
}

# Initialize Word COM object
Write-Host "📄 Initializing Microsoft Word..." -ForegroundColor Yellow
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    Write-Host "✅ Word initialized successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to initialize Word. Make sure Microsoft Word is installed." -ForegroundColor Red
    exit 1
}

# Function to extract text from Word document
function Get-WordDocumentText {
    param([string]$filePath)
    
    try {
        $doc = $word.Documents.Open($filePath, $false, $true)
        $text = $doc.Content.Text
        $doc.Close($false)
        return $text.Substring(0, [Math]::Min(2000, $text.Length))  # First 2000 chars
    } catch {
        Write-Host "  ⚠️ Could not read: $filePath" -ForegroundColor Yellow
        return $null
    }
}

# Collect all evidence
$allEvidence = @()
$stats = @{
    totalFiles = 0
    wordDocs = 0
    images = 0
    excel = 0
    controls = @{}
}

Write-Host ""
Write-Host "📂 Scanning evidence folders..." -ForegroundColor Cyan

foreach ($folder in $evidenceFolders) {
    if (-not (Test-Path $folder)) {
        Write-Host "  ⚠️ Folder not found: $folder" -ForegroundColor Yellow
        continue
    }

    $categoryFolder = Split-Path (Split-Path $folder -Parent) -Leaf
    $category = $categoryMap[$categoryFolder]

    Write-Host ""
    Write-Host "  📁 $category" -ForegroundColor White
    
    $files = Get-ChildItem -Path $folder -File
    
    foreach ($file in $files) {
        $stats.totalFiles++
        
        # Extract control ID from filename
        if ($file.Name -match '^(\d+\.\d+\.\d+)') {
            $controlId = $Matches[1]
            
            if (-not $stats.controls.ContainsKey($controlId)) {
                $stats.controls[$controlId] = @{
                    files = @()
                    category = $category
                }
            }

            $fileInfo = @{
                fileName = $file.Name
                filePath = $file.FullName
                fileSize = $file.Length
                fileType = $file.Extension.TrimStart('.')
                isPrimary = ($file.Extension -eq '.docx' -or $file.Extension -eq '.doc')
            }

            # Extract content from Word documents
            if ($file.Extension -eq '.docx' -or $file.Extension -eq '.doc') {
                $stats.wordDocs++
                Write-Host "    📄 Reading: $($file.Name)" -ForegroundColor Gray
                
                $content = Get-WordDocumentText -filePath $file.FullName
                if ($content) {
                    $fileInfo.contentSummary = $content
                }
            }
            elseif ($file.Extension -match '\.(jpg|jpeg|png)') {
                $stats.images++
            }
            elseif ($file.Extension -eq '.xlsx') {
                $stats.excel++
            }

            $stats.controls[$controlId].files += $fileInfo
        }
    }
}

# Close Word
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null

Write-Host ""
Write-Host "📊 Analysis Complete!" -ForegroundColor Green
Write-Host "  Total Files: $($stats.totalFiles)" -ForegroundColor White
Write-Host "  Word Documents: $($stats.wordDocs)" -ForegroundColor White
Write-Host "  Images: $($stats.images)" -ForegroundColor White
Write-Host "  Excel Files: $($stats.excel)" -ForegroundColor White
Write-Host "  Controls with Evidence: $($stats.controls.Count)" -ForegroundColor White

# Generate JSON for import
$importData = @()

foreach ($controlId in $stats.controls.Keys | Sort-Object) {
    $evidence = $stats.controls[$controlId]
    
    $importData += @{
        controlId = $controlId
        category = $evidence.category
        files = $evidence.files
        status = "existing"
        source = "imported"
        importDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        auditReady = $true
    }
}

# Save to JSON file
$outputPath = Join-Path (Split-Path $PSScriptRoot -Parent) "..\EVIDENCE_IMPORT_READY.json"
$importData | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host ""
Write-Host "✅ Import data saved to: $outputPath" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review the JSON file" -ForegroundColor White
Write-Host "  2. Run: node import-to-mongodb.js" -ForegroundColor White
Write-Host "  3. Verify in webapp" -ForegroundColor White
Write-Host ""
Write-Host "🎯 $($importData.Count) controls ready for import!" -ForegroundColor Green
