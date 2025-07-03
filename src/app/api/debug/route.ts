import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      STANDALONE: process.env.STANDALONE,
      AUTH_SECRET: process.env.AUTH_SECRET ? '***SET***' : 'NOT_SET',
      AUTH_URL: process.env.AUTH_URL,
      HOSTNAME: process.env.HOSTNAME,
      PORT: process.env.PORT,
    },
    nextAuthCheck: {
      authSecretLength: process.env.AUTH_SECRET?.length || 0,
      authUrlSet: !!process.env.AUTH_URL,
    },
    timestamp: new Date().toISOString(),
  })
}