import { useState } from 'react';

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  try {
    // try dynamic import of pdfjs-dist; user should install it for best results
    const pdfjs = await import('pdfjs-dist/build/pdf');
    try {
      // set worker if available (some bundlers require this)
      if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
        // This won't always be correct; if bundler fails, instruct user to install pdfjs-dist properly
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';
      }
    } catch (e) {
      // ignore worker configuration issues
    }

    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const txt = await page.getTextContent();
      const pageText = txt.items.map((it) => it.str).join(' ');
      fullText += '\n' + pageText;
    }
    return fullText.trim();
  } catch (err) {
    // dynamic import failed or pdf parsing failed — return empty to fallback
    console.warn('PDF text extraction failed (pdfjs missing?):', err);
    return null;
  }
}

export default function FileUploader({ onUpload }) {
  const [name, setName] = useState(null);
  const [status, setStatus] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setName(file.name);
    setStatus('reading');

    // handle PDFs specially
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setStatus('extracting-pdf');
      const text = await extractPdfText(file);
      if (text) {
        setStatus('done');
        onUpload && onUpload({ name: file.name, text });
        return;
      }
      // fallback: try to read as text (may be garbage for PDFs)
    }

    // For other types, attempt to read as text. For binary formats (docx) this will be limited.
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setStatus('done');
      onUpload && onUpload({ name: file.name, text });
    };
    reader.onerror = () => {
      setStatus('error');
      onUpload && onUpload({ name: file.name, text: null });
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4">
      <label className="block mb-2 font-medium">Upload resume</label>
      <input
        aria-label="Resume file input"
        type="file"
        accept=".txt,.md,.pdf,.doc,.docx"
        onChange={(e) => handleFile(e.target.files[0])}
        className="input input-bordered w-full"
      />
      {name && <div className="mt-2 text-sm text-gray-500">Selected: {name}</div>}
      {status === 'extracting-pdf' && <div className="mt-2 text-sm">Extracting PDF text (requires pdfjs-dist)...</div>}
      {status === 'reading' && <div className="mt-2 text-sm">Reading file...</div>}
      {status === 'error' && <div className="mt-2 text-sm text-error">Failed to read file</div>}
    </div>
  );
}
