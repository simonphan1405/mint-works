import { MintTokenGroup, TokenSize } from "../components/cards/MintTokenGroup";
import { StarTokenGroup } from "../components/cards/StarTokenGroup";
import { FaLeaf } from "react-icons/fa";

const leafSizeConfig = {
  xs: "w-4 h-4",
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export const parseTextWithIcons = (
  text: string,
  iconClassName: string = "",
  tokenSize: TokenSize = "md",
) => {
  if (!text) return null;
  const parts = text.split(
    /(\[MINT\]|\[MINT_\d+\]|\[STAR\]|\[STAR_\d+\]|\[LEAF\]|\n)/g,
  );
  return parts.map((part, i) => {
    if (part === "[MINT]")
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <MintTokenGroup count={1} size={tokenSize} />
        </span>
      );
    if (part.startsWith("[MINT_")) {
      const count = parseInt(part.replace("[MINT_", "").replace("]", ""), 10);
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <MintTokenGroup count={count} size={tokenSize} />
        </span>
      );
    }
    if (part === "[STAR]")
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <StarTokenGroup count={1} size={tokenSize} />
        </span>
      );
    if (part.startsWith("[STAR_")) {
      const count = parseInt(part.replace("[STAR_", "").replace("]", ""), 10);
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <StarTokenGroup count={count} size={tokenSize} />
        </span>
      );
    }
    if (part === "[LEAF]")
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <FaLeaf
            className={`${leafSizeConfig[tokenSize]} text-white -rotate-30`}
          />
        </span>
      );
    if (part === "\n") return <br key={i} />;
    return part;
  });
};
