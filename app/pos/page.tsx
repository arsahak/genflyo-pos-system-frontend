"use client";

import Sidebar from "@/component/layout/Sidebar";
import Topbar from "@/component/layout/Topbar";
import api from "@/lib/api";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function POSPage() {
  const {
    user,
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
  } = useStore();
  const [products, setProducts] = useState<
    Array<{
      _id: string;
      name: string;
      sku?: string;
      variants: Array<{ price: number }>;
    }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    loadProducts();
  }, [user, router]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        discount: item.discount || 0,
      }));

      await api.post("/sales", {
        storeId: "655d9b4b8f8b8f8b8f8b8f8b", // Default store ID
        items,
        payments: [{ method: "cash", amount: getCartTotal() }],
      });

      toast.success("Sale completed successfully!");
      clearCart();
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || "Failed to complete sale");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Point of Sale
          </h1>

          <div className="flex gap-6">
            {/* Left: Products */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold mb-4">Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => {
                    const variant = product.variants[0];
                    const price = variant?.price || 0;

                    return (
                      <button
                        key={product._id}
                        onClick={() =>
                          addToCart({
                            productId: product._id,
                            productName: product.name,
                            quantity: 1,
                            unitPrice: price,
                            discount: 0,
                          })
                        }
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                      >
                        <h3 className="font-semibold text-sm mb-1">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-indigo-600">
                          ${price.toFixed(2)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Cart */}
            <div className="w-96 bg-white rounded-lg shadow-md p-4 h-fit sticky top-4">
              <h2 className="text-xl font-bold mb-4">Cart</h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="border-b pb-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-sm">
                            {item.productName}
                          </span>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartItem(
                                  index,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-6 h-6 bg-gray-200 rounded"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateCartItem(index, item.quantity + 1)
                              }
                              className="w-6 h-6 bg-gray-200 rounded"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-lg font-bold mb-4">
                      <span>Total:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCompleteSale}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
                    >
                      Complete Sale
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
