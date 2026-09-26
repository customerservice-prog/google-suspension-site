import type {NextConfig} from 'next';
const nextConfig:NextConfig={async headers(){return [{source:'/packet',headers:[{key:'Cache-Control',value:'private, no-store'}]},{source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},{key:'Content-Security-Policy',value:"object-src 'none'; base-uri 'self'; form-action 'self' https://checkout.stripe.com"}]}];}};
export default nextConfig;
