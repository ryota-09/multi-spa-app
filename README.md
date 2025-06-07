# Next.js CloudFront キャッシュ対応アプリケーション

このプロジェクトは、Next.jsで静的部分をCloudFrontでキャッシュし、動的部分をAPI Routesで配信する構成のサンプルアプリケーションです。

## 構成概要

### アーキテクチャ
- **静的部分**: Next.js Static Exports → S3 → CloudFront
- **動的部分**: Next.js API Routes → App Runner → CloudFront

### キャッシュ戦略
- 静的コンテンツ（`/*`）: CloudFrontでキャッシュ
- 動的API（`/api/*`）: キャッシュ無効化ヘッダーでリアルタイム配信

## ディレクトリ構造

```
src/
├── app/
│   ├── page.tsx                    # 商品一覧（静的）
│   ├── products/[slug]/page.tsx    # 商品詳細（静的）
│   └── api/
│       └── user-info/route.ts      # ユーザー情報API（動的）
├── components/
│   └── DynamicHeader.tsx           # 動的ヘッダーコンポーネント
└── data/
    └── products.ts                 # 商品データ
```

## 開発・ビルド

### 開発サーバー起動
```bash
npm run dev
```

### 静的サイト用ビルド
```bash
npm run build:static
```
- `out/` ディレクトリに静的ファイルが生成されます
- S3にアップロードして配信します

### スタンドアロン用ビルド（App Runner）
```bash
npm run build:standalone
```
- `.next/standalone/` ディレクトリにサーバー用ファイルが生成されます
- DockerでコンテナビルドしてApp Runnerにデプロイします

## 実装のポイント

### 1. next.config.ts
```typescript
const nextConfig: NextConfig = {
  // 環境変数で静的エクスポートとスタンドアロンモードを切り替え
  output: process.env.STANDALONE === "true" ? "standalone" : "export",
  trailingSlash: true, // S3のindex.htmlサポート用
  images: {
    unoptimized: process.env.STANDALONE !== "true",
    // Unsplash画像のサポート
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
```

### 2. 動的コンテンツの実装
```typescript
// API Route（動的）
export async function GET() {
  return NextResponse.json(userInfo, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  });
}

// クライアントサイドでfetch
useEffect(() => {
  fetch('/api/user-info').then(/* ... */);
}, []);
```

### 3. 静的パラメータ生成
```typescript
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id.toString(),
  }));
}
```

## CloudFront設定

### ビヘイビア設定
- デフォルト（`/*`）: S3オリジン、キャッシュ有効
- API（`/api/*`）: App Runnerオリジン、キャッシュ無効

### 例：CDKでの設定
```typescript
const distribution = new cloudfront.Distribution(this, "webDistribution", {
  defaultBehavior: {
    origin: new cloudfront_origins.S3Origin(bucket),
    // 静的コンテンツのキャッシュ設定
  },
  additionalBehaviors: {
    "/api/*": {
      origin: new cloudfront_origins.HttpOrigin(apiUrl),
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    },
  },
});
```

## Dockerイメージビルド

```bash
# プラットフォーム指定（M1/M2 Mac の場合）
docker build --platform linux/amd64 -t nextjs-app .

# 通常のビルド
docker build -t nextjs-app .
```

## 環境変数

### App Runner用
- `STANDALONE=true`: スタンドアロンモードでビルド
- `HOSTNAME=0.0.0.0`: App Runner対応

## 参考資料

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [AWS App Runner](https://aws.amazon.com/jp/apprunner/)
- [Amazon CloudFront](https://aws.amazon.com/jp/cloudfront/)

## ライセンス

MIT License
