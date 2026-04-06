export const MintToken = ({ className = "" }: { className?: string }) => (
  <div
    className={`w-11 h-11 rounded-full bg-[#fdfdfd] border-[1.5px] border-[#666] shrink-0 ${className}`}
    style={{
      boxShadow:
        "inset -4px -4px 10px rgba(0,0,0,0.15), inset 2px 2px 4px rgba(255,255,255,1), 2px 2px 4px rgba(0,0,0,0.2)",
    }}
  />
);

export const MintTokenGroup = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  return (
    <div className="inline-flex -space-x-[20px] items-center">
      {Array.from({ length: count }).map((_, i) => (
        <MintToken
          key={i}
          className={
            ["z-0", "z-10", "z-20", "z-30", "z-40", "z-50"][i] || "z-50"
          }
        />
      ))}
    </div>
  );
};
