import { useState, useEffect } from "react";

function MyListings() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyItems();
    }, []);

    const fetchMyItems = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/items/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch listings");
            }

            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError("❌ Could not load your listings.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-gray-400">Loading your listings...</div>;
    }

    if (error) {
        return <div className="text-red-400">{error}</div>;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl text-center">
                <span className="text-5xl mb-4">🍽</span>
                <h2 className="text-xl font-bold text-white mb-2">No Listings Yet</h2>
                <p className="text-gray-500 text-sm">You haven't published any food items. Go to 'Add Food Item' to create one!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors group">
                    {/* Placeholder Image Area */}
                    <div className="h-40 bg-gray-900 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50 group-hover:scale-110 transition-transform">
                            🍲
                        </div>
                        <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">
                            {item.quantity} Left
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

                        <div className="flex justify-between items-end pt-4 border-t border-white/10">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Discount Price</p>
                                <p className="text-2xl font-bold text-amber-400">₹{item.discountPrice}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Original</p>
                                <p className="text-sm font-bold text-gray-500 line-through">₹{item.originalPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyListings;
