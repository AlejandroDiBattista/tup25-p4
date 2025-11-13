import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <h1 className="text-3xl font-bold text-center my-4">Welcome to Our E-Commerce Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="text-lg font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;