import jsPDF from "jspdf";

export interface RTIPdfData {
  id: string;
  title: string;
  department: string;
  date: string;
  refNumber: string;
  description?: string;
  applicant?: string;
  response?: string[] | string;
}

async function loadAntonFont(doc: jsPDF): Promise<boolean> {
  try {
    const res = await fetch("/fonts/Anton-Regular.ttf");
    if (!res.ok) return false;
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Font = btoa(binary);
    doc.addFileToVFS("Anton-Regular.ttf", base64Font);
    doc.addFont("Anton-Regular.ttf", "Anton", "normal");
    return true;
  } catch (err) {
    console.warn("Unable to load Anton font into jsPDF:", err);
    return false;
  }
}

function renderParagraphWithBoldPrefix(
  doc: jsPDF,
  para: string,
  x: number,
  startY: number,
  maxWidth: number
): number {
  // Matches bold prefix like "1. GRAIN ALLOCATIONS & WAREHOUSING:"
  const match = para.match(/^([0-9]+\.\s+[^:]+:)\s*(.*)$/s);
  if (!match) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 45);
    const lines = doc.splitTextToSize(para, maxWidth);
    doc.text(lines, x, startY, { lineHeightFactor: 1.35 });
    return startY + lines.length * 4.2 + 3.5;
  }

  const prefix = match[1];
  const rest = match[2];

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 15, 15);
  const prefixWidth = doc.getTextWidth(prefix + " ");

  const firstLineAvailableWidth = maxWidth - prefixWidth;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 45);

  if (firstLineAvailableWidth < 30) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 15, 15);
    doc.text(prefix, x, startY);
    let curY = startY + 4.2;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 45);
    const restLines = doc.splitTextToSize(rest, maxWidth);
    restLines.forEach((line: string) => {
      doc.text(line, x, curY);
      curY += 4.2;
    });
    return curY + 3.5;
  }

  const words = rest.split(/\s+/);
  let remainingWords: string[] = [];
  let currentFirstLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentFirstLine ? currentFirstLine + " " + words[i] : words[i];
    if (doc.getTextWidth(testLine) <= firstLineAvailableWidth) {
      currentFirstLine = testLine;
    } else {
      remainingWords = words.slice(i);
      break;
    }
  }

  let curY = startY;

  // 1. Draw bold prefix
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 15, 15);
  doc.text(prefix, x, curY);

  // 2. Draw first line of body
  if (currentFirstLine) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 45);
    doc.text(currentFirstLine, x + prefixWidth, curY);
  }

  // 3. Draw remaining lines
  if (remainingWords.length > 0) {
    const remainingText = remainingWords.join(" ");
    const otherLines = doc.splitTextToSize(remainingText, maxWidth);
    otherLines.forEach((line: string) => {
      curY += 4.2;
      doc.text(line, x, curY);
    });
  }

  return curY + 4.5;
}

export async function generateAndOpenRtiPdf(report: RTIPdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Load the TrueType Anton font
  const hasAnton = await loadAntonFont(doc);

  // Helper to draw the standalone RTI logo icon in the top right corner (no text)
  const drawRtiLogo = (x: number, y: number, size: number = 4) => {
    doc.setFillColor(255, 90, 44); // #ff5a2c
    // Dot of 'i'
    doc.circle(x + size / 2, y + size / 2, size / 2, "F");
    // Stem of 'i'
    const gap = size * 0.25;
    doc.rect(x, y + size + gap, size, size * 2, "F");
  };

  // =========================================================================
  // PAGE 1: COVER PAGE - RTI LOGO (TOP RIGHT) & CENTERED DEPARTMENT NAME IN ANTON
  // =========================================================================

  // Top Accent Line
  doc.setFillColor(255, 90, 44);
  doc.rect(0, 0, pageWidth, 4, "F");

  // RTI Logo Icon at Top Right Corner
  drawRtiLogo(pageWidth - 20, 10, 4.5);

  // Exact Center of Page 1 (Lengthwise and Widthwise)
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  // Department Name in Anton font
  if (hasAnton) {
    doc.setFont("Anton", "normal");
  } else {
    doc.setFont("helvetica", "bold");
  }
  doc.setFontSize(28);
  doc.setTextColor(15, 15, 18);

  const deptUpper = (report.department || "PUBLIC AUTHORITY").toUpperCase();
  const deptLines = doc.splitTextToSize(deptUpper, pageWidth - 45);

  // Symmetrical Line and Block Spacing Calculation
  const lineHeight = 11;
  const numLines = deptLines.length;
  const halfTextSpan = ((numLines - 1) * lineHeight) / 2;
  const padding = 12; // Equal vertical distance between text bounds and accent lines

  const topLineY = centerY - halfTextSpan - padding;
  const bottomLineY = centerY + halfTextSpan + 8;

  // Small Top Label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(130, 130, 135);
  doc.text("RTI DISCLOSURE REPORT", centerX, topLineY - 7, { align: "center" });

  // Decorative Accent Top Line
  doc.setDrawColor(255, 90, 44);
  doc.setLineWidth(1.2);
  doc.line(centerX - 35, topLineY, centerX + 35, topLineY);

  // Render text lines with exact baseline centering between topLineY and bottomLineY
  if (hasAnton) {
    doc.setFont("Anton", "normal");
  } else {
    doc.setFont("helvetica", "bold");
  }
  doc.setFontSize(28);
  doc.setTextColor(15, 15, 18);

  deptLines.forEach((line: string, idx: number) => {
    const lineY = centerY - halfTextSpan + idx * lineHeight + 2.5;
    doc.text(line, centerX, lineY, { align: "center" });
  });

  // Decorative Accent Bottom Line (Symmetrical distance from centerY)
  doc.setDrawColor(255, 90, 44);
  doc.setLineWidth(1.2);
  doc.line(centerX - 35, bottomLineY, centerX + 35, bottomLineY);

  // Subtitle Underneath Department Name
  if (hasAnton) {
    doc.setFont("Anton", "normal");
    doc.setFontSize(13);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
  }
  doc.setTextColor(255, 90, 44);
  doc.text("RIGHT TO INFORMATION DISCLOSURE", centerX, bottomLineY + 11, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 115);
  doc.text(
    `Record Reference: ${report.refNumber}   •   Filing Date: ${report.date}`,
    centerX,
    bottomLineY + 18,
    { align: "center" }
  );

  // Page 1 Footer Prompt
  doc.setFontSize(8.5);
  doc.setTextColor(140, 140, 145);
  doc.text(
    "Turn to Page 2 for Application Particulars & Disclosure Details",
    centerX,
    pageHeight - 14,
    { align: "center" }
  );

  // =========================================================================
  // PAGE 2: STATUTORY DATA, PARTICULARS & RESPONSE CONTENT
  // =========================================================================
  doc.addPage();

  // Top Accent Line
  doc.setFillColor(255, 90, 44);
  doc.rect(0, 0, pageWidth, 4, "F");

  // Page 2 Top Right RTI Logo Icon
  drawRtiLogo(pageWidth - 20, 9, 3.5);

  // Page 2 Header
  if (hasAnton) {
    doc.setFont("Anton", "normal");
    doc.setFontSize(15);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
  }
  doc.setTextColor(15, 15, 15);
  doc.text("RTI INFORMATION DISCLOSURE REPORT", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 105);
  doc.text(`Ref: ${report.refNumber}   |   Department: ${report.department}`, 20, 26);

  doc.setDrawColor(220, 220, 225);
  doc.line(20, 30, pageWidth - 20, 30);

  // Application Particulars Table Box
  const startY = 36;
  const col1X = 20;
  const col2X = 75;
  const rowH = 7.5;

  const rows = [
    ["Registration Number", report.refNumber],
    ["Public Authority", report.department],
    ["Subject Matter", report.title],
    ["Applicant Name", report.applicant || "Applicant"],
    ["Filing Date", report.date],
    ["Status", "Information Furnished (Demo)"],
    ["Fee Realization", "INR 10.00 (Mock Transaction)"],
  ];

  rows.forEach(([label, val], idx) => {
    const y = startY + idx * rowH;
    doc.setFillColor(
      idx % 2 === 0 ? 252 : 246,
      idx % 2 === 0 ? 252 : 246,
      idx % 2 === 0 ? 252 : 246
    );
    doc.rect(col1X, y - 4.5, pageWidth - 40, rowH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 75);
    doc.text(label, col1X + 4, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    doc.text(val, col2X, y, { maxWidth: pageWidth - col2X - 25 });
  });

  // Query Summary Box
  const queryBoxY = startY + rows.length * rowH + 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text("ORIGINAL QUERY SOUGHT BY APPLICANT", 20, queryBoxY);

  doc.setFillColor(250, 250, 252);
  doc.setDrawColor(230, 230, 235);
  doc.roundedRect(20, queryBoxY + 2, pageWidth - 40, 26, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 55);
  const queryText =
    report.description ||
    `1. Allocation details and expenditure figures for the designated scheme.
2. Official quality assurance logs, inspection clearances, and release disbursements.
3. Designated supervisory framework and administrative oversight hierarchy.`;
  doc.text(queryText, 25, queryBoxY + 8, {
    maxWidth: pageWidth - 50,
    lineHeightFactor: 1.35,
  });

  // Load response paragraphs directly from report block in db.json
  let paragraphs: string[] = [];
  if (Array.isArray(report.response) && report.response.length > 0) {
    paragraphs = report.response;
  } else if (typeof report.response === "string" && report.response.trim().length > 0) {
    paragraphs = [report.response];
  } else {
    paragraphs = [
      `With reference to your online RTI application bearing Registration No. ${report.refNumber} regarding "${report.title}", the point-wise information from the records of ${report.department} is furnished below:`,
      `1. BUDGETARY ALLOCATION & SANCTIONS: The total outlay for the requested project / scheme for the corresponding fiscal period stands at INR 142.80 Crores, with an audited expenditure of INR 118.45 Crores utilized toward execution as recorded by the Internal Audit Wing.`,
      `2. AUDIT COMPLIANCE & QUALITY REPORTS: Independent technical inspection audits were conducted by the designated Quality Assessment Wing confirming conformity with standard operational specifications.`,
      `3. DESIGNATED SUPERVISORY AUTHORITY: The administrative oversight and execution supervision were vested with the Project Director operating under the direct jurisdiction of ${report.department}.`,
      `4. RIGHT TO APPEAL (SECTION 19(1)): If you are not satisfied with this response, you may prefer a First Appeal under Section 19(1) of the RTI Act within thirty (30) days from receipt of this communication before the designated First Appellate Authority.`
    ];
  }

  let currentY = queryBoxY + 34;

  paragraphs.forEach((para) => {
    currentY = renderParagraphWithBoldPrefix(
      doc,
      para,
      20,
      currentY,
      pageWidth - 40
    );
  });

  // Clean Officer Sign-off Block (No personal names / No fake IAS)
  const sigY = pageHeight - 38;
  doc.setDrawColor(200, 200, 205);
  doc.line(pageWidth - 85, sigY, pageWidth - 20, sigY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text("Public Information Officer (PIO)", pageWidth - 85, sigY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 85);
  doc.text(report.department, pageWidth - 85, sigY + 9.5);
  doc.text("RTI Cell, Demo Authority", pageWidth - 85, sigY + 13.5);

  // Page 2 Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 145);
  doc.text(
    "This is a prototype report generated for hackathon demonstration purposes. Not to be affiliated with Government",
    pageWidth / 2,
    pageHeight - 7,
    { align: "center" }
  );

  // Open the generated PDF in a new tab
  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
}
