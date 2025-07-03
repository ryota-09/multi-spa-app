import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // App Runnerで強制的にtrailing slashが追加される問題への対処
  // APIルートのtrailing slashを内部的にrewriteで処理
  if (pathname.startsWith('/api/') && pathname.endsWith('/') && pathname !== '/api/') {
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = pathname.slice(0, -1) // trailing slashを除去
    
    // 内部rewriteでtrailing slashなしのパスにリダイレクトせずに処理
    return NextResponse.rewrite(newUrl)
  }

  // APIルートはそのまま通す
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // auth関連のパスもそのまま通す
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }

  // 静的エクスポート時のみtrailing slashを処理（ページルート用）
  const isStaticExport = process.env.NODE_ENV === 'production' && process.env.STANDALONE !== 'true'
  
  if (isStaticExport) {
    // 静的ページでtrailing slashがない場合は追加
    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      return NextResponse.redirect(new URL(pathname + '/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // middlewareを適用するパスのパターン
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}