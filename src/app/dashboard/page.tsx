"use client"
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user");

        router.push("/");
    };

    return (
        <div className="flex min-h-screen bg-white text-black">
            <aside className="w-64 border-r border-gray-200 flex flex-col justify-between">
                <div>
                    <div className="p-4 border-b border-gray-200">
                        <span className="text-lg font-bold">Sielse ITIL</span>
                    </div>

                    <nav className="p-4">
                        <ul>
                            <li>
                                <a href="#" className="block px-3 py-2 bg-gray-100 rounded-md font-medium">
                                    Inicio
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 rounded-md"
                    >
                        Salir
                    </button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                </header>
                <main className="p-6">
                    <p className="text-base text-gray-800">
                        Bienvenido al sistema ITIL de Sielse
                    </p>
                </main>
            </div>
        </div>
    );
}