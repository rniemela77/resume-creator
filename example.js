// Import the jsPDF library
import { jsPDF } from 'jspdf';

// Create a new instance of jsPDF
const doc = new jsPDF();

// Add some text to the PDF
// Parameters: text, x-coordinate, y-coordinate
// The coordinates are in millimeters
// The default page size is A4 (210 x 297 mm)
doc.text('Hello world!', 10, 10);

doc.text('This is a sample PDF document created using jsPDF.', 10, 20);

// Open the PDF in a new browser window
doc.output('dataurlnewwindow');

console.log('PDF generated and opened in a new browser window'); 