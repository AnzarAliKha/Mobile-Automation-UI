import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const Config = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  defaultUser: {
    username: process.env.DEFAULT_USERNAME || 'standard_user',
    password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
  },
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
  },
  isCI: !!process.env.CI,
};
