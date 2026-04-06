import React from "react";

export const LeafIcon = ({ className = "" }: { className?: string }) => (
  <img
    src="https://www.iconpacks.net/icons/2/free-leaf-icon-1550-thumb.png"
    alt="Leaf"
    className={`inline-block align-text-bottom ${className} object-contain opacity-90`}
    style={{
      filter:
        "invert(1) drop-shadow(1px 1px 1px rgba(0,0,0,0.5)) drop-shadow(-1px -1px 0px rgba(0,0,0,0.4))",
    }}
  />
);
