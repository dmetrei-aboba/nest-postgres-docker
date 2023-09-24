import 'dotenv/config.js';

export const DB = {
  URL: process.env.DATABASE_URL,
};

export const JWT = {
  SECRET_KEY: process.env.SECRET_KEY || '123',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d', // default 1 day
};
