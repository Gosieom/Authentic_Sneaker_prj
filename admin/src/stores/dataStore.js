import { create } from 'zustand';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';

export const useDataStore = create((set, get) => ({
  // Initial state
  products: [],
  productsLoading: false,
  orders: [],
  ordersLoading: false,
  categories: [],
  
  // Product actions
  fetchProducts: async () => {
    set({ productsLoading: true });
    try {
      const products = await productService.getAllProducts();
      // Ensure products is always an array
      const safeProducts = Array.isArray(products) ? products : [];
      const categories = [...new Set(safeProducts.map(p => p.category))];
      set({ products: safeProducts, categories, productsLoading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ products: [], productsLoading: false });
      throw error;
    }
  },
  
  addProduct: async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      const { products } = get();
      const updatedProducts = [...products, newProduct];
      const categories = [...new Set(updatedProducts.map(p => p.category))];
      set({ products: updatedProducts, categories });
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  },
  
  updateProduct: async (id, updates) => {
    try {
      const updatedProduct = await productService.updateProduct(id, updates);
      const { products } = get();
      const updatedProducts = products.map(p => p.id === id ? updatedProduct : p);
      const categories = [...new Set(updatedProducts.map(p => p.category))];
      set({ products: updatedProducts, categories });
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      await productService.deleteProduct(id);
      const { products } = get();
      const updatedProducts = products.filter(p => p.id !== id);
      const categories = [...new Set(updatedProducts.map(p => p.category))];
      set({ products: updatedProducts, categories });
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },
  
  // Order actions
  fetchOrders: async () => {
    set({ ordersLoading: true });
    try {
      const orders = await orderService.getAllOrders();
      // Ensure orders is always an array
      const safeOrders = Array.isArray(orders) ? orders : [];
      set({ orders: safeOrders, ordersLoading: false });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ orders: [], ordersLoading: false });
      throw error;
    }
  },
  
  updateOrderStatus: async (id, status) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, { delivery_status: status });
      const { orders } = get();
      const updatedOrders = orders.map(o => o.id === id ? updatedOrder : o);
      set({ orders: updatedOrders });
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }
}));