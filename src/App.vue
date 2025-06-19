<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <iframe id="pdf-frame" style="width:100%; height:700px; border:none;"></iframe>
  </div>
</template>

<script>
import { generatePDF } from './utils/pdfGenerator';

export default {
  data() {
    return {
      message: 'PDF Example with Vue.js'
    }
  },
  mounted() {
    this.displayPDF();
  },
  methods: {
    displayPDF() {
      const pdfDataUri = generatePDF();
      document.getElementById('pdf-frame').src = pdfDataUri;
    }
  }
}
</script>

<style>
/* Add any component-specific styles here */
</style> 