'use client';

import { useState } from 'react';

/** Demo only: nothing is sent or stored. */
export function NewsletterForm() {
  const [done, setDone] = useState(false);

  if (done) return <p className="text-sm text-white/70">Thanks! (Demo store, no email was sent.)</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="flex max-w-sm items-center border-b border-white/40 focus-within:border-white"
    >
      <label htmlFor="newsletter" className="sr-only">Email</label>
      <input
        id="newsletter"
        type="email"
        required
        autoComplete="email"
        placeholder="Enter your email"
        className="flex-1 bg-transparent py-2.5 text-sm placeholder:text-white/60 focus:outline-none"
      />
      <button type="submit" className="py-2.5 text-sm font-medium hover:text-white/80">Subscribe</button>
    </form>
  );
}
