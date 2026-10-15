import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({products}) => {
  if (!products || products.length === 0) {
    return (
      <div className='py-10 text-center text-gray-500'>
        No products found.
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {products.map((product) => (
            <Link key={product._id || product.name} to={`/product/${product._id}`} className='block'>
                <div className='p-4 bg-white rounded-lg'>
                    <div className='w-full mb-4 h-96'>
                        <img
                            src={product.images?.[0]?.url || product.images?.[0] || "https://via.placeholder.com/400x600?text=Product"}
                            alt={product.name || "Product"}
                            className='object-cover w-full h-full rounded-lg'
                        />
                    </div>
                <h3 className='mb-2 text-sm '>{product.name}</h3>
                <p className='text-sm font-medium tracking-tighter text-gray-500'>
                    ${product.price}
                </p>
                </div>
                
            </Link>
        ))}
    </div>
  )
}

export default ProductGrid
