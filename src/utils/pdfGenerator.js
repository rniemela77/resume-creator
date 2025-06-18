import { jsPDF } from 'jspdf';
import userInfo from '../data/userInfo.json';

export function generatePDF() {
  const doc = new jsPDF();

  // Set font size and style for the name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`Name: ${userInfo.name}`, 10, 20);

  // Set font size and style for the title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(`Title: ${userInfo.title}`, 10, 30);

  // Set font size and style for the skills
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text('Skills:', 10, 40);
  doc.setFont('helvetica', 'normal');
  userInfo.skills.forEach((skill, index) => {
    doc.text(`- ${skill}`, 20, 50 + index * 10);
  });

  return doc.output('datauristring');
} 