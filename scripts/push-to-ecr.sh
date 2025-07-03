#!/bin/bash

# AWS ECRにDockerイメージをプッシュするスクリプト
# 使用方法: ./scripts/push-to-ecr.sh [AWS_REGION] [ECR_REPOSITORY_NAME] [IMAGE_TAG]

set -e

# デフォルト値の設定
AWS_REGION=${1:-"ap-northeast-1"}
ECR_REPOSITORY_NAME=${2:-"multi-spa-app"}
IMAGE_TAG=${3:-"latest"}

echo "=== AWS ECRへのプッシュを開始します ==="
echo "AWS Region: ${AWS_REGION}"
echo "ECR Repository: ${ECR_REPOSITORY_NAME}"
echo "Image Tag: ${IMAGE_TAG}"

# AWS CLIがインストールされているかチェック
if ! command -v aws &> /dev/null; then
    echo "エラー: AWS CLIがインストールされていません"
    echo "AWS CLIをインストールしてください: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# AWS認証情報がセットされているかチェック
if ! aws sts get-caller-identity &> /dev/null; then
    echo "エラー: AWS認証情報が設定されていません"
    echo "aws configure を実行して認証情報を設定してください"
    exit 1
fi

# AWS_ACCOUNT_IDを取得
echo "AWS_ACCOUNT_IDを取得中..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ -z "${AWS_ACCOUNT_ID}" ]; then
    echo "エラー: AWS_ACCOUNT_IDを取得できませんでした"
    echo "AWS認証情報を確認してください"
    exit 1
fi
echo "AWS Account ID: ${AWS_ACCOUNT_ID}"

# ECRレジストリURIを再構築
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
ECR_REPOSITORY="${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}"

echo "ECR Registry: ${ECR_REGISTRY}"
echo "ECR Repository: ${ECR_REPOSITORY}"

# ECRリポジトリが存在するかチェック、存在しない場合は作成
echo "ECRリポジトリの存在確認中..."
if ! aws ecr describe-repositories --region ${AWS_REGION} --repository-names ${ECR_REPOSITORY_NAME} &> /dev/null; then
    echo "ECRリポジトリが存在しません。作成中..."
    aws ecr create-repository \
        --region ${AWS_REGION} \
        --repository-name ${ECR_REPOSITORY_NAME} \
        --image-scanning-configuration scanOnPush=true \
        --encryption-configuration encryptionType=AES256
    echo "ECRリポジトリ '${ECR_REPOSITORY_NAME}' を作成しました"
else
    echo "ECRリポジトリ '${ECR_REPOSITORY_NAME}' は既に存在します"
fi

# ECRにログイン
echo "ECRにログイン中..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Dockerイメージをビルド
echo "Dockerイメージをビルド中..."
docker build --platform linux/amd64 -t ${ECR_REPOSITORY_NAME}:${IMAGE_TAG} .

# ECR用にタグ付け
echo "ECR用にイメージをタグ付け中..."
docker tag ${ECR_REPOSITORY_NAME}:${IMAGE_TAG} ${ECR_REPOSITORY}:${IMAGE_TAG}

# ECRにプッシュ
echo "ECRにイメージをプッシュ中..."
docker push ${ECR_REPOSITORY}:${IMAGE_TAG}

echo "=== プッシュが完了しました! ==="
echo "イメージURI: ${ECR_REPOSITORY}:${IMAGE_TAG}"
echo ""
echo "次のコマンドでイメージを取得できます:"
echo "docker pull ${ECR_REPOSITORY}:${IMAGE_TAG}"
