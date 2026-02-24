import { useState } from "react";
import { RiCloseLine, RiLoader4Line, RiUserAddLine } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { candidatesApi } from "../../api/candidates";
import { rolesApi } from "../../api/roles";
import { useUIStore } from "../../stores/uiStore";

interface AddCandidateModalProps {
  onClose: () => void;
  defaultRoleId?: string;
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "var(--color-layer)",
  border: "1px solid var(--color-edge)",
  borderRadius: 8,
  color: "var(--color-ink)",
  fontSize: 13,
  outline: "none",
};

export function AddCandidateModal({ onClose, defaultRoleId }: AddCandidateModalProps) {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(defaultRoleId ?? "");

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      candidatesApi.create({ name, email, role_id: roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      showToast("Candidate added", "success");
      onClose();
    },
    onError: () => showToast("Failed to add candidate", "error"),
  });

  const canSubmit = name.trim() && email.trim() && roleId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) createMutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 100 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Card style={{ width: "100%", maxWidth: 420, padding: 0 }} className="animate-fade-in">
        <div className="flex items-center justify-between" style={{ padding: "18px 24px", borderBottom: "1px solid var(--color-edge)" }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <RiUserAddLine size={18} style={{ color: "var(--color-brand)" }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-ink)" }}>Add Candidate</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ink3)", display: "flex" }}
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
          <div className="flex flex-col" style={{ gap: 14 }}>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Name</label>
              <input style={fieldStyle} placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Email</label>
              <input type="email" style={fieldStyle} placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink2)" }}>Role</label>
              <select
                style={{ ...fieldStyle, appearance: "none" }}
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
              >
                <option value="">Select a role...</option>
                {(rolesQuery.data ?? []).map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end" style={{ marginTop: 20, gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={!canSubmit || createMutation.isPending}>
              {createMutation.isPending ? (
                <RiLoader4Line size={14} className="animate-spin" />
              ) : (
                "Add Candidate"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
