import ReactMarkdown from "react-markdown";

function MarkdownRenderer({ children }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-white/90
      prose-headings:text-white prose-headings:font-bold
      prose-p:text-white/80 prose-p:leading-relaxed
      prose-li:text-white/80
      prose-strong:text-white
      prose-hr:border-[#7B5CFF]/30">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
