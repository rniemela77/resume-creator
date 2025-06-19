import { jsPDF } from 'jspdf';
import userInfo from '../data/userInfo.json';

export function generatePDF() {
  const doc = new jsPDF();

  // Constants
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageMarginX = 10;
  const pageMarginY = 10;
  const lineSpacing = 7;

  const nameFontSize = 30;
  const nameYOffset = -20;

  const titleFontSize = 16;
  const titleYOffset = -9;

  const contactFontSize = 12;
  const contactYOffset = -4;

  const summaryFontSize = 14;
  const summaryYOffset = 3;

  const skillsTitleFontSize = 16;
  const skillsTitleYOffset = 5;
  const skillsTitleLineYOffset = -10;
  const skillsFontSize = 14;
  const skillsYOffset = 0;

  const workExperienceFontSize = 14;
  const workExperienceYOffset = 0;
  const workExperienceTitleFontSize = 16;
  const workExperienceTitleYOffset = 5;
  const workExperienceTitleLineYOffset = -10;
  const workExperienceLineYOffset = 10;

  const educationFontSize = 14;
  const educationYOffset = -15;

  const certificationsFontSize = 14;
  const certificationsYOffset = -15;

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

  // Summary
  const summaryY = contactLineY + summaryYOffset;
  doc.setFontSize(summaryFontSize);
  doc.setFont('helvetica', 'italic');
  const summaryTextWidth = doc.getTextWidth(userInfo.summary);
  doc.text(userInfo.summary, (pageWidth - summaryTextWidth) / 2, summaryY + lineSpacing);

  // Skills title
  const skillsTitleY = getNextSectionY(summaryY, summaryFontSize, skillsTitleYOffset);
  renderSectionTitle(doc, 'SKILLS', skillsTitleY, pageWidth, skillsTitleFontSize);

  // Skills title line
  drawHorizontalLine(doc, skillsTitleY + skillsFontSize + skillsTitleLineYOffset, pageWidth, pageMarginX);

  // Skills list (languages, frameworks, tools)
  const skillsListY = skillsTitleY + skillsFontSize + skillsYOffset;
  doc.setFontSize(skillsFontSize);
  doc.setFont('helvetica', 'bold');
  const languagesLabel = "Languages: ";
  const languagesLabelWidth = doc.getTextWidth(languagesLabel);
  doc.text(languagesLabel, pageMarginX, skillsListY);
  doc.setFont('helvetica', 'normal');
  doc.text(userInfo.skills.languages.join(', '), pageMarginX + languagesLabelWidth, skillsListY);

  const frameworksLabel = "Frameworks: ";
  doc.setFont('helvetica', 'bold');
  const frameworksLabelWidth = doc.getTextWidth(frameworksLabel);
  doc.text(frameworksLabel, pageMarginX, skillsListY + lineSpacing);
  doc.setFont('helvetica', 'normal');
  doc.text(userInfo.skills.frameworks.join(', '), pageMarginX + frameworksLabelWidth, skillsListY + lineSpacing);

  doc.setFont('helvetica', 'bold');
  const toolsLabel = "Tools: ";
  const toolsLabelWidth = doc.getTextWidth(toolsLabel);
  doc.text(toolsLabel, pageMarginX, skillsListY + 2 * lineSpacing);
  doc.setFont('helvetica', 'normal');
  doc.text(userInfo.skills.tools.join(', '), pageMarginX + toolsLabelWidth, skillsListY + 2 * lineSpacing);

  // Adjust the Y position for the next section after skills
  const skillsListEndY = skillsListY + 3 * lineSpacing;

  // Professional Experience title
  const workExperienceTitleY = getNextSectionY(skillsListEndY, lineSpacing, workExperienceYOffset);
  renderSectionTitle(doc, 'PROFESSIONAL EXPERIENCE', workExperienceTitleY, pageWidth, skillsTitleFontSize);

  drawHorizontalLine(doc, workExperienceTitleY + skillsFontSize + skillsTitleLineYOffset, pageWidth, pageMarginX);

  // Work experience
  let workExperienceY = workExperienceTitleY + workExperienceLineYOffset;
  doc.setFontSize(workExperienceFontSize);
  doc.setFont('helvetica', 'normal');
  userInfo.workExperience.forEach((experience, index) => {
    const companyLocation = `${experience.company}, ${experience.location}`;
    const dateRange = `${experience.startDate} – ${experience.endDate}`;
    let currentY = workExperienceY;
    doc.text(companyLocation, pageMarginX, currentY);
    doc.text(dateRange, pageWidth - pageMarginX - doc.getTextWidth(dateRange), currentY);

    doc.setFont('helvetica', 'bold');
    doc.text(experience.title, pageMarginX, currentY + lineSpacing);
    doc.setFont('helvetica', 'normal');

    let detailYOffset = currentY + 2 * lineSpacing;
    experience.details.forEach((detail) => {
      const wrappedDetails = doc.splitTextToSize(`• ${detail}`, pageWidth - pageMarginX - 20);
      wrappedDetails.forEach((line, lineIndex) => {
        const xOffset = lineIndex === 0 ? pageMarginX + 5 : pageMarginX + 8.1;
        doc.text(line, xOffset, detailYOffset);
        detailYOffset += lineSpacing;
      });
    });

    // Update workExperienceY for the next experience
    workExperienceY = detailYOffset + lineSpacing;
  });

  // Education title
  const educationTitleY = getNextSectionY(workExperienceY, 2 * lineSpacing, educationYOffset);
  renderSectionTitle(doc, 'EDUCATION', educationTitleY, pageWidth, skillsTitleFontSize);

  drawHorizontalLine(doc, educationTitleY + skillsFontSize + skillsTitleLineYOffset, pageWidth, pageMarginX);

  // Education details
  doc.setFontSize(workExperienceFontSize);
  doc.setFont('helvetica', 'normal');
  let educationY = educationTitleY + workExperienceLineYOffset;
  if (Array.isArray(userInfo.education)) {
    userInfo.education.forEach((edu) => {
      const institution = `${edu.institution}, ${edu.location}`;
      const degree = `${edu.degree}`;
      const date = `${edu.endDate}`;
      doc.setFont('helvetica', 'normal');
      doc.text(institution, pageMarginX, educationY);
      doc.text(date, pageWidth - pageMarginX - doc.getTextWidth(date), educationY);
      educationY += lineSpacing;
      doc.setFont('helvetica', 'bold');
      doc.text(degree, pageMarginX, educationY);
      educationY += lineSpacing;
      if (Array.isArray(edu.details)) {
        edu.details.forEach((detail) => {
          const wrappedDetails = doc.splitTextToSize(`• ${detail}`, pageWidth - pageMarginX - 20);
          wrappedDetails.forEach((line, lineIndex) => {
            const xOffset = lineIndex === 0 ? pageMarginX + 5 : pageMarginX + 10;
            doc.text(line, xOffset, educationY);
            educationY += lineSpacing;
          });
        });
      }
      educationY += lineSpacing;
    });
  }

  // Certifications title
  const certificationsTitleY = getNextSectionY(educationY, 2 * lineSpacing, educationYOffset);
  renderSectionTitle(doc, 'CERTIFICATIONS', certificationsTitleY, pageWidth, skillsTitleFontSize);

  drawHorizontalLine(doc, certificationsTitleY + skillsFontSize + skillsTitleLineYOffset, pageWidth, pageMarginX);

  // Certifications details
  doc.setFontSize(workExperienceFontSize);
  doc.setFont('helvetica', 'normal');
  let certificationsY = certificationsTitleY + workExperienceLineYOffset;
  if (Array.isArray(userInfo.certifications)) {
    userInfo.certifications.forEach((cert) => {
      const certDetails = `${cert.name}, ${cert.institution}`;
      const dateReceived = `${cert.dateReceived}`;
      doc.setFont('helvetica', 'bold');
      doc.text(certDetails, pageMarginX, certificationsY);
      doc.setFont('helvetica', 'normal');
      doc.text(dateReceived, pageWidth - pageMarginX - doc.getTextWidth(dateReceived), certificationsY);
      certificationsY += lineSpacing;
    });
  }

  return doc.output('datauristring');
}

// Helper function to render section titles
function renderSectionTitle(doc, title, yPosition, pageWidth, fontSize) {
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'bold');
  const titleTextWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleTextWidth) / 2, yPosition);
}

// Helper function to draw horizontal lines
function drawHorizontalLine(doc, yPosition, pageWidth, pageMarginX) {
  doc.setLineWidth(0.5);
  doc.line(pageMarginX, yPosition, pageWidth - pageMarginX, yPosition);
}

// Helper function for spacing between sections
function getNextSectionY(currentY, lineSpacing, yOffset) {
  return currentY + lineSpacing + yOffset;
} 