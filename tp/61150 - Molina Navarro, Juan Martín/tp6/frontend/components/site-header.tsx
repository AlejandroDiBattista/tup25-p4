"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderProps = {
  active?: "login" | "register";
};

const navLinkClasses = (isActive: boolean) =>
  cn(
    "text-sm transition",
    isActive ? "font-semibold text-slate-900" : "text-slate-500 hover:text-slate-900"
  );

export function SiteHeader({ active = "login" }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">
        <span className="text-xl font-semibold tracking-tight">TP6 Shop</span>
        <nav className="flex items-center gap-6">
          <Link className="text-sm text-slate-500 transition hover:text-slate-900" href="#">
            Productos
          </Link>
          <Link className={navLinkClasses(active === "login")} href="/">
            Ingresar
          </Link>
          <Button
            asChild
            className="rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Link href="/register">Crear cuenta</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
