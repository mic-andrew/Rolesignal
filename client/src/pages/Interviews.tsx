import { useNavigate } from "react-router-dom";
import {
  RiAddLine,
  RiBriefcaseLine,
  RiTimeLine,
  RiGroupLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { useInterviews } from "../hooks/useInterviews";
import type { RoleGroup } from "../hooks/useInterviews";
import { SearchInput } from "../components/shared/SearchInput";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";

type StatusFilter = "all" | "pending" | "in_progress" | "completed";

const STATUS_FILTERS: Array<{ label: string; value: StatusFilter }> = [
  { label: "All",         value: "all"         },
  { label: "Pending",     value: "pending"     },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed",   value: "completed"   },
];

const STAT_CONFIG = [
  { key: "total",      label: "Total Roles",     color: "var(--color-ink)"     },
  { key: "pending",    label: "Pending",          color: "var(--color-warn)"    },
  { key: "inProgress", label: "In Progress",      color: "var(--color-brand)"   },
  { key: "completed",  label: "Completed",        color: "var(--color-success)" },
] as const;

interface RoleCardProps {
  group: RoleGroup;
  index: number;
  onClick: () => void;
}

function RoleInterviewCard({ group, index, onClick }: RoleCardProps) {
  const total = group.candidates.length;

  return (
    <Card
      glow
      padding="p-0"
      onClick={onClick}
      className={`animate-fade-in delay-${Math.min(index + 1, 10)} px-6 py-5 cursor-pointer transition-all hover:scale-[1.01]`}
    >
      <div className="flex items-start gap-3.5 mb-4">
        <div className="flex items-center justify-center text-brand w-10 h-10 rounded-[10px] bg-(--acg) shrink-0 mt-0.5">
          <RiBriefcaseLine size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-ink overflow-hidden text-ellipsis whitespace-nowrap">
            {group.roleTitle}
          </div>
          <div className="text-[13px] text-ink3 mt-0.5">
            {group.department}
          </div>
        </div>
        <RiArrowRightSLine size={18} className="text-ink3 shrink-0 mt-1" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-ink3">
          <RiGroupLine size={14} />
          <span className="text-[13px] font-medium">
            {total} candidate{total !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-ink3">
          <RiTimeLine size={14} />
          <span className="text-[13px] font-medium">
            {group.configDuration}min &middot; {group.configTone}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-edge">
        {group.pending > 0 && (
          <Badge variant="pending" label={`${group.pending} pending`} />
        )}
        {group.inProgress > 0 && (
          <Badge variant="in_progress" label={`${group.inProgress} in progress`} />
        )}
        {group.completed > 0 && (
          <Badge variant="completed" label={`${group.completed} completed`} />
        )}
      </div>
    </Card>
  );
}

export default function Interviews() {
  const hook = useInterviews();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {!hook.isLoading && hook.stats.total > 0 && (
        <div className="grid grid-cols-4 gap-5">
          {STAT_CONFIG.map(({ key, label, color }, i) => (
            <StatCard
              key={key}
              label={label}
              value={hook.stats[key]}
              accentColor={color}
              animationDelay={i + 1}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 animate-fade-in">
        <SearchInput
          value={hook.search}
          onChange={hook.setSearch}
          placeholder="Search by role or candidate..."
        />

        {STATUS_FILTERS.map(({ label, value }) => (
          <Button
            key={value}
            variant={hook.statusFilter === value ? "primary" : "ghost"}
            size="sm"
            onClick={() => hook.setStatusFilter(value)}
          >
            {label}
          </Button>
        ))}

        <Button size="sm" onClick={() => navigate("/setup")}>
          <RiAddLine size={14} />
          Create Interview
        </Button>
      </div>

      {hook.isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : hook.roleGroups.length === 0 && hook.interviews.length === 0 ? (
        <EmptyState
          title="No interviews yet"
          description="Create your first interview to start evaluating candidates."
          action={{ label: "Create Interview", onClick: () => navigate("/setup") }}
        />
      ) : hook.roleGroups.length === 0 ? (
        <EmptyState title="No interviews match your filters" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {hook.roleGroups.map((group, i) => (
            <RoleInterviewCard
              key={group.roleId}
              group={group}
              index={i}
              onClick={() => navigate(`/interviews/${group.roleId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
