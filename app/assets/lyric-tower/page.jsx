import AssetPassport from "@/components/asset-passport/AssetPassport";
import { lyricTower } from "@/components/asset-passport/data/lyricTower";

export const metadata = {
  title: "Lyric Tower — Digital Asset Passport",
  description:
    "440 Louisiana St, Houston, TX 77002 — Class A office asset passport with investor KPIs, lease roll and due-diligence vault.",
};

export default function LyricTowerPage() {
  return <AssetPassport asset={lyricTower} />;
}
