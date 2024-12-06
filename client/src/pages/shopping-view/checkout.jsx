import Address from "@/components/shopping-view/address";
import img from '../../assets/account.jpg'
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "@/components/hooks/use-toast";




function ShoppingCheckout() {
  const {cartItems} = useSelector((state) => state.shopCart);
  const {user} = useSelector((state) => state.auth);
  const {approvalURL} = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();

  const totalCartAmount = 
     cartItems && cartItems.items && cartItems.items.length > 0 
     ? cartItems.items.reduce(
        (sum, currentItem) => 
        sum + 
        (currentItem?.salePrice > 0
           ? currentItem?.salePrice 
           : currentItem?.price) * 
           currentItem?.quantity, 0) : 0;

  function handleInitiatePaypalPayment() {

      if(cartItems.length === 0) {
        toast({
          title: 'Your cart is empty. Please add items to proceed.',
          variant: 'destructive'
        })
        return;
      }
      if(currentSelectedAddress === null) {
        toast({
          title: 'Please select an address',
          variant: 'destructive'
        })
        return;
      }
      
  


    const orderData = {
      userId : user?.id, 
      cartId : cartItems?._id,
      cartItems : cartItems.items.map((singleCartItem) => ({
         productId : singleCartItem?.productId,
         title: singleCartItem?.title,
         image: singleCartItem?.image,
         price: singleCartItem?.salePrice > 0
                ? singleCartItem?.salePrice
                : singleCartItem?.price,
         quantity : singleCartItem?.quantity
      })), 
      addressInfo : {
        addressId : currentSelectedAddress?._id,
        address   : currentSelectedAddress?.address,
        city      : currentSelectedAddress?.city,
        pincode   : currentSelectedAddress?.pincode,
        phone     : currentSelectedAddress?.phone,
        notes     : currentSelectedAddress?.notes
      },
      orderStatus  : 'pending', 
      paymentMethod: 'paypal',
      paymentStatus: 'pending', 
      totalAmount  : totalCartAmount, 
      orderDate    : new Date(),
      orderUpdateDate : new Date(),
      paymentId : '', 
      payerId   : '',
    };
    
    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, 'this is checkout data');
      if(data?.payload?.success){
        setIsPaymentStart(true)
      } else {
        setIsPaymentStart(false)
      }
    });
  }

  if(approvalURL) {
    window.location.href = approvalURL;
  }

    return (
      <div className="flex flex-col">
        <div className="relative h-[300px] w-full overflow-hidden">
           <img src={img} className="h-full w-full obejct-cover object-center"/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
           <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
           <div className="flex flex-col gap-6">
            {cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items.map(item=> <UserCartItemsContent cartItem={item}/>) : null}

              <div className="flex justify-between">
                <span className="text-bold">Total Amount</span>
                <span className="text-bold">${totalCartAmount}</span>
              </div>

              <div className="mt-4 w-full">
                <Button onClick={handleInitiatePaypalPayment} className="w-full">
                  {isPaymentStart ? 'Processing Paypal Payment...' : 'CheckOut with Paypal'}</Button>
              </div>

         </div>
        </div>
      </div>
    )
  }
  
  export default ShoppingCheckout;