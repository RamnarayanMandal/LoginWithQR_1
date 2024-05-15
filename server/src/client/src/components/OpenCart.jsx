import React, { useState, useEffect } from 'react';
import { SlArrowLeft } from 'react-icons/sl';
import { IoCart } from 'react-icons/io5';
import ClearCart from '../Utills/ClearCart';
import axios from 'axios'; // Don't forget to import axios

const OpenCart = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [cartMessage, setCartMessage] = useState('');

  const pashShopOwnerId = localStorage.getItem("id")
  const address = localStorage.getItem("address")
  const panShopOwner = localStorage.getItem("panShopOwner")
  const panShopOwnerState = localStorage.getItem("state")
  // products,
  // totalPrice : total_Price,
  // superStockistEmail,
  // stockistEmail,
  // panShopOwner_id,
  // panShopOwnerName,
  // panShopOwnerstate,
  // panShopOwneraddress


  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = storedCartItems.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      productNames: item.heading || '' // Use heading as productName
    }));

    setCartItems(updatedCartItems);
    // Calculate initial total price
    calculateTotalPrice(updatedCartItems);
  }, []);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleIncrement = (itemNo) => () => {
    const updatedCartItems = cartItems.map(item => {
      if (item.itemNo === itemNo) {
        return { ...item, quantity: (item.quantity || 0) + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    // Update local storage
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    // Recalculate total price
    calculateTotalPrice(updatedCartItems);
    // Clear cart message after 3 seconds
    setTimeout(() => {
      setCartMessage('');
    }, 3000);
  };

  const handleDecrement = (itemNo) => () => {
    const updatedCartItems = cartItems.map(item => {
      if (item.itemNo === itemNo && (item.quantity || 0) > 0) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    // Update local storage
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    // Recalculate total price
    calculateTotalPrice(updatedCartItems);
    setCartMessage('Product removed from the cart');
    // Clear cart message after 3 seconds
    setTimeout(() => {
      setCartMessage('');
    }, 3000);
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    setSubTotal(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      products: cartItems.map(({ heading, quantity, price }) => ({
        productNames: heading,
        quantity,
        price,
      })),
      panShopOwnerName : panShopOwner,
      panShopOwneraddress : address ,      
      panShopOwner_id : pashShopOwnerId,
      panShopOwnerstate : panShopOwnerState
    };
  
    try {
      await axios.post(`http://localhost:5000/api/panshop/order`, postData);
      // Clear cart after successful order
      setCartItems([]);
      localStorage.removeItem('cartItems');
      setCartMessage('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      setCartMessage('Failed to place order. Please try again.');
    }
  };
  


  return (
    <div className="flex">
      <button onClick={toggleDrawer} className="btn-bg text-black px-4 py-2 rounded-lg w-full mb-20 transition duration-300 ease-in-out hover:bg-gray-700">
        <IoCart />
      </button>

      {/* Drawer content */}
      <div className={`fixed inset-0 z-50 ${openDrawer ? 'visible' : 'invisible'}`} onClick={toggleDrawer}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
      </div>
      <div className={`fixed right-0 top-0 h-full w-2/5 bg-gray-900 z-50 transform transition-transform ease-in-out duration-300 ${openDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer header */}
        <div className="items-center px-10 py-8">
          <div className='flex text-2xl font-bold text-center gap-2 justify-between bg- items-center text-white'>
            <div className='flex items-center'>
              <SlArrowLeft onClick={toggleDrawer} className='mt-1' />
              <h1>Shopping Cart</h1>
            </div>
            <div>
              <ClearCart />
            </div>
          </div>
          <hr className='border-t border-gray-300 my-8 w-full ' />
          {/* Cart items */}
          <div className="px-20 py-4 items-center justify-center content-center">
            <div className="cart-items-container">
              {cartItems.map((item, index) => (
                <div key={index} className='flex items-center gap-20 py-10'>
                  
                  <img className='w-60 h-60' src={item.img} alt="Product Image" />
                  <div className='flex flex-col gap-4 text-white'>
                    <div className="flex items-center gap-4 text-xl">
                      <h1 className='text-xl font-semibold '>{item.heading} </h1>
                      :
                      <h1 className='text-xl font-semibold'>{item.price}</h1>
                    </div>
                     
                    <div className='flex items-center justify-between text-2xl text-black '>
                      <button className='btn-bg w-14 h-10 rounded-lg' onClick={handleDecrement(item.itemNo)}>-</button>
                      <p className='m-5 text-white'>{item.quantity}</p>
                      <button className='btn-bg w-14 h-10 rounded-lg text-xl items-center ' onClick={handleIncrement(item.itemNo)}>+</button>
                    </div>
                    <p className='text-right text-xl font-semibold'>Price : {item.price * item.quantity} </p>
                    
                  </div>
                  
                </div>
                
              ))}
             
            </div>
          </div>
          {/* Total Price */}
          <div className='sticky bottom-10   w-auto flex items-center justify-between btn-bg py-4 px-2 rounded-xl '>
            <p className='text-2xl font-bold text'>{cartMessage ? cartMessage : `Total Price: ${subTotal}`}</p>
            <button onClick={handleSubmit} className='bg-blue-900 text-white font-bold py-2 px-4 rounded-xl relative'>Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenCart;
