type DashboardSidebarProps = {
    onLogout: () => void;
};

export default function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
    return (
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
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 rounded-md"
                >
                    Salir
                </button>
            </div>
        </aside>
    );
}
