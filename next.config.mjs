// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
//   output: 'standalone',
// }

// export default nextConfig




/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/transparencia-fiscal-operativo',
  assetPrefix: '/transparencia-fiscal-operativo',
  trailingSlash: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
}

export default nextConfig
