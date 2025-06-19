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
  const skillsTitleY = summaryY + summaryFontSize + skillsTitleYOffset;
  doc.setFontSize(skillsTitleFontSize);
  doc.setFont('helvetica', 'bold');
  const skillsTitleTextWidth = doc.getTextWidth('Skills:');
  doc.text('Skills:', (pageWidth - skillsTitleTextWidth) / 2, skillsTitleY);
  doc.setFont('helvetica', 'normal');

  // Skills title line
  const skillsTitleLineY = skillsTitleY + skillsFontSize + skillsTitleLineYOffset;
  doc.setLineWidth(0.5);
  doc.line(pageMarginX, skillsTitleLineY, pageWidth - pageMarginX, skillsTitleLineY);

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

  // Work Experience title
  const workExperienceTitleY = skillsListY + 3 * lineSpacing;
  doc.setFontSize(skillsTitleFontSize);
  doc.setFont('helvetica', 'bold');
  const workExperienceTitleLabel = "Work Experience:";
  doc.text(workExperienceTitleLabel, pageMarginX, workExperienceTitleY);

  // Work Experience title line
  const workExperienceTitleLineY = workExperienceTitleY + skillsFontSize + skillsTitleLineYOffset;
  doc.setLineWidth(0.5);
  doc.line(pageMarginX, workExperienceTitleLineY, pageWidth - pageMarginX, workExperienceTitleLineY);

  // Work experience
  let workExperienceY = workExperienceTitleLineY + workExperienceLineYOffset;
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

  return doc.output('datauristring');
} 