import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import DynamicHeader from '@/components/DynamicHeader';

// 静的生成用のパラメータを生成
export async function generateStaticParams() {
  const params = products.map((product) => ({
    slug: product.id.toString(),
  }));

  return params;
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productId = parseInt(slug);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DynamicHeader />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-red-600">商品が見つかりませんでした</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            商品一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DynamicHeader />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← 商品一覧に戻る
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl text-green-600 font-bold mb-4">
                ¥{product.price.toLocaleString()}
              </p>
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200">
                カートに追加
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
