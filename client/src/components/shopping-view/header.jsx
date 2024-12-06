import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem){
    sessionStorage.removeItem('filters');
    const currentFilter = 
    getCurrentMenuItem.id !== 'home' && 
    getCurrentMenuItem.id !== 'products' &&
    getCurrentMenuItem.id !== 'search' ?
    {
      category : [getCurrentMenuItem.id]
    } : null

    sessionStorage.setItem('filters', JSON.stringify(currentFilter));

    location.pathname.includes('listing') && currentFilter !== null 
    ? setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`))
    : navigate(getCurrentMenuItem.path)
  }

  return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
    {shoppingViewHeaderMenuItems.map((menuItem) => (
      <Label
        onClick={() => handleNavigate(menuItem)}
        className="text-sm font-medium cursor-pointer"
        key={menuItem.id} 
        >
          {menuItem.label}
      </Label>))
    }
  </nav>
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const {cartItems} = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  console.log(user, 'this is user');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id))
  },[dispatch])

  console.log('this is cartItems', cartItems)

  return <div className="flex lg:items-center lg:flex-row flex-col gap-4">
    <Sheet open={openCartSheet} onOpenChange={()=>setOpenCartSheet(false)}>
      <Button onClick={() => setOpenCartSheet(true)} variant='outline' size='icon'>
      <ShoppingCart className="h-6 w-6" />
      <span className="absolute top-0 right-16 leading-none px-2 py-1 text-xs font-bold text-white bg-red-400 rounded-full">{cartItems?.items?.length || 0}</span>
      <span className="sr-only">My Cart</span>
      </Button>
      <UserCartWrapper 
        setOpenCartSheet={setOpenCartSheet}
        cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []}/>
    </Sheet>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='bg-black'>
          <AvatarFallback className="bg-black text-white font-extrabold mx-auto mt-1">
            {user?.userName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel side='right' className='w-56'>Logged in as {user?.userName}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/shop/account')}>
          <UserCog className="mr-2 h-4 w-4" />
          Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to='/shop/home' className="flex items-center gap-2">
          <HousePlug className="h-6 w-6"/>
          <span className="font-bold">Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild
          >
            <Button variant='outline' size='icon' className='lg:hidden'>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-full max-w-xs'>
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
            <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div> 
      </div>
    </header>
  )
}

export default ShoppingHeader;