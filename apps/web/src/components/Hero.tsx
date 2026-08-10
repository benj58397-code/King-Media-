export default function Hero() {
  return (
    <div className="hidden md:block">
      <div className="mb-8">
        <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Welcome to NEXA 2030
        </div>
        <p className="text-xl text-purple-200 leading-relaxed">
          The next-generation social media platform designed for the future. Connect, create, and collaborate with AI-powered tools.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">AI Assistant</h3>
            <p className="text-purple-200">Personalized AI helps with content creation and discovery</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-2xl">🎬</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Creator Tools</h3>
            <p className="text-purple-200">Professional tools for content creators and influencers</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-2xl">🌍</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Global Community</h3>
            <p className="text-purple-200">Connect with millions of creators worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}
