import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 環境変数で静的エクスポートとスタンドアロンモードを切り替え
  // 開発環境では通常モード、ビルド時のみ静的エクスポートまたはスタンドアロン
  output: process.env.NODE_ENV === 'production' 
    ? (process.env.STANDALONE === "true" ? "standalone" : "export")
    : undefined,
  // スタンドアロンモード時はtrailing slashを完全に無効化
  trailingSlash: process.env.STANDALONE === "true" ? false : (process.env.NODE_ENV === 'production'),
  // App Runner環境では常にtrailing slashリダイレクトを無効化
  skipTrailingSlashRedirect: process.env.STANDALONE === "true",
  // 画像最適化設定
  images: {
    unoptimized: process.env.NODE_ENV === 'production' && process.env.STANDALONE !== "true",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // APIルートの設定
  async rewrites() {
    // スタンドアロンモード(App Runner)でのAPIルート処理
    if (process.env.STANDALONE === "true") {
      return [];
    }
    return [];
  },
};

export default nextConfig;
