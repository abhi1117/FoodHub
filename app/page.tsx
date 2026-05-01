import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="text-center space-y-6 px-4">
        {/* Hero Icon */}
        <div className="text-8xl">🍽️</div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-secondary">
          FoodHub
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 max-w-md">
          Delicious food delivered to your door. Order now and enjoy the best meals in town!
        </p>
        
        {/* CTA Button */}
        <Link
          href="/menu"
          className="inline-block mt-8 btn-primary text-lg px-8 py-4"
        >
          Browse Menu
        </Link>
      </div>
      
      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl px-4">
        <div className="text-center space-y-2">
          <div className="text-4xl">🍕</div>
          <h3 className="font-semibold text-secondary">Fresh Food</h3>
          <p className="text-gray-500">Made with the finest ingredients</p>
        </div>
        
        <div className="text-center space-y-2">
          <div className="text-4xl">🚚</div>
          <h3 className="font-semibold text-secondary">Fast Delivery</h3>
          <p className="text-gray-500">Hot meals at your doorstep</p>
        </div>
        
        <div className="text-center space-y-2">
          <div className="text-4xl">⭐</div>
          <h3 className="font-semibold text-secondary">Best Quality</h3>
          <p className="text-gray-500">Rated by thousands of customers</p>
        </div>
      </div>
    </div>
  );
}