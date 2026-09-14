function JobCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/20 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#7B5CFF]/20 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#7B5CFF]/20 rounded w-3/4" />
          <div className="h-3 bg-[#7B5CFF]/10 rounded w-1/2" />
        </div>
        <div className="h-5 w-16 bg-[#7B5CFF]/20 rounded-full" />
      </div>
      <div className="flex gap-3">
        <div className="h-3 bg-[#7B5CFF]/10 rounded w-24" />
        <div className="h-3 bg-[#7B5CFF]/10 rounded w-16" />
        <div className="h-3 bg-[#7B5CFF]/10 rounded w-20" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-16 bg-[#7B5CFF]/10 rounded-full" />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 w-20 bg-[#7B5CFF]/10 rounded" />
        <div className="h-7 w-16 bg-[#7B5CFF]/20 rounded-lg" />
      </div>
    </div>
  );
}

export default JobCardSkeleton;
