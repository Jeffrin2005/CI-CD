import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState("consumer");

    // --- Form field state ---
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // --- UI state ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate(); // to redirect after login

    // -----------------------------------------------
    // HANDLE FORM SUBMIT
    // -----------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault(); // stop page from refreshing
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (isLogin) {
                // ---- LOGIN ----
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // Backend sent an error (wrong password, user not found etc.)
                    setError(data.message);
                } else {
                    // ✅ Login successful! Save the JWT token (our "member card")
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setSuccess("Login successful! Redirecting...");
                    setTimeout(() => navigate("/dashboard"), 1000);
                }

            } else {
                // ---- REGISTER ----
                const response = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message);
                } else {
                    // ✅ Registered! Switch to login tab
                    setSuccess("Account created! Please sign in.");
                    setIsLogin(true);
                    setName("");
                    setEmail("");
                    setPassword("");
                }
            }

        } catch (err) {
            // Network error (backend not running etc.)
            setError("Cannot connect to server. Is the backend running?");
        }

        setLoading(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center">
                <Link to="/" className="text-white font-bold text-xl tracking-widest uppercase">
                    Rescue<span className="text-amber-400">Reserve</span>
                </Link>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">
                    ← Back to Home
                </Link>
            </nav>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-auto px-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            {isLogin
                                ? "Please authenticate to reserve your culinary experience."
                                : "Join us and discover premium surplus cuisine."}
                        </p>
                    </div>

                    {/* Toggle Login / Register */}
                    <div className="flex bg-white/5 rounded-lg p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(true);
                                setError("");
                                setSuccess("");
                            }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLogin ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isLogin ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"}`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Role Selector — only on Register */}
                    {!isLogin && (
                        <div className="flex gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setRole("consumer")}
                                className={`flex-1 py-2 text-xs font-bold rounded-md border uppercase tracking-wider transition-all ${role === "consumer"
                                    ? "border-amber-400 text-amber-400 bg-amber-400/10"
                                    : "border-white/20 text-gray-500 hover:border-white/40"}`}
                            >
                                🍽 Guest
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("restaurant")}
                                className={`flex-1 py-2 text-xs font-bold rounded-md border uppercase tracking-wider transition-all ${role === "restaurant"
                                    ? "border-amber-400 text-amber-400 bg-amber-400/10"
                                    : "border-white/20 text-gray-500 hover:border-white/40"}`}
                            >
                                🏨 Restaurant
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm text-center">
                            ✅ {success}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Name — only on Register */}



                        {!isLogin && (
                            <div>
                                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder-gray-600"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder-gray-600"
                            />
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder-gray-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg uppercase tracking-widest text-sm transition-colors"
                        >
                            {loading
                                ? "Please wait..."
                                : isLogin
                                    ? "Sign In"
                                    : `Register as ${role === "consumer" ? "Guest" : "Restaurant"}`}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default LoginPage;
