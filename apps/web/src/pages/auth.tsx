import Head from 'next/head';
import { useState } from 'react';
import AuthForms from '@/components/Auth/AuthForms';
import Hero from '@/components/Hero';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Head>
        <title>Sign In to NEXA 2030</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-full max-w-6xl px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Hero />
            <AuthForms isLogin={isLogin} setIsLogin={setIsLogin} />
          </div>
        </div>
      </div>
    </>
  );
}
