import { Outlet } from 'react-router-dom';
import ShoppingHeader from './header';


function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
        {/* common header */}
        <ShoppingHeader />
        <main>
         <Outlet />
        </main>
    </div>
  )
}

export default ShoppingLayout;