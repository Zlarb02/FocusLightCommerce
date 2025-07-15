declare global {
  interface Window {
    ENV: {
      API_URL: string;
      NODE_ENV: string;
      STRIPE_PUBLISHABLE_KEY: string;
    };
  }
}

export {};
