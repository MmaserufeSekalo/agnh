// src/types/express-session.d.ts or src/express-session.d.ts

import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    paymentData: {
      amount: string;
      item_name: string;
      return_url: string;
      cancel_url: string;
      notify_url: string;
      custom_str1?: string;
      custom_str2?: string;
    };
  }
}

declare module 'express' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}
