import { Route, Routes } from 'react-router-dom'
import { Skeleton } from "@/components/ui/skeleton"

import './App.css'
import AuthLayout from './components/auth/layout'
import AuthLogin  from '../src/pages/auth/login';
import AuthRegister  from '../src/pages/auth/register';
import AdminLayout from './components/admin-view/layout';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminFeatures from './pages/admin-view/features';
import AdminProducts from './pages/admin-view/product';
import AdminOrders from './pages/admin-view/orders';
import NotFound from './pages/not-found/index.jsx';
import ShoppingLayout from './components/shopping-view/layout';
import ShoppingHome from './pages/shopping-view/home';
import ShoppingCheckout from './pages/shopping-view/checkout';
import ShoppingAccount from './pages/shopping-view/account';
import ShoppingList from './pages/shopping-view/listing';

import CheckAuth from './components/common/check-auth';
import UnauthPage from './pages/unauth-page';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './store/auth-slice';
import PaypalReturnPage from './pages/shopping-view/paypal-return';
import PaymentSuccessPage from './pages/shopping-view/payment-success';
import SearchProducts from './pages/shopping-view/search';

function App() {

  const {user,isAuthenticated,isLoading} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(()=>{
    const token = JSON.parse(sessionStorage.getItem('token'))
    dispatch(checkAuth(token));
  },[dispatch]);

  console.log('this is isLoading',isLoading)
  if(isLoading) return <Skeleton className="w-full h-[5px] rounded-full bg-black" />

  
  console.log(isLoading, user)

  return (
    
      <div className='flex flex-col overflow-hidden bg-white'>

        <Routes>
          <Route path="/"
             element={
              <CheckAuth 
                isAuthenticated={isAuthenticated} 
                  user={user}>
               </CheckAuth>
          }>
          </Route>
          <Route path='/auth' element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout/>
            </CheckAuth>
          }>
            <Route path='login' element={<AuthLogin />}/>
            <Route path='register' element={<AuthRegister />}/>
          </Route>

          <Route path="/admin" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
            }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          <Route path='/shop' element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }>
            <Route path='home' element={<ShoppingHome />}/>
            <Route path='listing' element={<ShoppingList />}/>
            <Route path='checkout' element={<ShoppingCheckout />}/>
            <Route path='account' element={<ShoppingAccount />}/>
            <Route path='paypal-return' element={<PaypalReturnPage />}/>
            <Route path='payment-success' element={<PaymentSuccessPage />}/>
            <Route path='search' element={<SearchProducts />}/>
          </Route>

          <Route path='*' element={<NotFound />} />
          <Route path='/unauth-page' element={<UnauthPage />} />
        </Routes>

      </div>
    
  )
}

export default App;
