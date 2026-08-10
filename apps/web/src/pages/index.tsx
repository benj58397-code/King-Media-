import Head from 'next/head';
import { useState, useEffect } from 'react';
import WeatherDashboard from '@/components/WeatherDashboard';

export default function Home() {
  return (
    <>
      <Head>
        <title>NEXA 2030 - Social Media Platform</title>
        <meta name="description" content="Next-generation social media platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen">
        <WeatherDashboard />
      </main>
    </>
  );
}
