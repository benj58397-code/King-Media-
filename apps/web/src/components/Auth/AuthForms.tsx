import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AuthFormsProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export default function AuthForms({ isLogin, setIsLogin }: AuthFormsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to feed
      window.location.href = '/feed';
    }, 2000);
  };

  return (
    <div className="glass p-8 rounded-2xl">
      <h2 className="text-3xl font-bold text-white mb-2">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-purple-200 mb-8">
        {isLogin ? 'Sign in to your account' : 'Join NEXA 2030 today'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isLogin && (
          <div className="text-right">
            <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
              Forgot password?
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      {/* OAuth Options */}
      <div className="mt-6 space-y-3">
        <button className="w-full py-2 px-4 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center justify-center gap-2">
          <span>🔵</span> Continue with Google
        </button>
        <button className="w-full py-2 px-4 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center justify-center gap-2">
          <span>🍎</span> Continue with Apple
        </button>
      </div>

      <p className="text-center text-purple-200 mt-6 text-sm">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-purple-400 hover:text-purple-300 font-semibold"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
