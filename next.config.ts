import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 環境変数で静的エクスポートとスタンドアロンモードを切り替え
  // 開発環境では通常モード、ビルド時のみ静的エクスポートまたはスタンドアロン
  output: process.env.NODE_ENV === 'production' 
    ? (process.env.STANDALONE === "true" ? "standalone" : "export")
    : undefined,
  // 静的エクスポート時にindex.htmlファイルを生成するため
  trailingSlash: true,
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
};

export default nextConfig;
