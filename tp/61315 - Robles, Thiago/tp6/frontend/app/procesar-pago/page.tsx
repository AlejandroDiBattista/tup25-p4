import DatosEnvio from "@/components/DatosEnvio";
import ResumenCarrito from "@/components/ResumenCarrito";

export default function page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
            <ResumenCarrito />
        </div>
        <aside className="h-full lg:sticky lg:top-24">
          <DatosEnvio />
        </aside>
      </div>
    </div>
  );
}
