import { useState, useEffect } from "react";

function ConsumerDashboard({ user }) {
    const [allItems, setAllItems] = useState([]);
    const [groupedByHotel, setGroupedByHotel] = useState({});
    const [selectedHotelId, setSelectedHotelId] = useState(null);

    // Reservation State
    const [reservingItem, setReservingItem] = useState(null);
    const [reserveForm, setReserveForm] = useState({ name: user?.name || "", phone: "", location: "", quantity: 1 });
    const [reserveStatus, setReserveStatus] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAllItems();
        // Load the Razorpay script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const fetchAllItems = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/items/all");

            if (!response.ok) throw new Error("Failed to fetch food items");

            const data = await response.json();
            setAllItems(data);

            // Group the items by Hotel ID so we can show a list of Hotels first
            const grouped = {};
            data.forEach(item => {
                if (item.restaurant) {
                    const hotelId = item.restaurant._id;
                    if (!grouped[hotelId]) {
                        grouped[hotelId] = {
                            hotelName: item.restaurant.name,
                            items: []
                        };
                    }
                    grouped[hotelId].items.push(item);
                }
            });
            setGroupedByHotel(grouped);

        } catch (err) {
            setError("❌ Could not load available food. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    // Receipt State (shown after payment success)
    const [receipt, setReceipt] = useState(null);

    // Simulated Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "upi"
    const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "", name: "" });
    const [upiId, setUpiId] = useState("");
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // Called when user fills reservation form and clicks "Proceed to Payment"
    const handleReserveSubmit = async (e) => {
        e.preventDefault();
        // Move to the payment modal
        setShowPaymentModal(true);
    };

    // Called when user clicks "Pay Now" inside the payment modal
    const handlePayNow = async () => {
        setPaymentProcessing(true);
        const token = localStorage.getItem("token");
        const totalAmount = reservingItem.discountPrice * Number(reserveForm.quantity);

        try {
            // Simulate a 2-second payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate a fake payment ID for demo
            const fakePaymentId = "pay_" + Date.now();
            const fakeOrderId = "order_" + Date.now();

            // Save the order to the backend (same as real checkout)
            const res = await fetch("http://localhost:5000/api/orders/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    consumer: user._id,
                    item: reservingItem._id,
                    restaurant: reservingItem.restaurant._id || reservingItem.restaurant,
                    customerName: reserveForm.name,
                    phone: reserveForm.phone,
                    location: reserveForm.location,
                    quantity: Number(reserveForm.quantity),
                    paymentId: fakePaymentId
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Checkout failed");
            }

            const orderData = await res.json();

            // Save receipt data BEFORE clearing anything
            const receiptData = {
                orderId: orderData.order._id,
                paymentId: fakePaymentId,
                itemName: reservingItem.name,
                quantity: reserveForm.quantity,
                amount: totalAmount,
                customerName: reserveForm.name,
                phone: reserveForm.phone,
                location: reserveForm.location,
                hotelName: reservingItem.restaurant?.name || "Partner Hotel",
                hotelContact: "+91 88888 55555",
            };

            // Close modals
            setShowPaymentModal(false);
            setReservingItem(null);
            setSelectedHotelId(null); // Go back to hotel list to avoid blank screen
            setReceipt(receiptData);
            // Don't fetchAllItems here — do it when receipt is dismissed

        } catch (err) {
            setReserveStatus(err.message || "Payment failed.");
            setShowPaymentModal(false);
        } finally {
            setPaymentProcessing(false);
        }
    };


    if (loading) return <div className="text-gray-400 text-center py-20">Searching for available surplus cuisine...</div>;
    if (error) return <div className="text-red-400 text-center py-20">{error}</div>;

    const hotels = Object.keys(groupedByHotel);

    // ----------------------------------------------------
    // RESERVATION MODAL
    // ----------------------------------------------------
    const renderReservationModal = () => {
        if (!reservingItem) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                    <button
                        onClick={() => setReservingItem(null)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    >
                        ✕
                    </button>

                    <h2 className="text-2xl font-bold text-white mb-2">Reserve Order</h2>
                    <p className="text-amber-400 text-sm mb-6">You are reserving: <span className="font-bold text-white">{reservingItem.name}</span></p>

                    {/* Price Preview */}
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3 mb-2 flex justify-between">
                        <span className="text-gray-400 text-sm">Total Payment</span>
                        <span className="text-amber-400 font-bold text-lg">₹{reservingItem.discountPrice * Number(reserveForm.quantity)}</span>
                    </div>

                    {(
                        <form onSubmit={handleReserveSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                                <input type="text" required value={reserveForm.name} onChange={(e) => setReserveForm({ ...reserveForm, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                                    <input type="tel" required value={reserveForm.phone} onChange={(e) => setReserveForm({ ...reserveForm, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="+91 98765 43210" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Quantity (Max {reservingItem.quantity})</label>
                                    <input type="number" required min="1" max={reservingItem.quantity} value={reserveForm.quantity} onChange={(e) => setReserveForm({ ...reserveForm, quantity: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Location / Area</label>
                                <input type="text" required value={reserveForm.location} onChange={(e) => setReserveForm({ ...reserveForm, location: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="Downtown City" />
                            </div>

                            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <p className="text-xs text-amber-400 mb-1 font-bold uppercase tracking-widest">Hotel Contact (Temporary)</p>
                                <p className="text-white text-sm">📞 +91 88888 55555</p>
                                <p className="text-gray-500 text-xs mt-1">Call this number for any location queries regarding your pickup.</p>
                            </div>

                            {reserveStatus !== "" && reserveStatus !== "processing" && reserveStatus !== "success" && (
                                <p className="text-red-400 text-sm mt-2">❌ {reserveStatus}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                            >
                                Proceed to Payment →
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    };

    // ----------------------------------------------------
    // SIMULATED PAYMENT MODAL
    // ----------------------------------------------------
    const renderPaymentModal = () => {
        if (!showPaymentModal || !reservingItem) return null;
        const totalAmount = reservingItem.discountPrice * Number(reserveForm.quantity);

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-extrabold text-white">Complete Payment</h2>
                            <p className="text-amber-400 text-sm mt-1">Total: <span className="font-bold text-white text-lg">₹{totalAmount}</span></p>
                        </div>
                        <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-white">✕</button>
                    </div>

                    {/* Payment Method Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setPaymentMethod("card")}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${paymentMethod === "card" ? "bg-amber-500 text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                        >
                            💳 Card
                        </button>
                        <button
                            onClick={() => setPaymentMethod("upi")}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${paymentMethod === "upi" ? "bg-amber-500 text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                        >
                            📱 UPI
                        </button>
                    </div>

                    {paymentMethod === "card" ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Card Number</label>
                                <input maxLength={19} value={cardForm.number} onChange={(e) => { const v = e.target.value.replace(/\D/g,"").slice(0,16); setCardForm({...cardForm, number: v.replace(/(\d{4})/g,"$1 ").trim()}); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500" placeholder="1234 5678 9012 3456" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Expiry</label>
                                    <input maxLength={5} value={cardForm.expiry} onChange={(e) => { const v = e.target.value.replace(/\D/g,""); setCardForm({...cardForm, expiry: v.length > 2 ? v.slice(0,2)+"/"+v.slice(2) : v}); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500" placeholder="MM/YY" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">CVV</label>
                                    <input maxLength={3} type="password" value={cardForm.cvv} onChange={(e) => setCardForm({...cardForm, cvv: e.target.value.replace(/\D/g,"")})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500" placeholder="•••" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Name on Card</label>
                                <input value={cardForm.name} onChange={(e) => setCardForm({...cardForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="John Doe" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">UPI ID</label>
                            <input value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="yourname@upi" />
                        </div>
                    )}

                    <button
                        onClick={handlePayNow}
                        disabled={paymentProcessing}
                        className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-xl uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center gap-2"
                    >
                        {paymentProcessing ? (
                            <><span className="animate-spin">⟳</span> Processing...</>
                        ) : (
                            <>Pay ₹{totalAmount} Now 🔒</>
                        )}
                    </button>

                    <p className="text-gray-600 text-xs text-center mt-4">🔒 Secured Demo Payment — No real money deducted</p>
                </div>
            </div>
        );
    };

    
    const renderReceiptModal = () => {
        if (!receipt) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <span className="text-5xl">🎉</span>
                        <h2 className="text-2xl font-extrabold text-white mt-3">Payment Successful!</h2>
                        <p className="text-green-400 text-sm mt-1">Your reservation is confirmed. Save this receipt!</p>
                    </div>

                    {/* Receipt Body */}
                    <div className="bg-black/50 border border-white/10 rounded-xl p-6 space-y-3 text-sm mb-6">
                        <div className="flex justify-between border-b border-white/5 pb-3">
                            <span className="text-gray-400">Order ID</span>
                            <span className="text-white font-mono text-xs">{receipt.orderId?.slice(-10)?.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-3">
                            <span className="text-gray-400">Payment ID</span>
                            <span className="text-white font-mono text-xs">{receipt.paymentId}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-3">
                            <span className="text-gray-400">Item Reserved</span>
                            <span className="text-white font-bold">{receipt.quantity}x {receipt.itemName}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-3">
                            <span className="text-gray-400">Amount Paid</span>
                            <span className="text-amber-400 font-bold text-lg">₹{receipt.amount}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-3">
                            <span className="text-gray-400">Customer</span>
                            <span className="text-white">{receipt.customerName}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-3">
                            <span className="text-gray-400">Phone</span>
                            <span className="text-white">{receipt.phone}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-3">
                            <span className="text-gray-400">Pickup From</span>
                            <span className="text-white font-bold">{receipt.hotelName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Hotel Contact</span>
                            <span className="text-amber-400 font-bold">📞 {receipt.hotelContact}</span>
                        </div>
                    </div>

                    <p className="text-gray-500 text-xs text-center mb-4">Please show this receipt and pick up your food within 2 hours.</p>

                    <button
                        onClick={() => {
                            const content = `
════════════════════════════════════
        RESCUERESERVE RECEIPT
════════════════════════════════════
Order ID    : ${receipt.orderId?.slice(-10)?.toUpperCase()}
Payment ID  : ${receipt.paymentId}

ITEM DETAILS
────────────────────────────────────
Item        : ${receipt.itemName}
Quantity    : ${receipt.quantity}
Total Paid  : ₹${receipt.amount}

CUSTOMER DETAILS
────────────────────────────────────
Name        : ${receipt.customerName}
Phone       : ${receipt.phone}
Location    : ${receipt.location}

HOTEL DETAILS
────────────────────────────────────
Hotel Name  : ${receipt.hotelName}
Contact     : ${receipt.hotelContact}
════════════════════════════════════
  Please show this receipt at pickup
════════════════════════════════════
                            `.trim();
                            const blob = new Blob([content], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `Receipt_${receipt.orderId?.slice(-6)?.toUpperCase()}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="w-full mb-3 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold rounded-xl uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        ⬇ Download Receipt
                    </button>

                    <button
                        onClick={() => { setReceipt(null); fetchAllItems(); }}
                        className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl uppercase tracking-widest text-sm transition-colors"
                    >
                        Done ✓
                    </button>
                </div>
            </div>
        );
    };


    // ----------------------------------------------------
    // VIEW 1: Showing the list of HOTELS
    // ----------------------------------------------------
    if (!selectedHotelId) {
        if (hotels.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl text-center">
                    {renderReceiptModal()}
                    <span className="text-5xl mb-4">😔</span>
                    <h2 className="text-xl font-bold text-white mb-2">No Food Available Today</h2>
                    <p className="text-gray-500 text-sm">Check back later! Our partner hotels usually post surplus after 9:00 PM.</p>
                </div>
            );
        }

        return (
            <div>
                {renderReservationModal()}
                {renderPaymentModal()}
                {renderReceiptModal()}
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Participating Hotels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map(hotelId => {
                        const hotelData = groupedByHotel[hotelId];
                        return (
                            <div
                                key={hotelId}
                                onClick={() => setSelectedHotelId(hotelId)}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-500/50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-black text-2xl group-hover:scale-110 transition-transform">
                                        🏨
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{hotelData.hotelName || "Partner Hotel"}</h3>
                                        <p className="text-amber-400 text-xs uppercase tracking-wider">
                                            {hotelData.items.length} offers available
                                        </p>
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-transparent border border-white/20 text-white text-xs font-bold rounded-md uppercase tracking-wider group-hover:border-amber-500/50 group-hover:text-amber-400 transition-colors">
                                    View Menu →
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ----------------------------------------------------
    // VIEW 2: Showing the FOOD ITEMS for the Selected Hotel
    // ----------------------------------------------------
    const selectedHotelData = groupedByHotel[selectedHotelId];

    // Safety: if the hotel no longer has items (e.g. all reserved), go back
    if (!selectedHotelData) {
        return (
            <div>
                {renderReceiptModal()}
                <div className="text-center py-20">
                    <span className="text-5xl mb-4 block">✅</span>
                    <h2 className="text-xl font-bold text-white mb-2">All items from this hotel have been reserved!</h2>
                    <button onClick={() => { setSelectedHotelId(null); fetchAllItems(); }} className="mt-4 px-6 py-3 bg-amber-500 text-black font-bold rounded-xl uppercase tracking-widest text-sm">← Back to Hotels</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {renderReservationModal()}
            {renderPaymentModal()}
            {renderReceiptModal()}
            <button
                onClick={() => setSelectedHotelId(null)}
                className="mb-8 text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider flex items-center gap-2"
            >
                ← Back to Hotels
            </button>

            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-black text-3xl shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                    🏨
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">{selectedHotelData.hotelName || "Partner Hotel"}</h2>
                    <p className="text-amber-400 text-sm uppercase tracking-widest mt-1">Available Surplus Menu</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedHotelData.items.map((item) => (
                    <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors group flex flex-col">
                        <div className="h-40 bg-gray-900 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50 group-hover:scale-110 transition-transform">
                                🍲
                            </div>
                            <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg">
                                {item.quantity} Left
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>

                            <div className="flex justify-between items-end pt-4 border-t border-white/10 mb-4">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Rescue Price</p>
                                    <p className="text-2xl font-bold text-amber-400">₹{item.discountPrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Original</p>
                                    <p className="text-sm font-bold text-gray-500 line-through">₹{item.originalPrice}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setReservingItem(item)}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg uppercase tracking-widest text-xs transition-colors shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                            >
                                Reserve Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConsumerDashboard;

