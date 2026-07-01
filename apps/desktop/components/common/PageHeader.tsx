type Props = {
  title: string;
  subtitle: string;
};

export default function PageHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {title}
        </h1>

        <p className="mt-2 text-slate-400 text-lg">
          {subtitle}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-slate-500">
          PennyScope
        </p>

        <p className="text-white font-semibold">
          AI Stock Intelligence
        </p>
      </div>
    </div>
  );
}