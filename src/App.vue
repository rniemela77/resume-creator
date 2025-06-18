<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <iframe id="pdf-frame" style="width:100%; height:500px; border:none;"></iframe>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf';

export default {
  data() {
    return {
      message: 'PDF Example with Vue.js'
    }
  },
  mounted() {
    this.generatePDF();
  },
  methods: {
    generatePDF() {
      const doc = new jsPDF();

      // Set font size and style for the name
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Name: John Doe', 10, 20);

      // Set font size and style for the title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('Title: Software Engineer', 10, 30);

      // Set font size and style for the skills
      doc.setFontSize(14);
      doc.setFont('helvetica', 'italic');
      doc.text('Skills:', 10, 40);
      doc.setFont('helvetica', 'normal');
      doc.text('- JavaScript', 20, 50);
      doc.text('- Vue.js', 20, 60);
      doc.text('- PDF Generation', 20, 70);

      const pdfDataUri = doc.output('datauristring');
      document.getElementById('pdf-frame').src = pdfDataUri;
    }
  }
}
</script>

<style>
/* Add any component-specific styles here */
</style> 