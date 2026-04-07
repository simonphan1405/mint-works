import {
  GiWindmill,
  GiGreekTemple,
  GiBank,
  GiTowerBridge,
  GiStoneBust,
  GiFlowers,
  GiMeepleGroup,
  GiOfficeChair,
  GiMining,
  GiNuclearPlant,
  GiStonePile,
  GiAnvil,
  GiFactory,
  GiTruck,
  GiTrashCan,
  GiObelisk,
  GiStrongbox,
  GiCrane,
  GiMechanicalArm,
  GiShop,
  GiTicket,
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
    case "co-op":
      return <GiMeepleGroup className={className} />;
    case "corporate-hq":
      return <GiOfficeChair className={className} />;
    case "stripmine":
      return <GiMining className={className} />;
    case "plant":
      return <GiNuclearPlant className={className} />;
    case "mine":
      return <GiStonePile className={className} />;
    case "workshop":
      return <GiAnvil className={className} />;
    case "factory":
      return <GiFactory className={className} />;
    case "truck":
      return <GiTruck className={className} />;
    case "landfill":
      return <GiTrashCan className={className} />;
    case "obelisk":
      return <GiObelisk className={className} />;
    case "vault":
      return <GiStrongbox className={className} />;
    case "crane":
      return <GiCrane className={className} />;
    case "assembler":
      return <GiMechanicalArm className={className} />;
    case "wholesaler":
      return <GiShop className={className} />;
    case "lotto":
      return <GiTicket className={className} />;
    default:
      return null;
  }
};
