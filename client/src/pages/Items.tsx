/**
 * Items page — example resource page.
 * Replace with your domain-specific pages.
 */

import { useItems } from "../hooks/useItems";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function Items() {
  const { items, count, isLoading } = useItems();

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Items</h2>
        <span className="text-sm text-gray-500">{count} total</span>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No items yet" description="Create your first item to get started." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{item.name}</span>
                <Badge variant="pending" label={item.status} />
              </div>
              {item.description && (
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
