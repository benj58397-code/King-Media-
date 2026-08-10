import Head from 'next/head';
import FeedLayout from '@/components/Feed/FeedLayout';

export default function FeedPage() {
  return (
    <>
      <Head>
        <title>Home - NEXA 2030</title>
      </Head>
      <FeedLayout />
    </>
  );
}
