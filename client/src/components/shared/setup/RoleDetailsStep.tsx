import { Card } from "../../ui/Card";
import type { RoleSeniority } from "../../../types";

const SENIORITY_LEVELS: RoleSeniority[] = ["Junior", "Mid", "Senior", "Lead"];

const INPUT_CLS =
  "w-full px-3.5 py-[11px] bg-[var(--color-canvas2)] border border-[var(--color-edge)] rounded-lg text-[var(--color-ink)] text-[13px] outline-none";

interface RoleDetailsStepProps {
  roleTitle: string;
  department: string;
  seniority: RoleSeniority;
  onRoleTitleChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSeniorityChange: (value: RoleSeniority) => void;
}

export function RoleDetailsStep({
  roleTitle,
  department,
  seniority,
  onRoleTitleChange,
  onDepartmentChange,
  onSeniorityChange,
}: RoleDetailsStepProps) {
  return (
    <Card padding="p-0" className="p-[30px]">
      <h3 className="text-[17px] font-bold text-[var(--color-ink)] mb-[22px]">
        Role Details
      </h3>
      <div className="grid gap-5">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-ink2)] mb-1.5">
            Role Title
          </label>
          <input
            className={INPUT_CLS}
            placeholder="e.g. Senior Frontend Engineer"
            value={roleTitle}
            onChange={(e) => onRoleTitleChange(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink2)] mb-1.5">
              Department
            </label>
            <input
              className={INPUT_CLS}
              value={department}
              onChange={(e) => onDepartmentChange(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink2)] mb-1.5">
              Seniority
            </label>
            <div className="flex rounded-lg overflow-hidden border border-[var(--color-edge)]">
              {SENIORITY_LEVELS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSeniorityChange(s)}
                  className={`flex-1 cursor-pointer border-0 transition-all py-2.5 text-center text-xs font-semibold ${
                    seniority === s
                      ? "bg-[var(--color-brand)] text-white"
                      : "bg-[var(--color-layer)] text-[var(--color-ink3)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
