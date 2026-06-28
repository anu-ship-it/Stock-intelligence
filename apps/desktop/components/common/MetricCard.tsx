type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function MetricCard({
  title,
  value,
  subtitle
}: Props) {

  return (

    <div
      style={{
        border: "1px solid #dcdcdc",
        borderRadius: "10px",
        padding: "18px",
        minWidth: "190px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}
    >

      <div
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "8px"
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: 700
        }}
      >
        {value}
      </div>

      {subtitle && (

        <div
          style={{
            marginTop: "10px",
            fontSize: "13px",
            color: "#888"
          }}
        >
          {subtitle}
        </div>

      )}

    </div>

  );
}
