function updatePreview() {
  const state = document.getElementById('state').value;
  const affiant = document.getElementById('affiantName').value || '[Landlord / Host Name]';
  const resident = document.getElementById('residentName').value || '[Resident Name]';
  const address = document.getElementById('address').value || '[Full Address, City, State, ZIP]';
  const moveInDate = document.getElementById('moveInDate').value || '[Move-In Date]';
  const purpose = document.getElementById('purpose').value;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const previewText = 
`AFFIDAVIT OF RESIDENCE / PROOF OF RESIDENCY LETTER
State of: ${state}

Date: ${today}

To Whom It May Concern,

I, ${affiant}, hereby declare under penalty of perjury that I am the legal owner/primary tenant of the residence situated at:

${address}

I hereby confirm and certify that ${resident} resides with me at this address as a full-time resident, having established residency on ${moveInDate}.

This affidavit is being provided for the purpose of: ${purpose}.

I swear under penalty of perjury that the statements above are true and accurate to the best of my knowledge.

_______________________________________
Signature of Affiant (Host/Owner)


NOTARY PUBLIC ACKNOWLEDGMENT BLOCK
State of ___________, County of ___________
Subscribed and sworn to before me on this _____ day of ____________, 20____.

_______________________________________
Notary Public Signature & Seal`;

  document.getElementById('documentPreview').innerText = previewText;
}

document.querySelectorAll('#residencyForm input, #residencyForm select').forEach(element => {
  element.addEventListener('input', updatePreview);
});

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const state = document.getElementById('state').value;
  const affiant = document.getElementById('affiantName').value;
  const resident = document.getElementById('residentName').value;
  const address = document.getElementById('address').value;
  const moveInDate = document.getElementById('moveInDate').value;
  const purpose = document.getElementById('purpose').value;

  if (!affiant || !resident || !address || !moveInDate) {
    alert('Please fill out all required fields before generating the PDF.');
    return;
  }

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("AFFIDAVIT OF RESIDENCE", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`State of: ${state}`, 20, 32);
  doc.text(`Date: ${today}`, 150, 32);

  doc.text("To Whom It May Concern,", 20, 45);

  const bodyText = `I, ${affiant}, hereby declare under penalty of perjury that I am the legal property owner or primary leaseholder of the residential address located at:\n\n${address}\n\nI confirm that ${resident} resides with me at this residential address as a full-time resident, having moved in on ${moveInDate}.\n\nThis Affidavit of Residence is submitted as official proof of address for the purpose of: ${purpose}.\n\nI declare under penalty of perjury under the laws of the State of ${state} that the information provided above is true, correct, and complete.`;

  const splitText = doc.splitTextToSize(bodyText, 170);
  doc.text(splitText, 20, 55);

  let yPos = 135;
  doc.text("_______________________________________", 20, yPos);
  doc.text(`Signature of Affiant (${affiant})`, 20, yPos + 6);

  yPos += 30;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);

  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("NOTARY PUBLIC ACKNOWLEDGMENT", 20, yPos);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("State of ___________________, County of ___________________", 20, yPos + 10);
  doc.text("Subscribed and sworn to before me on this _____ day of ____________, 20____,", 20, yPos + 18);
  doc.text("by ___________________________________ (Affiant Name), proved to me on basis of satisfactory evidence.", 20, yPos + 26);

  doc.text("_______________________________________", 20, yPos + 45);
  doc.text("Notary Public Signature", 20, yPos + 51);

  doc.rect(140, yPos + 35, 45, 25);
  doc.text("[ Place Seal Here ]", 143, yPos + 49);

  doc.save(`Proof_of_Residency_${resident.replace(/\s+/g, '_')}.pdf`);
}

updatePreview();