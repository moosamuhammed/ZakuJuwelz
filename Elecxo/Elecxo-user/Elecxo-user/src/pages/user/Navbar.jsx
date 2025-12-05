import { ShoppingCart, User } from 'lucide-react'
import React from 'react'
import Searchtab from '../../components/Searchtab'

function Navbar() {
  
  return (
    <nav className='flex justify-between gap-10 items-center align-middle px-4 py-2 relative'>
      <div>
        <h1 className='text-blue-600 font-bold text-4xl'>Elec<span className='text-black'>xo</span></h1>
      </div>
      <div className='w-full relative'>
        <input className='border border-gray-600 w-full py-2 px-1' type="text" placeholder='search product' />
        <div className='absolute top-25 hidden' >
        <Searchtab />
        </div>
        </div>
        <div className='flex gap-4'>
          <div className='bg-gray-300 p-1 w-fit rounded'>
          <User />
          </div>
          <div className='bg-gray-300 p-1 w-fit rounded'>
          <ShoppingCart />
          </div>
        </div>
    </nav>
  )
}

export default Navbar


