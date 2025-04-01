import { useProgresses } from '../api/kosync';

export function SyncsPage() {
  const { data: progresses, isLoading } = useProgresses();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {progresses?.map((progress) => (
        <div key={progress.id}>
          <h2>{progress.device}</h2>
          <p>Progress: JSON.stringify(progress)</p>
        </div>
      ))}
    </div>
  );
}
