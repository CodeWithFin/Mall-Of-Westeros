'use client';

import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import Title from './Title';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <div className="flex flex-col items-center mx-4 my-36">
      <Title
        title="Join Newsletter"
        description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week."
        visibleButton={false}
        href="#"
      />
      <form
        onSubmit={handleSubmit}
        className="flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200"
      >
        <input
          className="flex-1 pl-5 outline-none bg-transparent"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="font-medium bg-green-500 text-white px-7 py-3 rounded-full hover:bg-green-600 transition"
        >
          Get Updates
        </button>
      </form>
    </div>
  );
}
