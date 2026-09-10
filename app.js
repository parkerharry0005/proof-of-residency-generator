// Initialize jsPDF
const { jsPDF } = window.jspdf;

// DOM Elements
const stateSelect = document.getElementById('stateSelect');
const affiantName = document.getElementById('affiantName');
const residentName = document.getElementById('residentName');
const address = document.getElementById('address');
const moveDate = document.getElementById('moveDate');
const purpose = document.getElementById('purpose');
const preview = document.getElementById('documentPreview');
const downloadBtn = document.getElementById('downloadBtn');

// Helper to format date
function formatDate(dateStr) {
  if (!dateStr) return "[Move-In Date]";
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Generate Raw Document Text
function generateDocumentText() {
  const state = stateSelect.value || "California";
  const affiant = affiantName.value.trim() || "[Landlord / Host Name]";
  const resident = residentName.value.trim() || "[Resident Name]";
  const addr = address.value.trim() || "[Full Address, City, State, ZIP]";
  const mDate = formatDate(moveDate.value);
  const purp = purpose.value || "DMV / Driver's License";
  const today = getTodayFormatted();

  return `AFFIDAVIT OF RESIDENCE / PROOF OF RESIDENCY LETTER
State of: ${state}

Date: ${today}

To Whom It May Concern,

I, ${affiant}, hereby declare under penalty of perjury that I am the legal owner or primary tenant of the residence situated at:

${addr}

I hereby confirm and certify that ${resident} resides with me at this address as a full-time resident, having established residency on ${mDate}.

This affidavit is being provided for the purpose of: ${purp}.

I swear or affirm under penalty of perjury that the statements above are true and correct to the best of my knowledge.

___________________________________
Signature of Affiant (Owner / Host)

___________________________________
Printed Name of Affiant


---------------------------------------------------
NOTARY ACKNOWLEDGMENT (IF REQUIRED)

State of ${state}, County of ___________________

Subscribed and sworn to before me on this _____ day of ____________, 20____, 
by ___________________________________.

___________________________________
Notary Public Signature & Seal`;
}

// Update Live Text Preview Fast
function updatePreview() {
  if (preview) {
    preview.innerText = generateDocumentText();
  }
}

// Debounce Utility to Prevent UI Lag
function debounce(func, delay = 250) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedUpdate = debounce(updatePreview, 200);

// Attach Fast Event Listeners
[stateSelect, affiantName, residentName, address, moveDate, purpose].forEach(element => {
  if (element) {
    element.addEventListener('input', debouncedUpdate);
    element.addEventListener('change', updatePreview);
  }
});

// PDF Generation Function on Button Click
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });

    const content = generateDocumentText();
    
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    
    // Split text to fit PDF printable area
    const splitText = doc.splitTextToSize(content, 500);
    doc.text(splitText, 56, 60);

    const fileName = `Proof_of_Residency_${residentName.value.trim().replace(/\s+/g, '_') || 'Affidavit'}.pdf`;
    doc.save(fileName);
  });
}

// Initial Load
updatePreview();
