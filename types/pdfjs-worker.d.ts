// pdfjs-worker.d.ts
declare module 'pdfjs-dist/build/pdf.worker.entry';
declare module 'pdfjs-dist/build/pdf.worker.min.mjs';
declare module 'pdfjs-dist/build/pdf.mjs' {
  import * as pdfjs from 'pdfjs-dist';
  export = pdfjs;
}
