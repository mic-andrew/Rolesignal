import { useTopics } from "../hooks/useTopics";
import { TopicCard } from "../components/shared/TopicCard";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";

export default function TopicExplorer() {
  const { coreDsa, advanced, systemDesign, isLoading } = useTopics();

  if (isLoading) return <LoadingSkeleton />;

  if (coreDsa.length === 0 && advanced.length === 0 && systemDesign.length === 0) {
    return (
      <EmptyState
        title="No topics yet"
        description="Topics will appear here once the problem bank is seeded."
      />
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {coreDsa.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-ink mb-4">Core Data Structures & Algorithms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {coreDsa.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {advanced.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-ink mb-4">Advanced Techniques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {advanced.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {systemDesign.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-ink mb-4">System Design</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {systemDesign.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
