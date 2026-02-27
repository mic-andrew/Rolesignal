import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

const COMPANY_FIELDS = [
  { l: "Company Name", v: "Acme Corp" },
  { l: "Industry", v: "Technology" },
  { l: "Company Size", v: "201\u2013500" },
  { l: "Website", v: "acme.com" },
];

export function GeneralTab() {
  return (
    <div>
      <h2 className="text-[17px] font-bold mb-5 text-ink">Organization</h2>
      <Card padding="p-0" className="p-6">
        <div className="text-[11px] font-bold uppercase tracking-wide mb-4 text-ink3">
          Company Details
        </div>
        <div className="grid grid-cols-2 gap-4">
          {COMPANY_FIELDS.map(({ l, v }) => (
            <div key={l}>
              <label className="block text-xs font-semibold mb-1.5 text-ink2">
                {l}
              </label>
              <input className="input-field" defaultValue={v} />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <Button size="sm">Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
