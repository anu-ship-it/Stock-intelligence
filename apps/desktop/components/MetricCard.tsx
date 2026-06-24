type Props = {
  title: string;
  value: string | number;
};

export default function MetricCard({
  title,
  value
}: Props) {

  return (

    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '180px'
      }}
    >

      <h3>
        {title}
      </h3>

      <h2>
        {value}
      </h2>

    </div>

  );
}