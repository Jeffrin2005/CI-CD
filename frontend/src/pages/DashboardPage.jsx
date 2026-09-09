import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RestaurantSidebar from "../components/RestaurantSidebar";
import AddFoodForm from "../components/AddFoodForm";
import MyListings from "../components/MyListings";
import ConsumerDashboard from "../components/ConsumerDashboard";
import OrderHistory from "../components/OrderHistory";
import ConsumerSidebar from "../components/ConsumerSidebar";
import MyOrders from "../components/MyOrders";

function DashboardPage() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("add"); // restaurant: "add", "listings", "orders"
    const [consumerTab, setConsumerTab] = useState("browse"); // consumer: "browse", "orders"
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    // ----------------------------------------------------------------------
    // RESTAURANT DASHBOARD LAYOUT
    // ----------------------------------------------------------------------
    if (user?.role === "restaurant") {
        return (
            <div className="flex min-h-screen bg-gray-950 text-white">
                <RestaurantSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content Area */}
                <main className="ml-64 flex-1 p-10 overflow-y-auto">
                    <header className="mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                            {activeTab === "add" && "Create Listing"}
                            {activeTab === "listings" && "My Listings"}
                            {activeTab === "orders" && "Order History"}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {activeTab === "add" && "Add a new surplus food item to the marketplace."}
                            {activeTab === "listings" && "Manage the food items you have published."}
                            {activeTab === "orders" && "View reservations made by customers."}
                        </p>
                    </header>
                    
                    {activeTab === "add" && <AddFoodForm user={user} setActiveTab={setActiveTab} />}
                    {activeTab === "listings" && <MyListings />}
                    {activeTab === "orders" && <OrderHistory />}
                </main>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // CONSUMER / GUEST DASHBOARD LAYOUT (WITH SIDEBAR)
    // ----------------------------------------------------------------------
    if (user) {
        return (
            <div className="flex min-h-screen bg-gray-950 text-white">
                <ConsumerSidebar user={user} activeTab={consumerTab} setActiveTab={setConsumerTab} />

                {/* Main Content Area */}
                <main className="ml-64 flex-1 p-10 overflow-y-auto">
                    <header className="mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                            {consumerTab === "browse" && "Browse Hotels"}
                            {consumerTab === "orders" && "My Orders"}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {consumerTab === "browse" && "Discover surplus cuisine from the finest partner hotels."}
                            {consumerTab === "orders" && "View your reservation history and download receipts."}
                        </p>
                    </header>

                    {consumerTab === "browse" && <ConsumerDashboard user={user} />}
                    {consumerTab === "orders" && <MyOrders />}
                </main>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // NOT LOGGED IN — Redirect to login
    // ----------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-extrabold text-white mb-4">Welcome to Rescue<span className="text-amber-400">Reserve</span></h1>
                <p className="text-gray-400 mb-8">Please log in to continue.</p>
                <Link to="/login" className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl uppercase tracking-widest text-sm transition-colors">
                    Sign In
                </Link>
            </div>
        </div>
    );
}

export default DashboardPage;
