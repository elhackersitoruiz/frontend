/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  //output: 'export',
  assetPrefix: './', // Ensure correct relative path for assets
};

export default nextConfig;
