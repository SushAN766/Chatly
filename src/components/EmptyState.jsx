export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 mt-20">
      <div className="text-6xl animate-pulse text-[#FFD700]">💎</div>
      <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent animate-pulse">
        Welcome to Chatly
      </div>
      <p className="text-gray-400 text-sm">
        Engage in premium, intelligent conversations with our AI.
      </p>
      <div className="mt-4 px-6 py-2 bg-[#111]/70 text-[#FFD700] rounded-full animate-bounce shadow-lg">
        Type a message below to begin
      </div>
    </div>
  );
}
