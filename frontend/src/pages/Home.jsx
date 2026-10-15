import React from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturedSection from '../components/Products/FeaturedSection'


const placeholderProducts = [
    {
        _id:"1",
        name:"Product 1",
        price:100,
        images: [{ url:"https://picsum.photos/200/200?random=11" }]  
    },
    {
        _id:"2",
        name:"Product 2",
        price:110,
        images: [{ url:"https://picsum.photos/200/200?random=12" }]
    },
    {
        _id:"3",
        name:"Product 3",
        price:120,
        images: [{ url:"https://picsum.photos/200/200?random=13" }]
        
    },
    {
        _id:"4",
        name:"Product 4",
        price:130,
        images: [{ url:"https://picsum.photos/200/200?random=14" }]
    },
    {
        _id:"5",
        name:"Product 1",
        price:100,
        images: [{ url:"https://picsum.photos/200/200?random=15" }]  
    },
    {
        _id:"6",
        name:"Product 2",
        price:110,
        images: [{ url:"https://picsum.photos/200/200?random=16" }]
    },
    {
        _id:"7",
        name:"Product 3",
        price:120,
        images: [{ url:"https://picsum.photos/200/200?random=17" }]
        
    },
    {
        _id:"8",
        name:"Product 4",
        price:130,
        images: [{ url:"https://picsum.photos/200/200?random=18" }]
    }
]

const Home = () => {
  return (
    <div>
        <Hero />
        <GenderCollectionSection />
        <NewArrivals />

        {/* Best Seller */}
        <h2 className='mb-4 text-3xl font-bold text-center'>
            Best Seller
        </h2>
        <ProductDetails />
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold text-center'>
            Top Wears for Women
          </h2>
          <ProductGrid products={placeholderProducts}/>
        </div>

        <FeaturedCollection />
        <FeaturedSection />
    </div>
  )
}

export default Home