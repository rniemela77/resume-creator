import { jsPDF } from "jspdf";
import userInfo from "../data/userInfo.json";

const pageMarginX = 10;
const sectionTitleSize = 18;

const randomizeLengthOfString = (string) => {
  const fullFakeString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const randomLength = Math.floor(Math.random() * 300) + 10; // 1-100
  return fullFakeString.slice(0, randomLength);
};

userInfo.summary = randomizeLengthOfString(userInfo.summary);

export function generatePDF() {
  const doc = new jsPDF();

  // Constants
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageMarginX = 10;
  const pageMarginY = 20;
  const lineSpacing = 7;
  //   const lineOffset = 10; // General line offset for all sections

  const nameSize = 30;
  const nameYOffset = pageMarginY;

  const titleSize = 18;
  const titleYOffset = -22;

  const contactSize = 12;
  const contactYOffset = -5;

  const summarySize = 12;
  const summaryYOffset = 3;

  const skillsTitleSize = 18;
  const skillsTitleYOffset = 10;

  // Name
  const nameY = nameYOffset;
  doc.setFontSize(nameSize);
  doc.setFont("helvetica", "bold");
  const nameTextWidth = doc.getTextWidth(userInfo.name);
  doc.text(userInfo.name, (pageWidth - nameTextWidth) / 2, nameY);

  // Title
  const titleY = nameY + nameSize + titleYOffset;
  doc.setFontSize(titleSize);
  doc.setFont("helvetica", "normal");
  const titleTextWidth = doc.getTextWidth(userInfo.title);
  doc.text(userInfo.title, (pageWidth - titleTextWidth) / 2, titleY);

  // Contact information
  const contactY = titleY + titleSize + contactYOffset;
  doc.setFontSize(contactSize);
  const contactInfoArray = Object.values(userInfo.contact);
  const contactInfo = contactInfoArray.join(" • ");
  const maxLineWidth = pageWidth - 2 * pageMarginX;
  const contactLines = doc.splitTextToSize(contactInfo, maxLineWidth);
  contactLines.forEach((line, index) => {
    const lineWidth = doc.getTextWidth(line);
    // Remove trailing dot if present
    if (line.endsWith(" •")) {
      line = line.slice(0, -2);
    }
    doc.text(line, (pageWidth - lineWidth) / 2, contactY + index * lineSpacing);
  });

  // Summary
  const summaryTitleY =
    contactY + contactLines.length * lineSpacing + lineSpacing;
  createSectionTitle(doc, "SUMMARY", summaryTitleY, pageWidth);
  drawHorizontalLine(doc, summaryTitleY, pageWidth);

  const summaryY = summaryTitleY + 5;
  doc.setFontSize(summarySize);
  doc.setFont("helvetica", "italic");
  const maxWidth = pageWidth - 2 * pageMarginX;
  const summaryLines = doc.splitTextToSize(userInfo.summary, maxWidth);
  summaryLines.forEach((line, index) => {
    const lineWidth = doc.getTextWidth(line);
    doc.text(
      line,
      (pageWidth - lineWidth) / 2,
      summaryY + lineSpacing + (index * lineSpacing)
    );
  });

  // Skills section
  const skillsTitleY = summaryY + (summaryLines.length * lineSpacing) + lineSpacing + 5;
  createSectionTitle(doc, "SKILLS", skillsTitleY, pageWidth);
  drawHorizontalLine(doc, skillsTitleY, pageWidth);

  //   // Skills list (languages, frameworks, tools)
  //   const skillsListY = skillsTitleY + skillsTitleSize + lineSpacing;
  //   const languagesLabel = "Languages: ";
  //   const languagesLabelWidth = doc.getTextWidth(languagesLabel);
  //   doc.text(languagesLabel, pageMarginX, skillsListY);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text(userInfo.skills.languages.join(', '), pageMarginX + languagesLabelWidth, skillsListY);

  //   const frameworksLabel = "Frameworks: ";
  //   doc.setFont('helvetica', 'bold');
  //   const frameworksLabelWidth = doc.getTextWidth(frameworksLabel);
  //   doc.text(frameworksLabel, pageMarginX, skillsListY + lineSpacing);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text(userInfo.skills.frameworks.join(', '), pageMarginX + frameworksLabelWidth, skillsListY + lineSpacing);

  //   doc.setFont('helvetica', 'bold');
  //   const toolsLabel = "Tools: ";
  //   const toolsLabelWidth = doc.getTextWidth(toolsLabel);
  //   doc.text(toolsLabel, pageMarginX, skillsListY + 2 * lineSpacing);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text(userInfo.skills.tools.join(', '), pageMarginX + toolsLabelWidth, skillsListY + 2 * lineSpacing);

  //   // Adjust the Y position for the next section after skills
  //   const skillsListEndY = skillsListY + 3 * lineSpacing;

  //   // Professional Experience section
  //   const workExperienceTitleY = createSection(doc, 'PROFESSIONAL EXPERIENCE', skillsListY + 3 * lineOffset, pageWidth, pageMarginX, skillsTitleFontSize, lineOffset);

  //   // Work experience
  //   let workExperienceY = workExperienceTitleY + workExperienceLineYOffset;
  //   doc.setFontSize(contentFontSize);
  //   doc.setFont('helvetica', 'normal');
  //   userInfo.workExperience.forEach((experience, index) => {
  //     const companyLocation = `${experience.company}, ${experience.location}`;
  //     const dateRange = `${experience.startDate} – ${experience.endDate}`;
  //     let currentY = workExperienceY;
  //     doc.text(companyLocation, pageMarginX, currentY);
  //     doc.text(dateRange, pageWidth - pageMarginX - doc.getTextWidth(dateRange), currentY);

  //     doc.setFont('helvetica', 'bold');
  //     doc.text(experience.title, pageMarginX, currentY + lineSpacing);
  //     doc.setFont('helvetica', 'normal');

  //     let detailYOffset = currentY + 2 * lineSpacing;
  //     experience.details.forEach((detail) => {
  //       const wrappedDetails = doc.splitTextToSize(`• ${detail}`, pageWidth - pageMarginX - 20);
  //       wrappedDetails.forEach((line, lineIndex) => {
  //         const xOffset = lineIndex === 0 ? pageMarginX + 5 : pageMarginX + 8.1;
  //         doc.text(line, xOffset, detailYOffset);
  //         detailYOffset += lineSpacing;
  //       });
  //     });

  //     // Update workExperienceY for the next experience
  //     workExperienceY = detailYOffset + lineSpacing;
  //   });

  //   // Education section
  //   const educationTitleY = createSection(doc, 'EDUCATION', workExperienceY, pageWidth, pageMarginX, skillsTitleFontSize, lineOffset);

  //   // Education details
  //   doc.setFontSize(contentFontSize);
  //   doc.setFont('helvetica', 'normal');
  //   let educationY = educationTitleY + workExperienceLineYOffset;
  //   if (Array.isArray(userInfo.education)) {
  //     userInfo.education.forEach((edu) => {
  //       const institution = `${edu.institution}, ${edu.location}`;
  //       const degree = `${edu.degree}`;
  //       const date = `${edu.endDate}`;
  //       doc.setFont('helvetica', 'normal');
  //       doc.text(institution, pageMarginX, educationY);
  //       doc.text(date, pageWidth - pageMarginX - doc.getTextWidth(date), educationY);
  //       educationY += lineSpacing;
  //       doc.setFont('helvetica', 'bold');
  //       doc.text(degree, pageMarginX, educationY);
  //       educationY += lineSpacing;
  //       if (Array.isArray(edu.details)) {
  //         edu.details.forEach((detail) => {
  //           const wrappedDetails = doc.splitTextToSize(`• ${detail}`, pageWidth - pageMarginX - 20);
  //           wrappedDetails.forEach((line, lineIndex) => {
  //             const xOffset = lineIndex === 0 ? pageMarginX + 5 : pageMarginX + 10;
  //             doc.text(line, xOffset, educationY);
  //             educationY += lineSpacing;
  //           });
  //         });
  //       }
  //       educationY += lineSpacing;
  //     });
  //   }

  //   // Certifications section
  //   const certificationsTitleY = createSection(doc, 'CERTIFICATIONS', educationY, pageWidth, pageMarginX, skillsTitleFontSize, lineOffset);

  //   // Certifications details
  //   doc.setFontSize(contentFontSize);
  //   doc.setFont('helvetica', 'normal');
  //   let certificationsY = certificationsTitleY + workExperienceLineYOffset;
  //   if (Array.isArray(userInfo.certifications)) {
  //     userInfo.certifications.forEach((cert) => {
  //       const certDetails = `${cert.name}, ${cert.institution}`;
  //       const dateReceived = `${cert.dateReceived}`;
  //       doc.setFont('helvetica', 'bold');
  //       doc.text(certDetails, pageMarginX, certificationsY);
  //       doc.setFont('helvetica', 'normal');
  //       doc.text(dateReceived, pageWidth - pageMarginX - doc.getTextWidth(dateReceived), certificationsY);
  //       certificationsY += lineSpacing;
  //     });
  //   }

  return doc.output("datauristring");
}

// // Helper function to render section titles
// function renderSectionTitle(doc, title, yPosition, pageWidth, fontSize) {
//   doc.setFontSize(fontSize);
//   doc.setFont('helvetica', 'bold');
//   const titleTextWidth = doc.getTextWidth(title);
//   doc.text(title, (pageWidth - titleTextWidth) / 2, yPosition);
// }

// // Helper function to draw horizontal lines
function drawHorizontalLine(doc, yPosition, pageWidth) {
  const lineY = yPosition + 3;
  doc.setLineWidth(0.5);
  doc.line(pageMarginX, lineY, pageWidth - pageMarginX, lineY);
}

function createSectionTitle(doc, title, yPosition, pageWidth) {
  doc.setFontSize(sectionTitleSize);
  doc.setFont("helvetica", "bold");
  const titleTextWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleTextWidth) / 2, yPosition);
}

// // Helper function for spacing between sections
// function getNextSectionY(currentY, lineSpacing, yOffset) {
//   return currentY + lineSpacing + yOffset;
// }

// // Create a reusable function to render sections
// function createSection(doc, titleText, currentY, pageWidth, pageMarginX, fontSize, lineSpacing) {
//   renderSectionTitle(doc, titleText, currentY, pageWidth, fontSize);
//   drawHorizontalLine(doc, currentY + fontSize + lineSpacing, pageWidth, pageMarginX);
//   return currentY + fontSize + 2.5 * lineSpacing;
// }
