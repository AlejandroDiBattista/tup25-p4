import type { ReactNode } from "react";

export default function PurchasesLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {children}
    </div>
  );
}

