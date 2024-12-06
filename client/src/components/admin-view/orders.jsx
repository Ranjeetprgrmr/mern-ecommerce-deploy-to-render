import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import AdminOrderDetailsView from './order-details';
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '../ui/badge';

function AdminOrdersView() {
  const dispatch = useDispatch();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const {orderList, orderDetails} = useSelector(state=> state.adminOrder)

  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetailsForAdmin(getId))
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  },[dispatch]);

  useEffect(() => {
    if(orderDetails !== null) setOpenDetailsDialog(true)
  },[orderDetails])

  console.log('this is orderDetails of admin', orderDetails)

  return (
    <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {orderList && orderList.length > 0 ?
             orderList.map(orderItem =><TableRow>
              <TableCell>{orderItem._id}</TableCell>
              <TableCell>{orderItem.orderDate.split(' ')[0]}</TableCell>
              <TableCell>
                <Badge 
                  className={`py-2 px-3 ${
                    orderItem?.orderStatus === 'delivered' 
                    ? 'bg-green-500' 
                    :  orderItem?.orderStatus === 'rejected'
                    ? 'bg-red-500' 
                    : 'bg-black'
                    }`}
                  >
                    {orderItem?.orderStatus}
                </Badge>
              </TableCell>
              <TableCell>${orderItem.totalAmount}</TableCell>
              <TableCell>
                <Dialog 
                  open={openDetailsDialog} 
                   onOpenChange={() => {
                    setOpenDetailsDialog(false)
                      dispatch(resetOrderDetails());
                  }}
                   >
                  <Button 
                    onClick={() => handleFetchOrderDetails(orderItem?._id)}
                    >
                    View Details</Button>
                  <AdminOrderDetailsView orderDetails={orderDetails} />
                </Dialog>
              </TableCell>
              </TableRow>
               )
               : null
               }
          </TableBody>
        </Table>
      </CardContent>
    </Card>  
  )
}

export default AdminOrdersView;