import React from 'react'
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'

const FeaturedSection = () => {
  return (
    <section className='px-4 py-16 bg-white lg:px-0'>
        <div className='container grid grid-cols-1 gap-8 mx-auto text-center md:grid-cols-3'>
            {/*Feature 1 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 mb-4 rounded-full'>
                    <HiShoppingBag className='text-lg' />
                </div>
                <h4 className='mb-2 tracking-tighter '>
                    FREE INTERNATIONAL SHIPPING
                </h4>
                <p className='text-sm tracking-tighter text-gray-600 '>On all orders over $100.00</p>
            </div>

            {/*Feature 2 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 mb-4 rounded-full'>
                    <HiArrowPathRoundedSquare className='text-lg' />
                </div>
                <h4 className='mb-2 tracking-tighter '>
                    45 DAYS RETURN
                </h4>
                <p className='text-sm tracking-tighter text-gray-600 '>Money back guarandted</p>
            </div>
            
            {/*Feature 3 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 mb-4 rounded-full'>
                    <HiOutlineCreditCard className='text-lg' />
                </div>
                <h4 className='mb-2 tracking-tighter '>
                    SECURE CHECKOUT
                </h4>
                <p className='text-sm tracking-tighter text-gray-600 '>100% secured checkout process</p>
            </div>
        </div>
    </section>
  )
}

export default FeaturedSection