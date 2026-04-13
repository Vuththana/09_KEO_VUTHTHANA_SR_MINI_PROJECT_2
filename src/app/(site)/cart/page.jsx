import ShopCartComponent from '@/components/shop/ShopCartComponent'
import useCart from '@/lib/cart';
import React from 'react'

export const metadata = {
  title: "Cart | PurelyStore",
  description: "View cart",
};


export default function Page() {
  return (
    <div className='mx-auto w-full max-w-7xl py-16 lg:py-20 bg-'>
      <p className='text-[24px] font-bold'>Your Cart</p>
      <p className='text-sm text-gray-500 font-light'>Cart is stored in memory for this page - refreshing the page clears it</p>
      <ShopCartComponent />
    </div>
  )
}
