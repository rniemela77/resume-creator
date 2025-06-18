import { jsPDF } from 'jspdf';
import userInfo from '../data/userInfo.json';

export function generatePDF() {
  const doc = new jsPDF();

  // Constants
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageMarginX = 10;
  const pageMarginY = 10;
  const lineSpacing = 5;

  const nameFontSize = 30;
  const nameYOffset = -20;

  const titleFontSize = 16;
  const titleYOffset = -9;

  const contactFontSize = 12;
  const contactYOffset = -4;

  // Name
  const nameY = pageMarginY + nameFontSize + nameYOffset;
  doc.setFontSize(nameFontSize);
  doc.setFont('helvetica', 'bold');
  const nameTextWidth = doc.getTextWidth(userInfo.name);
  doc.text(userInfo.name, (pageWidth - nameTextWidth) / 2, nameY);

  // Title
  const titleY = nameY + titleFontSize + titleYOffset;
  doc.setFontSize(titleFontSize);
  doc.setFont('helvetica', 'normal');
  const titleTextWidth = doc.getTextWidth(userInfo.title);
  doc.text(userInfo.title, (pageWidth - titleTextWidth) / 2, titleY);

  // Contact information
  const contactY = titleY + titleFontSize + contactYOffset;
  doc.setFontSize(contactFontSize);
  const contactInfoArray = Object.values(userInfo.contact);
  const contactInfo = contactInfoArray.join(' • ');
  const maxLineWidth = pageWidth - 2 * pageMarginX;
  const contactLines = doc.splitTextToSize(contactInfo, maxLineWidth);
  contactLines.forEach((line, index) => {
    const lineWidth = doc.getTextWidth(line);
    // Remove trailing dot if present
    if (line.endsWith(' •')) {
      line = line.slice(0, -2);
    }
    doc.text(line, (pageWidth - lineWidth) / 2, contactY + index * lineSpacing);
  });

  // Horizontal line
  const contactLineY = contactY + contactLines.length * lineSpacing;
  doc.setLineWidth(0.5);
  doc.line(pageMarginX, contactLineY, pageWidth - pageMarginX, contactLineY);

  return doc.output('datauristring');
} 