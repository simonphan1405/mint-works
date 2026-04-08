import { TokenSize } from "./MintTokenGroup";

const sizeConfig = {
  xs: { box: "w-4 h-4", stroke: "1.2px", shadowScale: "0.5px" },
  sm: { box: "w-6 h-6", stroke: "1.4px", shadowScale: "1px" },
  md: { box: "w-11 h-11", stroke: "1.5px", shadowScale: "1px" },
  lg: { box: "w-14 h-14", stroke: "2px", shadowScale: "1.5px" },
};

export const StarToken = ({ 
  className = "", 
  size = "md" 
}: { 
  className?: string;
  size?: TokenSize;
}) => {
  const config = sizeConfig[size] || sizeConfig.md;
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${config.box} shrink-0 ${className}`}
      style={{ filter: `drop-shadow(${config.shadowScale} ${config.shadowScale} ${config.shadowScale} rgba(0,0,0,0.15))` }}
    >
      <path
        fill="#fdfdfd"
        stroke="#555"
        strokeWidth={config.stroke}
        strokeLinejoin="round"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  );
};

export const StarTokenGroup = ({ 
  count,
  size = "md"
}: { 
  count: number;
  size?: TokenSize;
}) => {
  if (count <= 0) return null;
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: count }).map((_, i) => (
        <StarToken
          key={i}
          size={size}
          className={
            ["z-0", "z-10", "z-20", "z-30", "z-40", "z-50"][i] || "z-50"
          }
        />
      ))}
    </div>
  );
};
