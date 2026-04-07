export type TokenSize = "xs" | "sm" | "md" | "lg";

const sizeConfig = {
  xs: { box: "w-4 h-4", shadow: "inset -1px -1px 2px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,1)", border: "border-[0.5px]", spacing: "-space-x-[12px]" },
  sm: { box: "w-6 h-6", shadow: "inset -2px -2px 4px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,1)", border: "border-[1px]", spacing: "-space-x-[14px]" },
  md: { box: "w-11 h-11", shadow: "inset -4px -4px 10px rgba(0,0,0,0.15), inset 2px 2px 4px rgba(255,255,255,1), 2px 2px 4px rgba(0,0,0,0.2)", border: "border-[1.5px]", spacing: "-space-x-[20px]" },
  lg: { box: "w-14 h-14", shadow: "inset -5px -5px 12px rgba(0,0,0,0.15), inset 3px 3px 6px rgba(255,255,255,1), 3px 3px 6px rgba(0,0,0,0.2)", border: "border-[2px]", spacing: "-space-x-[24px]" },
};

export const MintToken = ({ 
  className = "", 
  size = "md" 
}: { 
  className?: string;
  size?: TokenSize;
}) => {
  const config = sizeConfig[size] || sizeConfig.md;
  return (
    <div
      className={`${config.box} rounded-full bg-[#fdfdfd] ${config.border} border-[#666] shrink-0 ${className}`}
      style={{ boxShadow: config.shadow }}
    />
  );
};

export const MintTokenGroup = ({ 
  count,
  size = "md"
}: { 
  count: number;
  size?: TokenSize;
}) => {
  if (count <= 0) return null;
  const config = sizeConfig[size] || sizeConfig.md;
  return (
    <div className={`inline-flex ${config.spacing} items-center`}>
      {Array.from({ length: count }).map((_, i) => (
        <MintToken
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
