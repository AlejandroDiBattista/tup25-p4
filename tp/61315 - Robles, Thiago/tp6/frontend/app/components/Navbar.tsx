import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/app/components/ui/navigation-menu";

export default function Navbar() {
    return (
        <nav className="w-full border-b bg-white">
            <div className="mx-auto flex items-center justify-between px-6 py-3">
                <div className="text-lg font-semibold">Mi tienda</div>

                <NavigationMenu>
                    <NavigationMenuList className="flex gap-2">
                        <NavigationMenuItem>
                            <Link href="/">
                                <NavigationMenuLink className="px-3 py-2 rounded-md hover:bg-gray-100">
                                    Productos
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link href="/compras">
                                <NavigationMenuLink className="px-3 py-2 rounded-md hover:bg-gray-100">
                                    Mis compras
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link href="/logout">
                                <NavigationMenuLink className="px-3 py-2 rounded-md hover:bg-gray-100">
                                    Salir
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </nav>
    );
}
