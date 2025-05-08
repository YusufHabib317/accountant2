// next.config.js
module.exports = {
  reactStrictMode: true,
  // Add this to see more detailed errors
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  // Add custom error handling
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Tell Next.js to expose detailed errors even in production
  productionBrowserSourceMaps: true,
};
