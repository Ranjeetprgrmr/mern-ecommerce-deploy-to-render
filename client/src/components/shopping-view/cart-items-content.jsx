import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItems, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
  const {user} = useSelector((state) => state.auth);
  const {cartItems} = useSelector(state=> state.shopCart);  
  const {productList} = useSelector((state) => state.shopProducts);

  const {toast} = useToast();

  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus"){
      let getCartItems = cartItems.items || [];

      if(getCartItems.length){
        const indexOfCurrentCartItem = getCartItems.findIndex(item=> item.productId === getCartItem?.productId);

        const getCurrentProductIndex = productList.findIndex(product=> product._id === getCartItem.productId)
        const getTotalStock = productList[getCurrentProductIndex].totalStock;
        if(indexOfCurrentCartItem > -1){
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if(getQuantity + 1 > getTotalStock){
            toast({
              title : `Only ${getQuantity} quantity can be added in the stock`,
              variant : 'destructive'
            })
            
            return;
          }
        }
      
      }
    }

    dispatch(updateCartQuantity({
      userId : user?.id,
      productId : getCartItem?.productId,
      quantity : typeOfAction === 'plus' ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1
    }))
    .then((data) => {
      if(data?.payload.success) {
        toast({
          title : 'Cart updated successfully',
        })
      }
    })
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(deleteCartItems({userId: user?.id, productId: getCartItem?.productId})).then((data) => {
      if(data?.payload.success) {
        toast({
          title : 'Cart deleted successfully',
        })
      }
    })
  }

  return (
    <div className="flex items-center space-x-4">
      <img 
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            disabled={cartItem?.quantity === 1}
            onClick={()=>handleUpdateQuantity(cartItem, 'minus')}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={()=>handleUpdateQuantity(cartItem, 'plus')}
           >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
        </p>
        <Trash 
          onClick={() => handleCartItemDelete(cartItem)}
          className="h-4 w-4 cursor-pointer" />
      </div>

    </div>
  )
}

export default UserCartItemsContent;