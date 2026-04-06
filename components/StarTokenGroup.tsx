export const StarToken = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-11 h-11 shrink-0 ${className}`}
    style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.15))" }}
  >
    <path
      fill="#fdfdfd"
      stroke="#555"
      strokeWidth="1.5"
      strokeLinejoin="round"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);

export const StarTokenGroup = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: count }).map((_, i) => (
        <StarToken
          key={i}
          className={
            ["z-0", "z-10", "z-20", "z-30", "z-40", "z-50"][i] || "z-50"
          }
        />
      ))}
    </div>
  );
};
