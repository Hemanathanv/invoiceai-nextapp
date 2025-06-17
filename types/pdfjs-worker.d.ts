// Name: V.Hemanathan
// Describe: This file contains the types for the pdfjs worker.used convert pdf pages into images at the client side.
// Framework: Next.js -15.3.2 


declare module 'pdfjs-dist/build/pdf.worker.entry';
declare module 'pdfjs-dist/build/pdf.worker.min.mjs';
declare module 'pdfjs-dist/build/pdf.mjs' {
  import * as pdfjs from 'pdfjs-dist';
  export = pdfjs;
}
