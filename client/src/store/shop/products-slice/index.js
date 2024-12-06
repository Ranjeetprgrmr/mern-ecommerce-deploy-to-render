import axios from "axios";
import  { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 

const initialState = {
    isLoading : false,
    productList : [],
    productDetails : null
}

export const fetchAllFilteredProducts = createAsyncThunk(
    '/products/fetchAllProducts', 
     async({filterParams, sortParams}) => {
        const query = new URLSearchParams({
            ...filterParams,
            sortBy : sortParams
        })

      const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`);
      console.log('this is result',result);
    return result?.data;
})
export const fetchProductDetails = createAsyncThunk(
    '/products/fetchProductDetails', 
     async(id) => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`);
      
    return result?.data;
})

const shoppingProductSlice = createSlice({
    name : 'shoppingProducts',
    initialState,
    reducers : {
        setProductDetails : (state,action) => {
            state.productDetails = null
        }
    },
    extraReducers : (builder) => {
        builder.addCase(fetchAllFilteredProducts.pending, (state,action) => {
            state.isLoading = true;
        }).addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            console.log('this product action shop ', action.payload)
            state.isLoading = false;
            state.productList = action.payload.data;
        }).addCase(fetchAllFilteredProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.productList = [];
        })
        .addCase(fetchProductDetails.pending, (state,action) => {
            state.isLoading = true;
        }).addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productDetails = action.payload.data;
        }).addCase(fetchProductDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.productDetails = [];
        })
    }
})

export const {setProductDetails} = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;