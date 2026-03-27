import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, X } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginView, setShowLoginView] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginView(false);
    setShowGooglePrompt(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  // --- LOGIN VIEW ---
  if (showLoginView) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={LOGO_URL} alt="UnitPulse" className="h-12" />
            </div>
            <h1 className="text-3xl font-black text-black uppercase tracking-wider">Welcome to UnitPulse</h1>
            <p className="text-neutral-500 font-medium">Find your perfect home with AI-powered search.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full h-14 bg-white border-2 border-black/5 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-50 transition-all group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5" />
              <span className="text-sm font-black text-black uppercase tracking-wider">Continue with Google</span>
            </button>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider font-black text-neutral-400 bg-white px-4">Or</div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-email" className="text-xs font-bold text-neutral-600 uppercase tracking-wider px-1">Email Address</label>
                <input id="login-email" type="email" placeholder="you@example.com" autoComplete="email" className="w-full h-14 px-6 bg-neutral-50 border border-black/5 rounded-2xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-password" className="text-xs font-bold text-neutral-600 uppercase tracking-wider px-1">Password</label>
                <div className="relative">
                  <input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" className="w-full h-14 px-6 pr-14 bg-neutral-50 border border-black/5 rounded-2xl text-sm focus:outline-none focus:border-black transition-all" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button onClick={handleLogin} className="w-full h-14 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-neutral-800 transition-all">
                Sign In
              </button>
            </div>
          </div>

          <div className="text-center">
            <button className="text-xs font-medium text-neutral-400 hover:text-black transition-colors">
              Don't have an account? <span className="text-black font-semibold">Sign up</span>
            </button>
          </div>

          <button
            onClick={() => setShowLoginView(false)}
            className="absolute top-8 right-8 p-3 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default App;
