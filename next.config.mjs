import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	basePath: '/interview-prep-blog',
	assetPrefix: '/interview-prep-blog/',
	images: { unoptimized: true },
	trailingSlash: true,
}

export default withBundleAnalyzer(nextConfig)
