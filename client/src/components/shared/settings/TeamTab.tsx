import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Avatar } from "../../ui/Avatar";
import type { TeamMember } from "../../../types";

interface TeamTabProps {
  team: TeamMember[];
  onInvite: (email: string) => void;
  onRemove: (id: string, name: string) => void;
}

export function TeamTab({ team, onInvite, onRemove }: TeamTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-ink">Team Members</h2>
        <Button size="sm" onClick={() => onInvite("new@example.com")}>
          Invite Member
        </Button>
      </div>
      <Card padding="p-0" className="overflow-hidden">
        {team.map((member, i) => (
          <div
            key={member.id}
            className={`flex items-center gap-3.5 px-5 py-4 ${
              i < team.length - 1 ? "border-b border-edge" : ""
            }`}
          >
            <Avatar
              initials={member.initials}
              size={36}
              color={member.status === "active" ? "#7C6FFF" : "#6B6B8A"}
            />
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink">
                {member.name}
              </div>
              <div className="text-xs text-ink3">{member.email}</div>
            </div>
            <span className="text-xs font-medium rounded-md text-ink2 px-2.5 py-1 bg-layer2">
              {member.role}
            </span>
            <Badge
              variant={member.status === "active" ? "active" : "invited"}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(member.id, member.name)}
            >
              Remove
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
