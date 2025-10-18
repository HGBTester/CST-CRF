import { getCustomTemplate } from '../data/customTemplates';

const generateApprovalSection = () => `
  <div class="mt-12">
    <h2>Document Approval</h2>
    <div class="grid grid-cols-2 gap-6 mt-6">
      <div class="signature-box">
        <h3 class="text-lg font-semibold mb-4">Prepared By</h3>
        <p><strong>Name:</strong> <span class="border-b-2 border-gray-400 inline-block w-64 ml-2"></span></p>
        <p class="mt-3"><strong>Position:</strong> Cybersecurity Manager</p>
        <p class="mt-3"><strong>Signature:</strong> <span class="border-b-2 border-gray-400 inline-block w-64 ml-2"></span></p>
        <p class="mt-3"><strong>Date:</strong> <span class="border-b-2 border-gray-400 inline-block w-48 ml-2"></span></p>
      </div>
      
      <div class="signature-box">
        <h3 class="text-lg font-semibold mb-4">Reviewed By</h3>
        <p><strong>Name:</strong> <span class="border-b-2 border-gray-400 inline-block w-64 ml-2"></span></p>
        <p class="mt-3"><strong>Position:</strong> Chief Information Security Officer</p>
        <p class="mt-3"><strong>Signature:</strong> <span class="border-b-2 border-gray-400 inline-block w-64 ml-2"></span></p>
        <p class="mt-3"><strong>Date:</strong> <span class="border-b-2 border-gray-400 inline-block w-48 ml-2"></span></p>
      </div>
    </div>
    
    <div class="signature-box mt-6">
      <h3 class="text-lg font-semibold mb-4">Approved By Top Management</h3>
      <p><strong>Name:</strong> <span class="border-b-2 border-gray-400 inline-block w-64 ml-2"></span></p>
      <p class="mt-3"><strong>Position:</strong> Chief Executive Officer</p>
      <p class="mt-3"><strong>Signature:</strong> <span class="border-b-2 border-gray-400 inline-block w-64 ml-2"></span></p>
      <p class="mt-3"><strong>Date:</strong> <span class="border-b-2 border-gray-400 inline-block w-48 ml-2"></span></p>
      <div class="stamp-box mt-6">
        <p class="text-gray-500 text-xl font-bold">COMPANY STAMP</p>
        <p class="text-sm text-gray-400 mt-2">(Official company seal to be affixed here)</p>
      </div>
    </div>
  </div>
`;

export const generateDocument = (category, subcategory, item) => {
  // Check if there's a custom template for this control
  const customTemplate = getCustomTemplate(item.id);
  
  if (customTemplate) {
    // Use custom template content
    return customTemplate.content + generateApprovalSection();
  }
  
  // Otherwise, generate default template
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return `
    <div class="document-content">
      <div class="header-section mb-8 text-center border-b-4 border-blue-600 pb-6">
        <h1 class="text-4xl font-bold text-blue-900 mb-2">L3 Company</h1>
        <h2 class="text-2xl text-blue-700 mb-4">${category}</h2>
        <h3 class="text-xl text-gray-700">${item.name}</h3>
      </div>

      <div class="document-info bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-8 shadow">
        <div class="grid grid-cols-2 gap-4">
          <div><strong class="text-blue-900">Document ID:</strong> L3-${item.id.replace(/\./g, '-')}</div>
          <div><strong class="text-blue-900">Version:</strong> 1.0</div>
          <div><strong class="text-blue-900">Control Level:</strong> ${item.level}</div>
          <div><strong class="text-blue-900">Effective Date:</strong> ${currentDate}</div>
          <div class="col-span-2"><strong class="text-blue-900">Category:</strong> ${subcategory}</div>
        </div>
      </div>

      <h2>1. Purpose</h2>
      <p>This document outlines the requirements and procedures for <strong>${item.name}</strong> as part of L3 Company's CST-CRF compliance program.</p>

      <h2>2. Scope</h2>
      <p>This document applies to all information assets, systems, personnel, and processes within L3 Company that are relevant to ${subcategory.toLowerCase()}.</p>

      <h2>3. Regulatory Requirements</h2>
      <ul>
        <li>CST-CRF (Communications and Information Technology Commission - Cybersecurity Regulatory Framework)</li>
        <li>Compliance Level: ${item.level}</li>
        <li>National Cybersecurity Authority (NCA) Essential Controls</li>
        <li>Relevant Saudi Arabian cybersecurity regulations</li>
      </ul>

      <h2>4. Responsibilities</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Responsibility</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Chief Executive Officer (CEO)</td>
            <td>Overall accountability and final approval</td>
          </tr>
          <tr>
            <td>Chief Information Security Officer (CISO)</td>
            <td>Oversight and review of implementation</td>
          </tr>
          <tr>
            <td>Cybersecurity Manager</td>
            <td>Document preparation and implementation coordination</td>
          </tr>
          <tr>
            <td>Department Heads</td>
            <td>Ensure compliance within their departments</td>
          </tr>
          <tr>
            <td>All Personnel</td>
            <td>Adhere to requirements and report non-compliance</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Implementation Requirements</h2>
      <h3>5.1 Core Requirements</h3>
      <ul>
        <li>Document and define clear requirements for ${item.name}</li>
        <li>Obtain top management approval before implementation</li>
        <li>Implement appropriate technical and administrative controls</li>
        <li>Maintain evidence of implementation and effectiveness</li>
        <li>Integrate with existing cybersecurity processes</li>
      </ul>

      <h3>5.2 Documentation Requirements</h3>
      <p>The following documentation shall be maintained:</p>
      <ul>
        <li>Policies and procedures</li>
        <li>Implementation evidence (screenshots, logs, configurations)</li>
        <li>Training records and attendance sheets</li>
        <li>Audit reports and compliance assessments</li>
        <li>Incident reports and lessons learned</li>
      </ul>

      <h2>6. Evidence Collection</h2>
      <p>To demonstrate compliance with this control, the following evidence shall be collected and maintained:</p>
      <table>
        <thead>
          <tr>
            <th>Evidence Type</th>
            <th>Description</th>
            <th>Frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Approved Documents</td>
            <td>Policies, procedures, and requirements with signatures and stamps</td>
            <td>Upon creation/update</td>
          </tr>
          <tr>
            <td>Implementation Evidence</td>
            <td>Screenshots, configurations, system logs</td>
            <td>Ongoing</td>
          </tr>
          <tr>
            <td>Review Records</td>
            <td>Meeting minutes, review reports, audit findings</td>
            <td>As per schedule</td>
          </tr>
          <tr>
            <td>Training Records</td>
            <td>Attendance sheets, certificates, test results</td>
            <td>Per training session</td>
          </tr>
        </tbody>
      </table>

      <h2>7. Monitoring and Review</h2>
      <h3>7.1 Performance Indicators</h3>
      <p>The following KPIs shall be tracked:</p>
      <ul>
        <li>Compliance rate with requirements</li>
        <li>Number of non-conformities identified</li>
        <li>Time to remediate identified gaps</li>
        <li>Training completion rates</li>
      </ul>

      <h3>7.2 Review Schedule</h3>
      <ul>
        <li><strong>Quarterly:</strong> Operational effectiveness review</li>
        <li><strong>Annually:</strong> Comprehensive document review and update</li>
        <li><strong>Ad-hoc:</strong> Following significant incidents or regulatory changes</li>
      </ul>

      <h2>8. Continuous Improvement</h2>
      <p>This document and associated processes shall be continuously improved through:</p>
      <ul>
        <li>Regular effectiveness assessments</li>
        <li>Incorporation of lessons learned from incidents</li>
        <li>Updates based on regulatory changes</li>
        <li>Feedback from internal and external audits</li>
        <li>Industry best practices adoption</li>
      </ul>

      <h2>9. Related Documents</h2>
      <ul>
        <li>L3 Cybersecurity Strategy</li>
        <li>L3 Information Security Policy</li>
        <li>L3 Risk Management Framework</li>
        <li>L3 Incident Response Plan</li>
        <li>Relevant CST-CRF control documents</li>
      </ul>

      <h2>10. Version History</h2>
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Date</th>
            <th>Changes</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.0</td>
            <td>${currentDate}</td>
            <td>Initial document creation</td>
            <td>Cybersecurity Team</td>
          </tr>
        </tbody>
      </table>

      ${generateApprovalSection()}
    </div>
  `;
};
