// Advanced PDF text extraction with intelligent cleanup
export async function extractPdfText(file) {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    const pdfjs = pdfjsLib.default;

    // Configure worker
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        // Extract text intelligently, filtering out PDF metadata
        const lines = [];
        let currentLine = '';

        for (const item of content.items) {
          const str = (item.str || '').trim();
          
          // Skip common PDF metadata patterns
          if (
            !str ||
            /^<</.test(str) ||
            /^>>/.test(str) ||
            /^\/\w+/.test(str) ||
            /^\d+\s+\d+\s+\w+\s*$/.test(str) ||
            /^obj|endobj|stream|endstream/i.test(str) ||
            /^\/BaseFont|\/Type|\/Subtype|\/Name|\/Action|\/URI|\/Border|\/Rect|\/Encoding|\/MinAnsiEncoding/i.test(str)
          ) {
            continue;
          }

          if (item.height && item.height < 5) {
            // Small text, likely footer/header - skip
            continue;
          }

          // Check for new line based on Y position change
          if (currentLine && item.transform && item.transform[5] !== undefined) {
            const lastY = item.transform[5];
            // If Y changed significantly, start new line
            if (Math.abs(lastY - (item.transform[5] || 0)) > 3) {
              if (currentLine.trim()) lines.push(currentLine.trim());
              currentLine = '';
            }
          }

          currentLine += ' ' + str;
        }

        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }

        fullText += lines.join('\n') + '\n';
      } catch (pageErr) {
        console.warn(`Page ${pageNum} extraction failed:`, pageErr.message);
      }
    }

    // Final cleanup
    const cleanText = fullText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        // Filter out remaining PDF metadata lines
        if (
          !trimmed ||
          /^<<|^>>|^\/\w|^obj|endobj|stream|endstream|^%PDF/i.test(trimmed) ||
          /^\/BaseFont|\/Type|\/Subtype|\/Encoding|\/Action|\/URI/i.test(trimmed) ||
          /^\d+\s+\d+\s+\w+\s*$/.test(trimmed) ||
          /^<<\s*\/\w+|^\s*\[\s*[\d\s.]*\]/.test(trimmed)
        ) {
          return false;
        }
        return true;
      })
      .join('\n')
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    if (cleanText && cleanText.length > 50) {
      return cleanText;
    }

    return null;
  } catch (err) {
    console.error('PDF extraction error:', err);
    return null;
  }
}

// Text file extraction with cleanup
export async function extractTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let text = e.target.result || '';

      // Basic cleanup
      const cleaned = text
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .trim();

      if (cleaned.length > 50) {
        resolve(cleaned);
      } else {
        resolve(null);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
