import {
  Search,
  Bell
} from "lucide-react";

export default function Topbar() {

  return (

    <header
      className="
      h-16
      flex
      items-center
      justify-between
      border-b
      border-slate-800
      mb-8
      "
    >

      <h2
        className="
        text-3xl
        font-bold
        "
      >
        Dashboard
      </h2>

      <div
        className="
        flex
        items-center
        gap-5
        "
      >

        <Search
          className="text-slate-400"
        />

        <Bell
          className="text-slate-400"
        />

      </div>

    </header>

  );

}
