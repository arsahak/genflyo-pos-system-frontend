"use client";
import { useEffect, useRef, useState } from "react";
import { MdAddShoppingCart, MdClose, MdDelete, MdPlaylistAdd, MdSearch, MdStore } from "react-icons/md";
import { Product } from "./types";

interface QueuedItem {
  tempId: string;
  product: Product;
  qty: number;
  cost: number;
  price: number;
}

interface SourcedItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onConfirm: (items: { product: Product; qty: number; cost: number; price: number }[]) => void;
  isDarkMode: boolean;
}

export const SourcedItemModal = ({
  isOpen,
  onClose,
  products,
  onConfirm,
  isDarkMode,
}: SourcedItemModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sourcingCost, setSourcingCost] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  
  const [queue, setQueue] = useState<QueuedItem[]>([]);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedProduct(null);
      setQuantity(1);
      setSourcingCost(0);
      setSalePrice(0);
      setSuggestions([]);
      setQueue([]);
    }
  }, [isOpen]);

  // Handle Search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (searchTerm.trim() && !selectedProduct) {
      searchTimeoutRef.current = setTimeout(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const matches = products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(lowerTerm) ||
              p.sku.toLowerCase().includes(lowerTerm) ||
              p.genericName?.toLowerCase().includes(lowerTerm)
          )
          .slice(0, 5);
        setSuggestions(matches);
      }, 300);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products, selectedProduct]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setSalePrice(product.price);
    setSourcingCost(product.cost || 0);
    setQuantity(1);
    setSuggestions([]);
  };

  const handleAddToQueue = () => {
    if (!selectedProduct || quantity <= 0) return;

    const newItem: QueuedItem = {
      tempId: Math.random().toString(36).substr(2, 9),
      product: selectedProduct,
      qty: quantity,
      cost: sourcingCost,
      price: salePrice,
    };

    setQueue([...queue, newItem]);
    
    // Reset form
    setSelectedProduct(null);
    setSearchTerm("");
    setQuantity(1);
    setSourcingCost(0);
    setSalePrice(0);
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueue(queue.filter(q => q.tempId !== id));
  };

  const handleFinalConfirm = () => {
    let finalItems = [...queue];

    if (selectedProduct && quantity > 0) {
       finalItems.push({
         tempId: "current",
         product: selectedProduct,
         qty: quantity,
         cost: sourcingCost,
         price: salePrice
       });
    }

    if (finalItems.length === 0) return;

    onConfirm(finalItems.map(({ product, qty, cost, price }) => ({ product, qty, cost, price })));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all scale-100 flex flex-col max-h-[90vh] ${
          isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isDarkMode ? "border-gray-800" : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-indigo-900/30 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
               <MdStore className="text-xl" />
            </div>
            <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Sourced Items Manager
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              {queue.length} items queued
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Fixed Search Section */}
        <div className={`px-6 py-4 border-b relative z-30 ${isDarkMode ? "bg-gray-800/30 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
             <div className="relative">
                <MdSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (selectedProduct) setSelectedProduct(null);
                  }}
                  placeholder="Search product to source..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 outline-none font-medium transition-all ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500"
                      : "bg-white border-gray-200 text-gray-900 focus:border-indigo-500"
                  }`}
                  autoFocus
                />
                
                {/* Suggestions Dropdown - Floats OVER the content below */}
                {suggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border-2 shadow-2xl overflow-hidden max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200 ${
                    isDarkMode ? "bg-gray-900 border-gray-700 shadow-black/80" : "bg-white border-gray-100 shadow-xl"
                  }`}>
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className={`w-full text-left px-4 py-3 border-b last:border-0 transition-colors flex justify-between items-start group ${
                            isDarkMode ? "border-gray-800 hover:bg-indigo-900/20" : "border-gray-50 hover:bg-indigo-50"
                        }`}
                      >
                        <div>
                            <div className={`font-bold text-sm ${isDarkMode?"text-gray-200 group-hover:text-indigo-400":"text-gray-800 group-hover:text-indigo-600"}`}>
                              {product.name}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5 flex flex-col gap-0.5">
                              {product.genericName && <span>{product.genericName}</span>}
                              <span className="opacity-75">SKU: {product.sku || "N/A"}</span>
                            </div>
                        </div>
                        <div className={`text-[10px] font-bold px-2 py-1 rounded ml-3 shrink-0 ${
                            isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                        }`}>
                            Stock: {product.stock}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
             </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Inputs Row - Only show if product selected */}
          {selectedProduct ? (
             <div className={`p-4 rounded-xl border-2 border-dashed animate-in fade-in slide-in-from-top-4 ${
               isDarkMode ? "border-indigo-900/50 bg-indigo-900/10" : "border-indigo-100 bg-indigo-50/50"
             }`}>
                <div className="flex justify-between items-center mb-4">
                   <h4 className={`font-bold ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                      Details for: {selectedProduct.name}
                   </h4>
                   <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">SELECTED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold mb-1 text-gray-500">Qty</label>
                    <input 
                      type="number" min="1" 
                      value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)||1))}
                      className={`w-full p-2.5 rounded-lg border font-bold text-center outline-none focus:border-indigo-500 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold mb-1 text-gray-500">Cost (Buy)</label>
                    <input 
                      type="number" min="0" 
                      value={sourcingCost} onChange={e => setSourcingCost(parseFloat(e.target.value)||0)}
                      className={`w-full p-2.5 rounded-lg border font-bold text-center outline-none focus:border-indigo-500 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold mb-1 text-gray-500">Price (Sell)</label>
                    <input 
                      type="number" min="0" 
                      value={salePrice} onChange={e => setSalePrice(parseFloat(e.target.value)||0)}
                      className={`w-full p-2.5 rounded-lg border font-bold text-center outline-none focus:border-indigo-500 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={handleAddToQueue}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-md transition-colors flex items-center justify-center gap-1"
                    >
                      <MdPlaylistAdd className="text-xl" />
                      <span>Enqueue</span>
                    </button>
                  </div>
                </div>
             </div>
          ) : (
             <div className={`p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center opacity-50 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <MdSearch className="text-4xl mb-2" />
                <p className="text-sm font-medium">Search for a product above to add details</p>
             </div>
          )}

          {/* Queue List */}
          {queue.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                <span>Pending List</span>
                <span className="w-full h-px bg-current opacity-20"></span>
              </h4>
              <div className={`rounded-xl border divide-y overflow-hidden ${isDarkMode ? "border-gray-700 divide-gray-700" : "border-gray-200 divide-gray-100"}`}>
                {queue.map((item) => (
                  <div key={item.tempId} className={`p-3 flex items-center justify-between ${isDarkMode ? "bg-gray-800/50" : "bg-white"}`}>
                    <div className="flex-1">
                      <div className={`font-bold text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.product.name}</div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-3">
                         <span className="bg-gray-100 dark:bg-gray-700 px-1.5 rounded">Qty: <b>{item.qty}</b></span>
                         <span className="bg-gray-100 dark:bg-gray-700 px-1.5 rounded">Cost: <b>{item.cost}</b></span>
                         <span className="bg-gray-100 dark:bg-gray-700 px-1.5 rounded">Price: <b>{item.price}</b></span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromQueue(item.tempId)}
                      className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end gap-3 shrink-0 ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              isDarkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>
          
          <button
            onClick={handleFinalConfirm}
            disabled={queue.length === 0 && !selectedProduct}
            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-lg shadow-green-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdAddShoppingCart className="text-xl" />
            {(queue.length + (selectedProduct ? 1 : 0)) > 1 
              ? `Confirm All (${queue.length + (selectedProduct ? 1 : 0)})` 
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};
