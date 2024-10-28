/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config for next 14 
    since next 15, Moved from experimental to stable. Renamed from serverComponentsExternalPackages to serverExternalPackages
    experimental: {
        instrumentationHook: true,
        serverComponentsExternalPackages: ["pino", "@opentelemetry/instrumentation-pino"]
    },
    */
    serverExternalPackages: ["pino", "@opentelemetry/instrumentation-pino"]
}
export default nextConfig;
