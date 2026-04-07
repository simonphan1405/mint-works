import {
  GiWindmill,
  GiGreekTemple,
  GiBank,
  GiTowerBridge,
  GiStoneBust,
  GiFlowers,
} from "react-icons/gi";

export const getPlanIcon = (id: string, className: string) => {
  switch (id) {
    case "windmill":
      return <GiWindmill className={className} />;
    case "museum":
      return <GiGreekTemple className={className} />;
    case "gallery":
      return <GiBank className={className} />;
    case "bridge":
      return <GiTowerBridge className={className} />;
    case "statue":
      return <GiStoneBust className={className} />;
    case "gardens":
      return <GiFlowers className={className} />;
    default:
      return null;
  }
};
