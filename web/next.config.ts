import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', port: '', pathname: '**' },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./configs/i18n.ts');
export default withNextIntl(nextConfig);
