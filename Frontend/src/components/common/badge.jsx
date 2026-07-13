export function ScoreBadge({ score }) {
  const color =
    score >= 90 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    score >= 75 ? 'bg-blue-100 text-blue-700 border-blue-200' :
    score >= 60 ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-red-100 text-red-700 border-red-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {score}%
    </span>
  );
}

export function StatusPill({ published }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        published
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-gray-100 text-gray-500 border-gray-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${published ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {published ? 'Published' : 'Draft'}
    </span>
  );
}
