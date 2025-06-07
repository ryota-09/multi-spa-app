const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const apiDir = path.join(__dirname, '../src/app/api');
const tempApiDir = path.join(os.tmpdir(), 'nextjs-api-backup-' + Date.now());

console.log('🚀 静的エクスポート用ビルドを開始します...');

try {
  // APIディレクトリを一時的にバックアップ
  if (fs.existsSync(apiDir)) {
    console.log('📁 API Routesを一時的にバックアップします...');
    if (fs.existsSync(tempApiDir)) {
      fs.rmSync(tempApiDir, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, tempApiDir);
  }

  // 静的エクスポートビルドを実行
  console.log('🔨 静的エクスポートビルドを実行します...');
  execSync('next build', { stdio: 'inherit' });

  console.log('✅ 静的エクスポートビルドが完了しました！');
  console.log('📦 出力ディレクトリ: ./out');

} catch (error) {
  console.error('❌ ビルドエラーが発生しました:', error.message);
  process.exit(1);
} finally {
  // APIディレクトリを復元
  if (fs.existsSync(tempApiDir)) {
    console.log('🔄 API Routesを復元します...');
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    fs.renameSync(tempApiDir, apiDir);
  }
}

console.log('🎉 静的エクスポート用ビルドが正常に完了しました！');
