import {
  LayoutDashboard,
  TrendingUp,
  Star,
  FileText,
  Brain,
  Settings
} from "lucide-react";

const menu = [
  {
    icon: LayoutDashboard,
    label: "Dashboard"
  },
  {
    icon: TrendingUp,
    label: "Stocks"
  },
  {
    icon: Star,
    label: "Watchlist"
  },
  {
    icon: FileText,
    label: "Reports"
  },
  {
    icon: Brain,
    label: "AI Analysis"
  },
  {
    icon: Settings,
    label: "Settings"
  }
];

export default function Sidebar() {

  return (

    <aside
      className="
      w-72
      bg-slate-900
      border-r
      border-slate-800
      flex
      flex-col
      "
    >

      <div
        className="
        h-20
        flex
        items-center
        px-6
        border-b
        border-slate-800
        "
      >

        <h1
          className="
          text-2xl
          font-bold
          tracking-wide
          "
        >
          PennyScope
        </h1>

      </div>

      <nav
        className="
        flex-1
        px-3
        py-5
        space-y-2
        "
      >

        {menu.map(item => {

          const Icon =
            item.icon;

          return (

            <button
              key={item.label}
              className="
              w-full
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition-all
              "
            >

              <Icon
                size={20}
              />

              {item.label}

            </button>

          );

        })}

      </nav>

    </aside>

  );

}
