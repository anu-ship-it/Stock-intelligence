import { ReactNode } from "react";

import Sidebar from "./Sidebar";

import Topbar from "./Topbar";

type Props = {
  children: ReactNode;
};

export default function AppLayout({
  children
}: Props) {

  return (

    <div className="flex h-screen bg-slate-950">

      <Sidebar />

      <div
        className="
        flex-1
        flex
        flex-col
        "
      >

        <Topbar />

        <main
          className="
          flex-1
          overflow-auto
          p-8
          "
        >

          {children}

        </main>

      </div>

    </div>

  );

}
