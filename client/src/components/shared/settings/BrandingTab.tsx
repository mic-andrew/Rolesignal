import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

const BRAND_COLORS = ["#7C6FFF", "#22C997", "#FFAD33", "#EC4899", "#3B82F6"];

export function BrandingTab() {
  return (
    <div>
      <h2 className="text-[17px] font-bold mb-5 text-ink">Branding</h2>
      <Card padding="p-0" className="p-6">
        <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">
          Logo
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center text-xl font-bold rounded-xl w-[72px] h-[72px] text-brand bg-(--acg) border-2 border-dashed border-edge2">
            S
          </div>
          <Button variant="ghost" size="sm">
            Upload Logo
          </Button>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">
          Brand Color
        </div>
        <div className="flex gap-2.5">
          {BRAND_COLORS.map((c) => (
            <button
              key={c}
              className={`w-11 h-11 rounded-[10px] cursor-pointer transition-all border-0 ${
                c === "#7C6FFF" ? "ring-2 ring-white" : ""
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
