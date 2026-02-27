import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import type { InterviewTemplate } from "../../../types";

interface TemplatesTabProps {
  templates: InterviewTemplate[];
  onDelete: (id: string, name: string) => void;
}

export function TemplatesTab({ templates, onDelete }: TemplatesTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-ink">Interview Templates</h2>
        <Button size="sm">New Template</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((t) => (
          <Card key={t.id} glow padding="p-0" className="p-5">
            <div className="text-sm font-bold mb-1 text-ink">{t.name}</div>
            <div className="text-xs mb-4 text-ink3">{t.role}</div>
            <div className="flex gap-2 mb-4">
              {[
                { l: "Duration", v: `${t.duration}m` },
                { l: "Criteria", v: t.criteriaCount },
                { l: "Used", v: t.usedCount },
              ].map(({ l, v }) => (
                <div
                  key={l}
                  className="flex-1 text-center rounded-lg px-2.5 py-2 bg-canvas2 border border-edge"
                >
                  <div className="text-sm font-bold font-mono text-brand">
                    {v}
                  </div>
                  <div className="text-[10px] mt-0.5 text-ink3">{l}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-center"
              >
                Use Template
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(t.id, t.name)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
