import { useState } from 'react';
import { Heart, MessageCircle, Share2, Search, Home, Compass, PlusCircle, Mail, Bell, User } from 'lucide-react';

const samplePosts = [
  {
    id: 1,
    author: 'Alex Chen',
    handle: '@alexchen',
    avatar: '👨‍💻',
    content: 'Just launched my new AI assistant feature! 🚀',
    likes: 1240,
    comments: 89,
    shares: 34,
    timestamp: '2h ago',
  },
  {
    id: 2,
    author: 'Sarah Mitchell',
    handle: '@sarahmitch',
    avatar: '👩‍🎨',
    content: 'The future of social media is here. Excited to be part of NEXA! 💜',
    likes: 2103,
    comments: 156,
    shares: 89,
    timestamp: '4h ago',
  },
];

export default function FeedLayout() {
  const [posts] = useState(samplePosts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="hidden md:flex w-64 h-screen bg-black/40 border-r border-white/10 flex-col p-6 fixed">
          <h1 className="text-2xl font-bold text-white mb-8">NEXA</h1>
          <nav className="space-y-4 flex-1">
            {[
              { icon: Home, label: 'Home' },
              { icon: Compass, label: 'Explore' },
              { icon: PlusCircle, label: 'Create' },
              { icon: Mail, label: 'Messages' },
              { icon: Bell, label: 'Notifications' },
              { icon: User, label: 'Profile' },
            ].map((item, i) => (
              <button key={i} className="flex items-center gap-4 w-full px-4 py-3 rounded-lg hover:bg-white/10 transition text-purple-200">
                <item.icon className="w-6 h-6" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">Post</button>
        </div>

        {/* Main Feed */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-lg border-b border-white/10 p-4">
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search NEXA..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="max-w-2xl mx-auto">
            {/* Compose Post */}
            <div className="glass m-4 p-4 rounded-xl">
              <div className="flex gap-4">
                <span className="text-4xl">👤</span>
                <div className="flex-1">
                  <textarea
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent text-white placeholder-purple-300 text-xl outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-4">
                    <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg transition">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} className="glass m-4 p-6 rounded-xl">
                <div className="flex gap-4 mb-4">
                  <span className="text-4xl">{post.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{post.author}</span>
                      <span className="text-purple-400">{post.handle}</span>
                      <span className="text-purple-300">·</span>
                      <span className="text-purple-300 text-sm">{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-white mb-4 text-lg">{post.content}</p>

                <div className="flex justify-between text-purple-300 pt-4 border-t border-white/10">
                  <button className="flex items-center gap-2 hover:text-red-400 transition group">
                    <div className="w-8 h-8 rounded-full group-hover:bg-red-400/20 flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-400 transition group">
                    <div className="w-8 h-8 rounded-full group-hover:bg-blue-400/20 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-400 transition group">
                    <div className="w-8 h-8 rounded-full group-hover:bg-green-400/20 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{post.shares}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Trending */}
        <div className="hidden lg:block w-80 h-screen border-l border-white/10 p-6 fixed right-0 top-0 bg-black/40">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">What's happening</h2>
            {['AI & Technology', 'Social Media', 'Web3', 'Creators', 'Video Content'].map((trend, i) => (
              <div key={i} className="hover:bg-white/5 p-3 rounded-lg transition cursor-pointer">
                <p className="text-purple-400 text-sm">Trending Worldwide</p>
                <p className="text-white font-bold">{trend}</p>
                <p className="text-purple-300 text-sm">2.5M Posts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
