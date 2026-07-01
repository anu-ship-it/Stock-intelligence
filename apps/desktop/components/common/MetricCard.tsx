type Props = {
  title: string;
  value: string | number;
};

export default function MetricCard({
  title,
  value,
}: Props) {
  return (
    <div
      className="
        flex-1
        min-w-[220px]
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-6
        shadow-lg
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-blue-500
      "
    >
      <p className="text-sm font-medium text-slate-400">
        {title}
      </p>

      <h2 className="mt-4 text-4xl font-bold text-white">
        {value}
      </h2>
    </div>
  );
}
