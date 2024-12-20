import { useDispatch, useSelector } from 'react-redux';
import CommonForm from '../common/form';
import { Badge } from '../ui/badge';
import { DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useState } from 'react';
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from '@/store/admin/order-slice';
import { useToast } from '../hooks/use-toast';

const initialFormData = {
  status : " "
}

function AdminOrderDetailsView({orderDetails}) {
  const [formData , setFormData] = useState(initialFormData);
  const {user} = useSelector(state=>state.shopOrder);
  const dispatch = useDispatch();
  const {toast} = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const {status} = formData;

    dispatch(updateOrderStatus({id: orderDetails?._id, orderStatus: status})).then((data) => {
      if(data?.payload?.success){
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        })
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
        <div className='grid gap-1'>
        <div className='grid mb-1'>
                <div className='flex items-center justify-between mt-2'>
                    <p className='font-md'>Order ID</p>
                    <Label>{orderDetails?._id}</Label>
                </div>
                <div className='flex items-center justify-between mt-1 mb-3'>
                    <p className='font-md'>Order Date</p>
                    <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
                </div>
                <div className='flex items-center justify-between mt-1'>
                    <p className='font-md'>Order Price</p>
                    <Label>${orderDetails?.totalAmount}</Label>
                </div>
                <div className='flex items-center justify-between mt-1'>
                    <p className='font-md'>Payment method</p>
                    <Label>{orderDetails?.paymentMethod}</Label>
                </div>
                <div className='flex items-center justify-between mt-1'>
                    <p className='font-md'>Payment Status</p>
                    <Label>{orderDetails?.paymentStatus}</Label>
                </div>
                <div className='flex items-center justify-between mt-1'>
                   <p className='font-md'>Order Status</p>
                    <Label>
                      <Badge 
                        className={`py-2 px-3 ${
                          orderDetails?.orderStatus === 'delivered' 
                          ? 'bg-green-500' 
                          : orderDetails?.orderStatus === 'rejected'
                          ? 'bg-red-500' 
                          : 'bg-black'
                          }`}
                        >
                         {orderDetails?.orderStatus}
                      </Badge>
                    </Label>
                </div>
        </div>
            <Separator />

            <div className='grid gap-3'>
              <div className='grid gap-1'>
                <div className='font-medium'>Order Details</div>
                <ul className='grid gap-2'>
                    {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ?
                    orderDetails?.cartItems.map(item =>  <li className='flex items-center justify-between'>
                    <span>Title: {item.title}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: ${item.price}</span>
                </li>) : null}
               
                </ul>
            </div>
            </div>
            <div className='grid gap-3'>
                <div className='grid gap-1 py-5'>
                    <div className='font-medium'>Shipping Info</div>
                    <div className='grid gap-0.5 text-muted-foreground'>
                    <span>{user?.userName}</span>
                    <span>{orderDetails?.addressInfo?.address}</span>
                    <span>{orderDetails?.addressInfo?.city}</span>
                    <span>{orderDetails?.addressInfo?.pincode}</span>
                    <span>{orderDetails?.addressInfo?.phone}</span>
                    <span>{orderDetails?.addressInfo?.notes}</span>
                    </div>
                </div>
            </div>

            <div>
              <CommonForm
                formControls={[
                  {
                      label: 'Order Status',
                      name: 'status',
                      componentType: 'select',
                      options: [
                          {id: 'pending',    label:'Pending'},
                          {id: 'inProcess',  label:'In Process'},
                          {id: 'inshipping', label:'In Shipping'},
                          {id: 'delivered',  label:'Delivered'},
                          
                          {id: 'rejected',  label:'Rejected'},
                      ],
                  }
                ]}
                formData={formData}
                setFormData={setFormData}
                buttonText={'Update Order Status'}
                onSubmit={handleUpdateStatus}
                />
            </div>
        </div>
    </DialogContent>
  )
}

export default AdminOrderDetailsView;