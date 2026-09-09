import { useState, useEffect } from "react";

function AddFoodForm({ user, setActiveTab }) {
    const [hotelName, setHotelName] = useState("");
    const [place, setPlace] = useState("");
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user) {
            setHotelName(user.name || "My Hotel");
        }
    }, [user]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/items/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: itemName,
                    description: description,
                    originalPrice: Number(originalPrice),
                    discountPrice: Number(discountPrice),
                    quantity: Number(quantity),
                    restaurant: user._id
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage("❌ " + data.message);
            } else {
                setMessage("✅ Item added successfully!");
                setItemName("");
                setDescription("");
                setOriginalPrice("");
                setDiscountPrice("");
                setQuantity("");
            }
        } catch (error) {
            setMessage("❌ Cannot connect to server.");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-3xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            {message && (
                <div className={`mb-6 px-4 py-4 rounded-lg text-sm font-bold flex justify-between items-center ${message.startsWith("✅") ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                    <span>{message}</span>
                    {message.startsWith("✅") && (
                        <button 
                            onClick={() => setActiveTab("listings")}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded transition-colors text-xs uppercase tracking-wider"
                        >
                            View in My Listings →
                        </button>
                    )}
                </div>
            )}

            <form onSubmit={handleAddItem} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Hotel Details */}
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <h3 className="text-amber-400 text-xs uppercase tracking-widest font-bold border-b border-white/10 pb-2 mb-4">Hotel Details</h3>
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Hotel / Restaurant Name</label>
                            <input
                                type="text"
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                className="w-full bg-gray-900 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                                placeholder="The Grand Palace Hotel"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Location / Place</label>
                            <input
                                type="text"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
                                className="w-full bg-gray-900 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                                placeholder="Downtown City Center"
                                required
                            />
                        </div>
                    </div>

                    {/* Food Details */}
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <h3 className="text-amber-400 text-xs uppercase tracking-widest font-bold border-b border-white/10 pb-2 mb-4">Item Details</h3>
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Food Item Name</label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full bg-gray-900 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                                placeholder="Truffle Risotto"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                                className="w-full bg-gray-900 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                                placeholder="Leftover premium portions from our banquet."
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Pricing & Quantity Grid */}
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Original Price (₹ per item)</label>
                        <input
                            type="number"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            className="w-full bg-gray-900 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="1800"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Discount Price (₹ per item)</label>
                        <input
                            type="number"
                            value={discountPrice}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                            className="w-full bg-gray-900 border border-amber-500/50 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="450"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Quantity Available</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full bg-gray-900 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="5"
                            required
                            min="1"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-lg uppercase tracking-widest text-sm transition-colors"
                >
                    {loading ? "Adding Item..." : "Publish Food Listing"}
                </button>
            </form>
        </div>
    );
}

export default AddFoodForm;
