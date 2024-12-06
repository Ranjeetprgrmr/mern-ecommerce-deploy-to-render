import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const {user} = useSelector(state=> state.auth);
  const {orderList, orderDetails} = useSelector(state=> state.shopOrder);

  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetails(getId))
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id))
  },[dispatch])

  useEffect(() => {
    if(orderDetails !== null) setOpenDetailsDialog(true)
  },[orderDetails])
  
  console.log('this is orderDetails', orderDetails)
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
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
                    : orderItem?.orderStatus === 'rejected'
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
                   onOpenChange={setOpenDetailsDialog}>
                  <Button 
                    onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                    View Details</Button>
                  <ShoppingOrderDetailsView orderDetails={orderDetails} />
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

export default ShoppingOrders;

