import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Hello from App Runner!",
    timestamp: new Date().toISOString(),
    service: "multi-spa-app-api",
    version: "v3.1",
    fixes: [
      "Fixed NextAuth configuration for App Runner with trustHost: true",
      "Added NextResponse.rewrite for API trailing slash handling",
      "Created alternative providers-test endpoint",
      "Fixed trailingSlash: false in next.config.ts",
      "Added AUTH_SECRET and AUTH_URL environment variables to Dockerfile",
    ],
    config: {
      trailingSlash: false,
      skipTrailingSlashRedirect: true,
      standalone: true,
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      STANDALONE: process.env.STANDALONE,
      AUTH_SECRET: process.env.AUTH_SECRET ? "***SET***" : "NOT_SET",
      AUTH_URL: process.env.AUTH_URL,
      HOSTNAME: process.env.HOSTNAME,
      PORT: process.env.PORT,
    },
  });
}

export async function POST() {
  return NextResponse.json({
    status: "ok",
    message: "POST endpoint is working",
    timestamp: new Date().toISOString(),
  });
}
