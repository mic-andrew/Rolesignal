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

const INPUT_CLS = "input-field";

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
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-100"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Card className="animate-fade-in w-full max-w-[420px] p-0!">
        <div className="flex items-center justify-between px-6 py-[18px] border-b border-edge">
          <div className="flex items-center gap-2">
            <RiUserAddLine size={18} className="text-brand" />
            <h3 className="text-base font-bold text-ink">Add Candidate</h3>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-ink3 flex"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-ink2">Name</label>
              <input className={INPUT_CLS} placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-ink2">Email</label>
              <input type="email" className={INPUT_CLS} placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-ink2">Role</label>
              <select
                className={`${INPUT_CLS} appearance-none`}
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

          <div className="flex justify-end mt-5 gap-2">
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
