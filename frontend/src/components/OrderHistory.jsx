import { useState, useEffect } from "react";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/orders/restaurant", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to fetch orders");

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError("❌ Could not load order history.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-gray-400">Loading order history...</div>;
    if (error) return <div className="text-red-400">{error}</div>;

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl text-center">
                <span className="text-5xl mb-4">📝</span>
                <h2 className="text-xl font-bold text-white mb-2">No Orders Yet</h2>
                <p className="text-gray-500 text-sm">Customers haven't reserved any of your listings yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/50 border-b border-white/10">
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Item</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Details</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Location</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map(order => (
                            <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 align-top">
                                    <p className="font-bold text-white mb-1">{order.itemName || order.item?.name || "Unknown Item"}</p>
                                    <p className="text-amber-400 text-xs font-bold uppercase">
                                        {order.quantity}x @ ₹{order.itemPrice || order.item?.discountPrice || 0} = ₹{order.totalAmount || 0}
                                    </p>
                                </td>
                                <td className="p-4 align-top">
                                    <p className="font-bold text-white mb-1">{order.customerName}</p>
                                    <p className="text-gray-400 text-sm">📞 {order.phone}</p>
                                </td>
                                <td className="p-4 align-top">
                                    <p className="text-gray-300 text-sm">{order.location}</p>
                                </td>
                                <td className="p-4 align-top text-right">
                                    {order.isPaid ? (
                                        <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest rounded mb-1">
                                            ✓ Paid
                                        </span>
                                    ) : (
                                        <span className="inline-block px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-bold uppercase tracking-widest rounded mb-1">
                                            Unpaid
                                        </span>
                                    )}
                                    <br />
                                    <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded mt-1">
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderHistory;
