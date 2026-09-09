import { Link, useNavigate } from "react-router-dom";

function RestaurantSidebar({ user, activeTab, setActiveTab }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    return (
        <aside className="w-64 bg-gray-900 border-r border-white/10 flex flex-col fixed h-full z-10">
            <div className="p-6 border-b border-white/10">
                <Link to="/" className="text-white font-bold text-xl tracking-widest uppercase block">
                    Rescue<span className="text-amber-400">Reserve</span>
                </Link>
            </div>
            <div className="flex-1 py-6 px-4 space-y-2">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-4 px-2">Dashboard</p>
                <button
                    onClick={() => setActiveTab("add")}
                    className={`w-full text-left px-4 py-3 font-bold rounded-lg transition-colors ${activeTab === "add" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
                >
                    Add Food Item
                </button>
                <button
                    onClick={() => setActiveTab("listings")}
                    className={`w-full text-left px-4 py-3 font-bold rounded-lg transition-colors ${activeTab === "listings" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
                >
                    My Listings
                </button>
                <button 
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left px-4 py-3 font-bold rounded-lg transition-colors ${activeTab === "orders" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
                >
                    Order History
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent">
                    Settings
                </button>
            </div>
            <div className="p-6 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-lg">
                        🏨
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-transparent border border-white/20 hover:border-white/50 text-white text-xs font-bold rounded-md uppercase tracking-wider transition-all"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default RestaurantSidebar;
