import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import type { Integration } from "../../../types";

interface IntegrationsTabProps {
  integrations: Integration[];
  onToggle: (id: string) => void;
}

export function IntegrationsTab({
  integrations,
  onToggle,
}: IntegrationsTabProps) {
  return (
    <div>
      <h2 className="text-[17px] font-bold mb-5 text-ink">Integrations</h2>
      <div className="grid grid-cols-2 gap-4">
        {integrations.map((int) => (
          <Card
            key={int.id}
            glow
            padding="p-0"
            className="flex items-center justify-between px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-[22px]">{int.emoji}</span>
              <div>
                <div className="text-sm font-semibold text-ink">{int.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge variant={int.connected ? "live" : "pending"} />
                  <span className="text-xs text-ink3">{int.description}</span>
                </div>
              </div>
            </div>
            <Button
              variant={int.connected ? "ghost" : "primary"}
              size="sm"
              onClick={() => onToggle(int.id)}
            >
              {int.connected ? "Configure" : "Connect"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
