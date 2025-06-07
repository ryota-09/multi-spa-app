"use client";

import { useState, useEffect } from 'react';

interface UserInfo {
  name: string;
  cart: number;
  isLoggedIn: boolean;
}

export default function DynamicHeader() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // クライアントサイドでAPIを呼び出して動的コンテンツを取得
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user-info');
        if (response.ok) {
          const data: UserInfo = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">ECサイトサンプル</h1>
        <div className="flex items-center space-x-4">
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
      <h1 className="text-xl font-bold">ECサイトサンプル</h1>
      <div className="flex items-center space-x-4">
        {userInfo?.isLoggedIn ? (
          <>
            <span>こんにちは、{userInfo.name}さん</span>
            <span className="bg-red-500 px-2 py-1 rounded">
              カート: {userInfo.cart}個
            </span>
          </>
        ) : (
          <span>ログインしてください</span>
        )}
      </div>
    </div>
  );
}
