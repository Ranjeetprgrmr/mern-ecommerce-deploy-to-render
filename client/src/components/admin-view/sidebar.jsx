import { BadgeCheck, ChartNoAxesCombined, LayoutDashboard, ShoppingBasket } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
      id : 'dashboard',
      label : 'Dashboard',
      path : '/admin/dashboard',
      icons : <LayoutDashboard />
  },
  {
      id : 'products',
      label : 'Products',
      path : '/admin/products',
      icons : <ShoppingBasket />
  },
  {
      id : 'orders',
      label : 'Orders',
      path : '/admin/orders',
      icons : <BadgeCheck />
  },
]

function MenuItems ({ setOpen }) {
  const navigate = useNavigate();
  
  return (
  <nav>
    {adminSidebarMenuItems.map((menuItem)=> ( 
       <div 
         key={menuItem.id} 
         onClick={() => { 
          navigate(menuItem.path);
          setOpen ? setOpen(false) : true;
      }}
      className="text-md flex items-center gap-2 rounded-m px-3 mt-8 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
      >
          {menuItem.icons}
          <span>{menuItem.label}</span>
      </div>)
      )
    }
  </nav>)
}

function AdminSideBar({open, setOpen}) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='left' className='w-64'>
          <div className="flex flex-col h-full">
            <SheetHeader className='border-b'>
              <SheetTitle className='flex gap-2'>
                <ChartNoAxesCombined  size={30}/>
                <h1 className="text-xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems  setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden flex-col border-r bg-background p-3 lg:flex pl-0">
        <div 
          onClick={() => navigate('/admin/dashboard')}
          className="flex item-center gap-2 cursor-pointer">
          <ChartNoAxesCombined size={30} />
          <h1 className="text-xl font-extrabold mb-2 ">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  )
}

export default AdminSideBar;