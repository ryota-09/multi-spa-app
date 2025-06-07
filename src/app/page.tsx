import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import DynamicHeader from '@/components/DynamicHeader';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DynamicHeader />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">商品一覧</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ¥{product.price.toLocaleString()}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">CloudFrontキャッシュ構成について</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>静的部分：</strong> この商品一覧ページは静的に生成され、CloudFrontでキャッシュされます。
            </p>
            <p>
              <strong>動的部分：</strong> ヘッダーのユーザー情報は、クライアントサイドでAPI（/api/user-info）から取得され、リアルタイムで更新されます。
            </p>
            <p>
              <strong>構成：</strong> 静的コンテンツ（/*）はS3から配信され、動的API（/api/*）はApp Runnerから配信されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
