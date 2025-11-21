import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const LoginPage = () => {
  // Mode: true = Login, false = Signup
  const [isLogin, setIsLogin] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  
  // Animation View State: 'initial' -> 'expanded' -> 'shrinking' -> 'exiting'
  const [viewState, setViewState] = useState("initial");
  
  const { login, signup, isLoggingIn, isSigningUp } = useAuthStore();

  // 1. Auto-expand delay (Increased to 1.3s)
  useEffect(() => {
    const timer = setTimeout(() => setViewState("expanded"), 1300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!isLogin && !formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");

    // 2. Trigger "The Scenario" Exit Animation
    setViewState("shrinking");
    
    // Sequence: Shrink -> Drop -> Actual Auth Action
    setTimeout(() => {
        setViewState("exiting"); // Logo drops
        
        setTimeout(() => {
            const action = isLogin ? login : signup;
            action(formData).catch(() => {
                // If error, reset UI
                setViewState("expanded");
                toast.error("Authentication failed");
            });
        }, 600); // Wait for drop animation
    }, 1000); // Wait for shrink animation
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Clear form on toggle for cleaner UX (optional)
    setFormData({ ...formData, password: "" }); 
  };

  // Shared Visuals
  const ORB_GRADIENT = "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)";

  return (
    <div className="h-screen flex items-center justify-center bg-base-100 relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- RIPPLES (Visible only when expanded) --- */}
      <AnimatePresence>
        {viewState === "expanded" && (
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-20"
                style={{ background: ORB_GRADIENT }}
                initial={{ width: 150, height: 150, opacity: 0.5 }}
                animate={{ 
                  width: [300, 800], 
                  height: [300, 800], 
                  opacity: [0.2, 0] 
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* --- MORPHING CARD CONTAINER --- */}
      <motion.div
        layout
        className="relative z-10 bg-base-100 border border-base-200 shadow-2xl overflow-hidden flex flex-col items-center"
        // Define states for smooth morphing
        initial="initial"
        animate={viewState}
        variants={{
            initial:  { width: 100, height: 100, borderRadius: 50, y: 0, opacity: 1 },
            expanded: { width: 420, height: "auto", borderRadius: 24, y: 0, opacity: 1 },
            shrinking:{ width: 100, height: 100, borderRadius: 50, y: 0, opacity: 1 },
            exiting:  { width: 100, height: 100, borderRadius: 50, y: 400, opacity: 0 } // The Drop
        }}
        transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8
        }}
      >
        {/* 1. THE LOGO STATE (Visible when minimized or shrinking) */}
        <AnimatePresence mode="wait">
            {(viewState === "initial" || viewState === "shrinking" || viewState === "exiting") && (
                <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ background: ORB_GRADIENT }}
                >
                    <MessageSquare className="size-10 text-white fill-white/20" />
                </motion.div>
            )}
        </AnimatePresence>

        {/* 2. THE FORM STATE (Visible when expanded) */}
        {viewState === "expanded" && (
            <motion.div 
                className="w-full p-8 flex flex-col gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                {/* Header with Toggle Animation */}
                <div className="text-center">
                    <div className="mx-auto size-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform rotate-3" style={{ background: ORB_GRADIENT }}>
                        <MessageSquare className="size-7 text-white fill-white/20" />
                    </div>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "signup"}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h1 className="text-2xl font-bold">
                                {isLogin ? "Welcome Back!" : "Join the Wave 🌊"}
                            </h1>
                            <p className="text-base-content/60 text-sm mt-1">
                                {isLogin ? "Sign in to continue your flow" : "Create an account to start surfing"}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Full Name (Only for Signup) */}
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-1 pt-1">
                                    <label className="text-sm font-medium ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="size-5 text-base-content/40 group-focus-within:text-[#a1c4fd] transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            className="input w-full pl-10 bg-base-200/50 focus:bg-base-100 border-transparent focus:border-[#a1c4fd] focus:ring-4 focus:ring-[#a1c4fd]/10 transition-all rounded-xl"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-1">
                        <label className="text-sm font-medium ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="size-5 text-base-content/40 group-focus-within:text-[#a1c4fd] transition-colors" />
                            </div>
                            <input
                                type="email"
                                className="input w-full pl-10 bg-base-200/50 focus:bg-base-100 border-transparent focus:border-[#a1c4fd] focus:ring-4 focus:ring-[#a1c4fd]/10 transition-all rounded-xl"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="size-5 text-base-content/40 group-focus-within:text-[#a1c4fd] transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input w-full pl-10 bg-base-200/50 focus:bg-base-100 border-transparent focus:border-[#a1c4fd] focus:ring-4 focus:ring-[#a1c4fd]/10 transition-all rounded-xl"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center opacity-50 hover:opacity-100 transition-opacity"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Gradient Submit Button */}
                    <button 
                        type="submit" 
                        className="btn w-full border-none shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-xl text-white font-bold text-lg mt-4"
                        style={{ background: ORB_GRADIENT, color: "#4b5563" }}
                        disabled={isLoggingIn || isSigningUp}
                    >
                        {(isLoggingIn || isSigningUp) ? (
                            <Loader2 className="size-6 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                {isLogin ? "Sign In" : "Create Account"}
                                <ArrowRight className="size-5" />
                            </div>
                        )}
                    </button>
                </form>

                {/* Toggle Mode */}
                <div className="text-center text-sm text-base-content/60">
                    <button onClick={toggleMode} className="hover:text-[#a1c4fd] transition-colors flex items-center gap-1 mx-auto">
                        {isLogin ? (
                            <>Don&apos;t have an account? <span className="font-bold underline">Sign up</span></>
                        ) : (
                            <>Already have an account? <span className="font-bold underline">Sign in</span></>
                        )}
                    </button>
                </div>
            </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;