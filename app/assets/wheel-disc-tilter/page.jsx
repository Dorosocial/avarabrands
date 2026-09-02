import EquipmentPassport from "@/components/asset-passport/EquipmentPassport";
import { wheelDiscTilter } from "@/components/asset-passport/data/wheelDiscTilter";

export const metadata = {
  title: "Wheel Disc Hydraulic Tilter — Digital Asset Passport",
  description:
    "1-tonne dual-platform hydraulic tilter with clamping mechanism and V-groove — duty-cycle economics, service intervals and documentation vault.",
};

export default function WheelDiscTilterPage() {
  return <EquipmentPassport asset={wheelDiscTilter} />;
}
