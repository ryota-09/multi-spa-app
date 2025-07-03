import { NextResponse } from 'next/server'

// NextAuth v5で提供されるprovidersエンドポイントを手動実装
export async function GET() {
  const providers = {
    credentials: {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      signinUrl: '/api/auth/signin',
      callbackUrl: '/api/auth/callback/credentials'
    }
  }

  return NextResponse.json(providers)
}