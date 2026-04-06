import { MintTokenGroup } from "../components/MintTokenGroup";
import { StarTokenGroup } from "../components/StarTokenGroup";
import { LeafIcon } from "../components/LeafIcon";

export const parseTextWithIcons = (text: string, iconClassName: string = "") => {
  if (!text) return null;
  const parts = text.split(
    /(\[MINT\]|\[MINT_\d+\]|\[STAR\]|\[STAR_\d+\]|\[LEAF\]|\n)/g,
  );
  return parts.map((part, i) => {
    if (part === "[MINT]")
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <MintTokenGroup count={1} />
        </span>
      );
    if (part.startsWith("[MINT_")) {
      const count = parseInt(part.replace("[MINT_", "").replace("]", ""), 10);
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <MintTokenGroup count={count} />
        </span>
      );
    }
    if (part === "[STAR]")
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <StarTokenGroup count={1} />
        </span>
      );
    if (part.startsWith("[STAR_")) {
      const count = parseInt(part.replace("[STAR_", "").replace("]", ""), 10);
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <StarTokenGroup count={count} />
        </span>
      );
    }
    if (part === "[LEAF]")
      return (
        <span key={i} className={`inline-block align-middle ${iconClassName}`}>
          <LeafIcon className="w-10 h-10" />
        </span>
      );
    if (part === "\n") return <br key={i} />;
    return part;
  });
};
