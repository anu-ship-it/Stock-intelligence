type Props = {
  recommendation: string;
  confidence: number;
};

export default function RecommendationCard({
  recommendation,
  confidence
}: Props) {

  return (

    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}
    >

      <h2>
        Recommendation
      </h2>

      <h1>
        {recommendation}
      </h1>

      <p>
        Confidence: {confidence}%
      </p>

    </div>
  );
}