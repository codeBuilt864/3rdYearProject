export default function ResumeCard({ parsed, wordCount, skills }) {
  return (
    <div className="p-4 border rounded-md bg-base-100">
      <h3 className="text-lg font-semibold">Resume Summary</h3>
      <div className="mt-2 text-sm">
        <div><strong>Name:</strong> {parsed?.name ?? 'Unknown'}</div>
        <div><strong>Email:</strong> {parsed?.email ?? 'Not found'}</div>
        <div><strong>Phone:</strong> {parsed?.phone ?? 'Not found'}</div>
        <div className="mt-2"><strong>Words:</strong> {wordCount}</div>
        <div className="mt-2"><strong>Skills:</strong> {skills && skills.length ? skills.join(', ') : 'None detected'}</div>
      </div>
    </div>
  );
}
