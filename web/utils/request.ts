import axios from 'axios';

export const request = axios.create({
  baseURL:
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      : process.env.API_URL,
});
