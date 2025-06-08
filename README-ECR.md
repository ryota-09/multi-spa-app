# AWS ECR デプロイメントガイド

このプロジェクトをAWS ECR（Elastic Container Registry）にデプロイするための手順とコードが追加されています。

## 前提条件

1. **AWS CLI** がインストールされていること
   ```bash
   # AWS CLI インストール（macOS）
   brew install awscli
   
   # AWS CLI インストール（その他のOS）
   # https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
   ```

2. **Docker** がインストールされていること
   ```bash
   # Docker Desktop をインストール
   # https://www.docker.com/products/docker-desktop/
   ```

3. **AWS認証情報** が設定されていること
   ```bash
   aws configure
   # AWS Access Key ID、Secret Access Key、Region、Output formatを設定
   ```

## ローカルからのECRデプロイ

### 1. 手動スクリプトを使用

```bash
# デフォルト設定でプッシュ（ap-northeast-1リージョン、multi-spa-appリポジトリ、latestタグ）
npm run ecr:push

# カスタム設定でプッシュ
./scripts/push-to-ecr.sh [AWS_REGION] [ECR_REPOSITORY_NAME] [IMAGE_TAG]

# 例：開発環境用にdevタグでプッシュ
npm run ecr:push:dev
```

### 2. 直接Dockerコマンドを使用

```bash
# Dockerイメージをビルド
npm run docker:build

# ローカルでテスト実行
npm run docker:run

# ECRにプッシュ（事前にAWS認証が必要）
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-1.amazonaws.com
docker tag multi-spa-app:latest [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-1.amazonaws.com/multi-spa-app:latest
docker push [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-1.amazonaws.com/multi-spa-app:latest
```

## GitHub Actions CI/CDパイプライン

### セットアップ

1. **GitHub Secrets** に以下の環境変数を設定：
   - `AWS_ACCESS_KEY_ID`: AWSアクセスキーID
   - `AWS_SECRET_ACCESS_KEY`: AWSシークレットアクセスキー

2. **トリガー条件**：
   - `main`ブランチへのプッシュ：自動デプロイ
   - `develop`ブランチへのプッシュ：テストのみ
   - `main`ブランチへのPR：テストのみ
   - 手動実行：Actions画面から任意のタグで実行可能

### ワークフローの流れ

1. **テストジョブ**：
   - Node.js環境セットアップ
   - 依存関係インストール
   - リンター実行
   - アプリケーションビルド

2. **デプロイジョブ**（mainブランチまたは手動実行時のみ）：
   - AWS認証情報設定
   - ECRログイン
   - ECRリポジトリ存在確認・作成
   - Dockerイメージビルド・タグ付け
   - ECRにプッシュ

## ECRリポジトリ設定

- **デフォルトリージョン**: `ap-northeast-1` (東京)
- **デフォルトリポジトリ名**: `multi-spa-app`
- **セキュリティ設定**:
  - イメージスキャン有効化
  - AES256暗号化

## トラブルシューティング

### よくあるエラー

1. **AWS認証エラー**
   ```bash
   # 認証情報を確認
   aws sts get-caller-identity
   
   # 再設定
   aws configure
   ```

2. **Docker権限エラー**
   ```bash
   # Dockerが実行中か確認
   docker ps
   
   # Docker Desktopを再起動
   ```

3. **ECRログインエラー**
   ```bash
   # ECRログインを手動実行
   aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-1.amazonaws.com
   ```

### IAMポリシー

ECRへのプッシュには以下のIAM権限が必要です：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchImportLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:DescribeRepositories",
                "ecr:InitiateLayerUpload",
                "ecr:PutImage",
                "ecr:UploadLayerPart",
                "ecr:CreateRepository"
            ],
            "Resource": "*"
        }
    ]
}
```

## 利用方法

### ECS/Fargateでの利用

```bash
# ECRからイメージを取得
docker pull [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-1.amazonaws.com/multi-spa-app:latest

# ECSタスク定義でイメージURIを指定
# [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-1.amazonaws.com/multi-spa-app:latest
```

### Lambda Container Imageでの利用

```bash
# Lambda用にイメージを取得して関数にデプロイ
aws lambda update-function-code --function-name my-function --image-uri [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-1.amazonaws.com/multi-spa-app:latest
```

## カスタマイズ

### 設定変更

- **リージョン変更**: `.github/workflows/deploy-to-ecr.yml`の`AWS_REGION`環境変数を編集
- **リポジトリ名変更**: `.github/workflows/deploy-to-ecr.yml`の`ECR_REPOSITORY`環境変数を編集
- **ビルド設定変更**: `Dockerfile`を編集

### 環境別デプロイ

```bash
# 開発環境
./scripts/push-to-ecr.sh ap-northeast-1 multi-spa-app-dev dev

# ステージング環境
./scripts/push-to-ecr.sh ap-northeast-1 multi-spa-app-staging staging

# 本番環境
./scripts/push-to-ecr.sh ap-northeast-1 multi-spa-app-prod latest
