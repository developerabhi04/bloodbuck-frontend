import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../server";


export const clearOrderedProducts = createAsyncThunk("cart/clearOrderedProducts", async ({ userId, orderedItems }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${server}/cart/clear-ordered/${userId}`, { orderedItems },
            {
                headers: {Authorization: `Bearer ${token}`},
            }
        );
        if (response.data.success) {
            return response.data.cart.items;
        } else {
            return rejectWithValue(response.data.message || "Failed to clear ordered products");
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to clear ordered products");
    }
}
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity, colorName }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${server}/cart/add`,
                { userId, productId, quantity, colorName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                return response.data.cart.items;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
        }
    }
);

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (userId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/cart/get/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            return rejectWithValue(response.data.message || "Failed to fetch cart items");
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch cart items");
    }
}
);

export const deleteCartItem = createAsyncThunk("cart/deleteCartItem", async ({ userId, productId, colorName }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        let url = `${server}/cart/delete/${userId}/${productId}`;

        const params = new URLSearchParams();

        if (colorName) params.append("colorName", colorName);
        const queryString = params.toString();

        if (queryString) url += `?${queryString}`;
        const response = await axios.delete(url, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (response.status === 200) {
            return { productId, colorName };
        } else {
            return rejectWithValue(`Failed to delete item. Status: ${response.status}`);
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete cart item");
    }
}
);

export const updateCartQuantity = createAsyncThunk("cart/updateCartQuantity",
    async ({ userId, productId, quantity, colorName }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`${server}/cart/update`, { userId, productId, quantity, colorName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) return response.data.cart.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update cart quantity");
        }
    }
);

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState: {
        cartItems: [],
        isLoading: false,
        error: null,
        clearCartSuccess: false,
    },
    reducers: {
        resetCartState: (state) => {
            state.cartItems = [];
            state.clearCartSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearOrderedProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(clearOrderedProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(clearOrderedProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                const qtyMap = {};
                action.payload.forEach((it) => {
                    const key = `${it.productId}_${it.colorName}`;
                    qtyMap[key] = it.quantity;
                });
                // merge quantities into existing items
                state.cartItems = state.cartItems.map((item) => {
                    const key = `${item.productId}_${item.selectedColorName}`;
                    if (qtyMap[key] != null) {
                        return { ...item, quantity: qtyMap[key] };
                    }
                    return item;
                });
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                const { productId, colorName } = action.payload;
                state.cartItems = state.cartItems.filter((item) => {
                    return !(
                        item.productId === productId &&
                        item.selectedColorName === colorName
                    );
                });
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetCartState } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
