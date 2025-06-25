
import React from 'react';
import { Header } from './header';
import { ProductShowcase } from './product-showcase';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4">
        <ProductShowcase />
      </main>
    </div>
  );
}
