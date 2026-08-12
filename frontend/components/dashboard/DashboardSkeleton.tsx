export function DashboardSkeleton() {
  return <div className="space-y-6" aria-label="Loading dashboard" aria-busy="true"><div className="grid animate-pulse gap-5 lg:grid-cols-12"><div className="h-52 rounded-2xl bg-[#e9e8f1] lg:col-span-7" /><div className="h-52 rounded-2xl bg-[#e9e8f1] lg:col-span-5" /></div><div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-32 rounded-2xl bg-[#e9e8f1]" />)}</div><div className="h-72 animate-pulse rounded-2xl bg-[#e9e8f1]" /></div>;
}
