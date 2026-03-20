/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	basePath: '/interview-prep-blog',
	assetPrefix: '/interview-prep-blog/',
	images: { unoptimized: true },
	trailingSlash: true,
}

export default nextConfig
