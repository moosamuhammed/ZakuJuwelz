import { Route, Routes } from 'react-router-dom';
import Layout from './Layout/user/Layout';
import Frontpage from './pages/user/Frontpage';
import Login from './pages/user/login';
import AddToCart from './pages/Addtocart';
import Signup from './pages/user/Signup';
import CategoryPage from './Categorypage';
import Checkout from './pages/Checkout';
import ProductDetail from './Layout/user/Detailedproductcard';
import ProductsPage from './Products';
import MyOrders from './pages/user/Myorders';


function App() {
  return (
    <div>
    <Routes>
      <Route  element={<Layout />}>
        <Route path="/" element={<Frontpage />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
       <Route path='/login'  element={<Login />}></Route>
       <Route path='/addtocart'  element={<AddToCart />}></Route>
        <Route path="/products" element={<ProductsPage />} />
       <Route path="/checkout" element={<Checkout />} />
<Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/my-orders" element={<MyOrders />} />
       
             </Route>
    </Routes>
    </div>
  );
}

export default App;
