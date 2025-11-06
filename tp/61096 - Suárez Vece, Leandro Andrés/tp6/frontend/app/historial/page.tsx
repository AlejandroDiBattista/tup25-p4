"use client";

import { useEffect, useState } from "react";
import { CarritoRead } from "../types";
import Navbar from "../components/navbar";

import { useRouter } from "next/navigation";
import CardList from "./CardList";

export default function Historial() {

    const [token, setToken] = useState<string>("");
    const router = useRouter();



    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <Navbar
                    token={token}
                    setToken={setToken}
                />
            </header>

            <main>
                <CardList />
            </main>
        </div>
    );
}