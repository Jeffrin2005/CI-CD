import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* PASTE YOUR NAVBAR HERE! */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <div className="text-white font-bold text-xl tracking-widest uppercase pointer-events-auto">
          Rescue<span className="text-amber-400">Reserve</span>
        </div>
        <div className="space-x-8 hidden md:block pointer-events-auto">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">Home</Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">Menu</Link>
          <Link to="/login" className="text-gray-300 hover:text-amber-400 transition-colors text-sm uppercase tracking-wider">Member Access</Link>
        </div>
      </nav>

      {/* Background Image with Slow Zoom effect (like a video) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.png"
          alt="Luxury Restaurant Facade"
          className="w-full h-full object-cover scale-105"
        />
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-black/60 overlay-breathe"></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
          Zero Waste. <span className="text-amber-400">Premium Taste.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light max-w-2xl">
          Experience world-class culinary surplus from the finest hotels and restaurants, curated just for you.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <Link
            to="/login"
            className="group relative px-8 py-4 bg-amber-500 text-black font-semibold text-lg overflow-hidden rounded-sm transition-all hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]"
          >
            <div className="absolute inset-0 w-0 bg-white transition-all duration-[400ms] ease-out group-hover:w-full opacity-20"></div>
            <span className="relative tracking-wider uppercase">Sign In</span>
          </Link>

          <Link
            to="/dashboard"
            className="group relative px-8 py-4 bg-transparent border border-white text-white font-semibold text-lg overflow-hidden rounded-sm transition-all hover:bg-white hover:text-black"
          >
            <span className="relative tracking-wider uppercase">View Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;