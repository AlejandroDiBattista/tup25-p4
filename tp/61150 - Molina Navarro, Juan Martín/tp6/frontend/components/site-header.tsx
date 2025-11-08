"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderProps = {
  active?: "products" | "login" | "register";
};

const navLinkClasses = (isActive: boolean) =>
  cn(
    "text-sm transition",
    isActive ? "font-semibold text-slate-900" : "text-slate-500 hover:text-slate-900"
  );

export function SiteHeader({ active = "products" }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <span className="text-xl font-semibold tracking-tight">TP6 Shop</span>
        <nav className="flex items-center gap-6">
          <Link className={navLinkClasses(active === "products")} href="/">
            Productos
          </Link>
          <Link className={navLinkClasses(active === "login")} href="/login">
            Ingresar
          </Link>
          <Button
            asChild
            className={cn(
              "rounded-full border border-slate-900 px-5 py-2 text-sm font-medium transition",
              active === "register"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-white text-slate-900 hover:bg-slate-900 hover:text-white"
            )}
          >
            <Link href="/register">Crear cuenta</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

