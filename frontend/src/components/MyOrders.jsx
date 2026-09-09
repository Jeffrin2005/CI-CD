import { useState, useEffect } from "react";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/orders/consumer", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            setError("❌ Could not load your orders.");
        } finally {
            setLoading(false);
        }
    };

    const downloadReceipt = (order) => {
        const content = `
════════════════════════════════════
        RESCUERESERVE RECEIPT
════════════════════════════════════
Order ID    : ${order._id?.slice(-10)?.toUpperCase()}
Date        : ${new Date(order._id ? parseInt(order._id.substring(0,8), 16) * 1000 : Date.now()).toLocaleString()}

ITEM DETAILS
────────────────────────────────────
Item        : ${order.itemName || order.item?.name || "N/A"}
Quantity    : ${order.quantity}
Price Each  : ₹${order.itemPrice || order.item?.discountPrice || 0}
Total Paid  : ₹${order.totalAmount || 0}

CUSTOMER DETAILS
────────────────────────────────────
Name        : ${order.customerName}
Phone       : ${order.phone}
Location    : ${order.location}

HOTEL DETAILS
────────────────────────────────────
Hotel Name  : ${order.restaurant?.name || "Partner Hotel"}
Contact     : +91 88888 55555

Status      : ${order.status?.toUpperCase()}
════════════════════════════════════
  Please show this receipt at pickup
════════════════════════════════════
        `.trim();

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `RescueReserve_Receipt_${order._id?.slice(-6)?.toUpperCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return <div className="text-gray-400 text-center py-20">Loading your orders...</div>;
    if (error) return <div className="text-red-400 text-center py-20">{error}</div>;

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl text-center">
                <span className="text-5xl mb-4">📦</span>
                <h2 className="text-xl font-bold text-white mb-2">No Orders Yet</h2>
                <p className="text-gray-500 text-sm">Browse hotels and reserve a surplus meal to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/20 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">
                                🏨 {order.restaurant?.name || "Partner Hotel"}
                            </p>
                            <h3 className="text-xl font-bold text-white">{order.itemName || order.item?.name || "Unknown Item"}</h3>
                            <p className="text-gray-400 text-sm mt-1">{order.quantity}x @ ₹{order.itemPrice || order.item?.discountPrice || 0} each</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-extrabold text-amber-400">₹{order.totalAmount || 0}</p>
                            {order.isPaid ? (
                                <span className="inline-block mt-1 px-2 py-1 text-xs font-bold uppercase rounded bg-green-500/20 text-green-400">
                                    PAID
                                </span>
                            ) : (
                                <span className={`inline-block mt-1 px-2 py-1 text-xs font-bold uppercase rounded ${order.status === "reserved" ? "bg-amber-500/20 text-amber-400" : order.status === "picked_up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                    {order.status}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4 mb-4 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Name</p>
                            <p className="text-white">{order.customerName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Phone</p>
                            <p className="text-white">{order.phone}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Location</p>
                            <p className="text-white">{order.location}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-xs">
                            Order ID: <span className="font-mono text-gray-400">{order._id?.slice(-10)?.toUpperCase()}</span>
                        </p>
                        <button
                            onClick={() => downloadReceipt(order)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors"
                        >
                            ⬇ Download Receipt
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyOrders;
