// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig


module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: 'http://localhost:5000/:slug*' // Matched parameters can be used in the destination
      }
    ]
  },
  images: {
    domains: [],
  },
};
