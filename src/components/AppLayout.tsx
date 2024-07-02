import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="w-full max-w-[480px] h-screen bg-slate-50 my-0 mx-auto border-2 border-slate-700">
      {children}
    </div>
  );
}
