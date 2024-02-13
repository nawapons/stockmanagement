/** @type {import('next').NextConfig} */
const nextConfig = {
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/app.js",
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "headers": {
                "Access-Control-Allow-Origin": "*"
            }
        }
    ]
};

export default nextConfig;
