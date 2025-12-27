"use client";
import { createSale } from "@/app/actions/sales";
import { getAllProducts } from "@/app/actions/product";
import { getAllStores } from "@/app/actions/stores";
import { getAllCustomers, createCustomer } from "@/app/actions/customers";
import { useSidebar } from "@/lib/SidebarContext";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { InvoiceModal } from "./InvoiceModal";
import { PaymentModal } from "./PaymentModal";
import { POSCart } from "./POSCart";
import { POSHeader } from "./POSHeader";
import { POSProducts } from "./POSProducts";
import { CartItem, Customer, HeldOrder, Invoice, Product } from "./types";

const PointOFSaleDetilasPage = () => {
  const { isDarkMode } = useSidebar();

  // Search & Products
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemDiscount, setItemDiscount] = useState<{ [key: string]: number }>(
    {}
  );

  // Customer
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState<Customer[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showHeldOrdersModal, setShowHeldOrdersModal] = useState(false);
  const [showHoldOrderModal, setShowHoldOrderModal] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "wallet"
  >("cash");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"percent" | "fixed">(
    "percent"
  );

  // Orders
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [holdOrderNote, setHoldOrderNote] = useState("");
  const [lastInvoice, setLastInvoice] = useState<Invoice | null>(null);

  // Store
  const [storeId, setStoreId] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");

  // UI State
  const [scannerActive, setScannerActive] = useState(false);

  // Refs
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // ==================== CALLBACKS ====================

  const handleBarcodeScanned = useCallback(
    (barcode: string) => {
      const product = products.find(
        (p) => p.barcode === barcode || p.sku === barcode
      );
      if (product) {
        if (product.stock <= 0) {
          toast.error("Out of stock!");
          return;
        }

        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantity >= product.stock) {
            toast.error("Insufficient stock!");
            return;
          }
          setCart(
            cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          setCart([
            ...cart,
            {
              ...product,
              quantity: 1,
              subtotal: product.price,
              discount: 0,
            },
          ]);
        }
        toast.success(`${product.name} added`);
        setBarcodeInput("");
      } else {
        toast.error("Product not found");
      }
    },
    [products, cart]
  );

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    setShowPaymentModal(true);
    setTimeout(() => phoneInputRef.current?.focus(), 100);
  }, [cart]);

  // ==================== EFFECTS ====================

  // Fetch store on mount
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const result = await getAllStores({ limit: 1 });
        if (result.success && result.data?.stores?.length > 0) {
          const store = result.data.stores[0];
          setStoreId(store._id);
          setStoreName(store.name || "Pharmacy");
          toast.success(`Connected to ${store.name}`);
        } else {
          toast.error("Store not configured!");
        }
      } catch (error) {
        console.error("Store fetch error:", error);
        toast.error("Failed to load store info");
      }
    };
    fetchStore();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const result = await getAllProducts({ limit: 500 });

        if (!result.success || !result.data?.products) {
          throw new Error("Failed to fetch products");
        }

        const transformedProducts = result.data.products.map(
          (p: Record<string, any>) => ({
            id: p._id,
            name: p.name,
            price: p.price || 0,
            cost: p.cost,
            category: p.category || "General",
            stock: p.stock || 0,
            sku: p.sku || "",
            barcode: p.barcode || p.sku || "",
            isPrescription: p.isPrescription || false,
            isControlled: p.isControlled || false,
            genericName: p.genericName,
            dosage: p.dosage,
            strength: p.strength,
            unit: p.unit || "pcs",
            manufacturer: p.manufacturer,
            hasExpiry: p.hasExpiry,
            expiryDate: p.expiryDate,
            batchNumber: p.batchNumber,
            taxRate: p.taxRate || 0,
            isLowStock: p.stock <= (p.reorderLevel || 10),
            reorderLevel: p.reorderLevel,
            image: p.mainImage?.thumbUrl || p.mainImage?.url,
          })
        );

        setProducts(transformedProducts);

        const uniqueCategories = [
          ...new Set(
            transformedProducts.map((p: { category: string }) => p.category)
          ),
        ].filter(Boolean) as string[];
        setCategories(uniqueCategories.sort());
      } catch {
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Barcode scanner listener
  useEffect(() => {
    let scanBuffer = "";
    let scanTimeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      clearTimeout(scanTimeout);

      if (e.key === "Enter" && scanBuffer.length > 5) {
        handleBarcodeScanned(scanBuffer);
        scanBuffer = "";
      } else {
        scanBuffer += e.key;
        scanTimeout = setTimeout(() => {
          scanBuffer = "";
        }, 100);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleBarcodeScanned]);

  // Click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        phoneInputRef.current &&
        !phoneInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSuggestions]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "F3") {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === "F8" && cart.length > 0) {
        e.preventDefault();
        handleCheckout();
      } else if (e.key === "F9" && cart.length > 0) {
        e.preventDefault();
        setShowHoldOrderModal(true);
      } else if (e.key === "F10") {
        e.preventDefault();
        setShowHeldOrdersModal(true);
      } else if (e.key === "Escape") {
        setShowPaymentModal(false);
        setShowInvoiceModal(false);
        setShowHeldOrdersModal(false);
        setShowHoldOrderModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, handleCheckout]);

  // ==================== HANDLERS ====================

  const searchCustomers = useCallback(async (phone: string): Promise<Customer[]> => {
    if (!phone || phone.length < 3) {
      setCustomerSuggestions([]);
      setShowSuggestions(false);
      return [];
    }

    setIsSearchingCustomer(true);
    try {
      // Search by phone number specifically
      const result = await getAllCustomers({ search: phone, limit: 10 });
      if (result.success && result.data?.customers?.length > 0) {
        const customers = result.data!.customers;
        setCustomerSuggestions(customers);
        setShowSuggestions(true);
        return customers;
      } else {
        setCustomerSuggestions([]);
        setShowSuggestions(false);
        return [];
      }
    } catch {
      setCustomerSuggestions([]);
      setShowSuggestions(false);
      return [];
    } finally {
      setIsSearchingCustomer(false);
    }
  }, []);

  const handlePhoneInput = (value: string) => {
    const phone = value.replace(/\D/g, "");
    setCustomerPhone(phone);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!phone) {
      setSelectedCustomer(null);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (phone.length >= 3) {
      searchDebounceRef.current = setTimeout(() => {
        searchCustomers(phone);
      }, 400);
    }
  };

  const selectCustomer = (customer: Partial<Customer> & { _id?: string }) => {
    setSelectedCustomer({
      id: customer._id || customer.id || "",
      _id: customer._id,
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email,
      membershipType: customer.membershipType || "regular",
      loyaltyPoints: customer.loyaltyPoints || 0,
      totalSpent: customer.totalSpent || 0,
    });
    setCustomerPhone(customer.phone || "");
    setCustomerName(customer.name || "");
    setCustomerEmail(customer.email || "");
    setShowSuggestions(false);
    toast.success(`Selected: ${customer.name}`);
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Out of stock!");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("Insufficient stock!");
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1, subtotal: product.price, discount: 0 },
      ]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            if (newQuantity > item.stock) {
              toast.error("Insufficient stock!");
              return item;
            }
            return {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.price,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    const newDiscount = { ...itemDiscount };
    delete newDiscount[id];
    setItemDiscount(newDiscount);
  };

  const clearCart = () => {
    setCart([]);
    setItemDiscount({});
    setAppliedDiscount(0);
    toast.success("Cart cleared");
  };

  // Calculations
  const getItemDiscount = (item: CartItem) => {
    const discountPercent = itemDiscount[item.id] || 0;
    return (item.subtotal * discountPercent) / 100;
  };

  const getItemFinalPrice = (item: CartItem) => {
    return item.subtotal - getItemDiscount(item);
  };

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + item.subtotal, 0);

  const calculateItemDiscounts = () =>
    cart.reduce((sum, item) => sum + getItemDiscount(item), 0);

  const getMembershipDiscount = () => {
    if (
      !selectedCustomer?.membershipType ||
      selectedCustomer.membershipType === "none" ||
      selectedCustomer.membershipType === "regular"
    )
      return 0;
    const subtotal = calculateSubtotal() - calculateItemDiscounts();
    const rates: Record<string, number> = {
      silver: 0.05,
      gold: 0.1,
      platinum: 0.15,
    };
    return subtotal * (rates[selectedCustomer.membershipType] || 0);
  };

  const calculateOrderDiscount = () => {
    const subtotal =
      calculateSubtotal() - calculateItemDiscounts() - getMembershipDiscount();
    if (discountType === "percent") {
      return (subtotal * appliedDiscount) / 100;
    }
    return Math.min(appliedDiscount, subtotal);
  };

  const calculateTax = () => {
    const subtotal =
      calculateSubtotal() -
      calculateItemDiscounts() -
      getMembershipDiscount() -
      calculateOrderDiscount();
    return subtotal * 0.05; // 5% tax
  };

  const calculateGrandTotal = () => {
    return (
      calculateSubtotal() -
      calculateItemDiscounts() -
      getMembershipDiscount() -
      calculateOrderDiscount() +
      calculateTax()
    );
  };

  const getChangeAmount = () => {
    const received = parseFloat(receivedAmount) || 0;
    return Math.max(0, received - calculateGrandTotal());
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setCustomerPhone("");
    setCustomerName("");
    setCustomerEmail("");
    setReceivedAmount("");
    setShowSuggestions(false);
  };

  const processPayment = async () => {
    const grandTotal = calculateGrandTotal();

    if (paymentMethod === "cash") {
      const received = parseFloat(receivedAmount);
      if (!received || received < grandTotal) {
        toast.error("Insufficient amount!");
        return;
      }
    }

    try {
      // Handle customer
      let customerId = selectedCustomer?._id || selectedCustomer?.id;
      let customerData = selectedCustomer;

      // Auto-create customer if phone exists but no customer selected
      if (!customerId && customerPhone.trim()) {
        try {
          // Check if customer already exists by phone
          const checkResult = await getAllCustomers({ search: customerPhone.trim(), limit: 1 });
          if (checkResult.success && checkResult.data?.customers?.length > 0) {
            // Customer exists, use it
            const existingCustomer = checkResult.data!.customers[0];
            customerId = existingCustomer._id;
            customerData = {
              id: existingCustomer._id,
              _id: existingCustomer._id,
              name: existingCustomer.name || customerName.trim() || "Walk-in Customer",
              phone: existingCustomer.phone || customerPhone.trim(),
              email: existingCustomer.email || customerEmail.trim() || undefined,
              membershipType: existingCustomer.membershipType || "regular",
              loyaltyPoints: existingCustomer.loyaltyPoints || 0,
              totalSpent: existingCustomer.totalSpent || 0,
            };
          } else {
            // Create new customer with phone (name and email optional)
            const formData = new FormData();
            formData.append("name", customerName.trim() || "Walk-in Customer");
            formData.append("phone", customerPhone.trim());
            if (customerEmail.trim()) formData.append("email", customerEmail.trim());
            formData.append("loyaltyPoints", "0");

            const createResult = await createCustomer(formData);
            if (createResult.success && createResult.data) {
              customerId = createResult.data._id;
              customerData = {
                id: createResult.data._id,
                _id: createResult.data._id,
                name: createResult.data.name || customerName.trim() || "Walk-in Customer",
                phone: createResult.data.phone || customerPhone.trim(),
                email: createResult.data.email || customerEmail.trim() || undefined,
                membershipType: createResult.data.membershipType || "regular",
                loyaltyPoints: createResult.data.loyaltyPoints || 0,
                totalSpent: createResult.data.totalSpent || 0,
              };
              toast.success("New customer created");
            }
          }
        } catch (error) {
          console.error("Error handling customer:", error);
          // Continue with sale even if customer creation fails
        }
      }

      if (!storeId) {
        toast.error("Store not configured!");
        return;
      }

      // Create sale using server action
      const saleData = {
        storeId,
        customerId: customerId || undefined,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          discount: getItemDiscount(item),
        })),
        payments: [
          {
            method:
              paymentMethod === "wallet" ? "mobile_wallet" : paymentMethod,
            amount: grandTotal,
            reference:
              paymentMethod !== "cash" ? `REF-${Date.now()}` : undefined,
          },
        ],
      };

      const formData = new FormData();
      formData.append("saleData", JSON.stringify(saleData));

      console.log("Creating sale with data:", saleData);
      const saleResult = await createSale(formData);
      console.log("Sale result:", saleResult);

      if (!saleResult.success || !saleResult.data) {
        const errorMsg = saleResult.error || "Failed to create sale";
        console.error("Sale creation failed:", errorMsg, saleResult);
        throw new Error(errorMsg);
      }

      const savedSale = saleResult.data;
      console.log("Sale created successfully:", savedSale);

      // Create invoice
      const invoice: Invoice = {
        invoiceNumber: savedSale.saleNo,
        date: savedSale.createdAt || new Date().toISOString(),
        customer: customerData || {
          name: customerName.trim() || "Walk-in Customer",
          phone: customerPhone.trim() || "",
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
          discount: getItemDiscount(item),
          finalPrice: getItemFinalPrice(item),
        })),
        subtotal: calculateSubtotal(),
        itemDiscounts: calculateItemDiscounts(),
        membershipDiscount: getMembershipDiscount(),
        orderDiscount: calculateOrderDiscount(),
        tax: calculateTax(),
        grandTotal,
        paymentMethod,
        receivedAmount:
          paymentMethod === "cash" ? parseFloat(receivedAmount) : grandTotal,
        changeAmount: paymentMethod === "cash" ? getChangeAmount() : 0,
      };

      setLastInvoice(invoice);
      setCart([]);
      setItemDiscount({});
      setAppliedDiscount(0);
      setSelectedCustomer(null);
      setShowPaymentModal(false);
      setReceivedAmount("");
      setCustomerPhone("");
      setCustomerName("");
      setCustomerEmail("");
      setShowInvoiceModal(true);
      toast.success("Sale completed!");
    } catch (error: any) {
      console.error("Payment process error:", error);
      const errorMessage = error.message || error.response?.data?.message || "Payment failed!";
      toast.error(errorMessage);
    }
  };

  const startNewSale = () => {
    setShowInvoiceModal(false);
    setLastInvoice(null);
  };

  const quickCashAmounts = [50, 100, 200, 500, 1000];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery) ||
      product.genericName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={`h-[calc(100vh-5rem)] flex flex-col font-sans transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-slate-50 text-gray-800"
      }`}
    >
      <POSHeader
        isDarkMode={isDarkMode}
        storeName={storeName}
        heldOrdersCount={heldOrders.length}
        onOpenHeldOrders={() => setShowHeldOrdersModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <POSProducts
          isDarkMode={isDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          barcodeInput={barcodeInput}
          setBarcodeInput={setBarcodeInput}
          handleBarcodeScanned={handleBarcodeScanned}
          scannerActive={scannerActive}
          setScannerActive={setScannerActive}
          searchInputRef={searchInputRef}
          barcodeInputRef={barcodeInputRef}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isLoadingProducts={isLoadingProducts}
          filteredProducts={filteredProducts}
          addToCart={addToCart}
        />

        <POSCart
          isDarkMode={isDarkMode}
          cart={cart}
          itemDiscount={itemDiscount}
          setItemDiscount={setItemDiscount}
          clearCart={clearCart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          getItemFinalPrice={getItemFinalPrice}
          calculateSubtotal={calculateSubtotal}
          calculateItemDiscounts={calculateItemDiscounts}
          getMembershipDiscount={getMembershipDiscount}
          calculateOrderDiscount={calculateOrderDiscount}
          calculateTax={calculateTax}
          calculateGrandTotal={calculateGrandTotal}
          handleCheckout={handleCheckout}
        />
      </div>

      <PaymentModal
        isDarkMode={isDarkMode}
        showPaymentModal={showPaymentModal}
        closePaymentModal={closePaymentModal}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        customerPhone={customerPhone}
        handlePhoneInput={handlePhoneInput}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerEmail={customerEmail}
        setCustomerEmail={setCustomerEmail}
        isSearchingCustomer={isSearchingCustomer}
        showSuggestions={showSuggestions}
        customerSuggestions={customerSuggestions}
        selectCustomer={selectCustomer}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        receivedAmount={receivedAmount}
        setReceivedAmount={setReceivedAmount}
        calculateGrandTotal={calculateGrandTotal}
        getChangeAmount={getChangeAmount}
        processPayment={processPayment}
        phoneInputRef={phoneInputRef}
        quickCashAmounts={quickCashAmounts}
      />

      <InvoiceModal
        showInvoiceModal={showInvoiceModal}
        lastInvoice={lastInvoice}
        storeName={storeName}
        startNewSale={startNewSale}
      />

      {/* Global Styles for Scrollbar */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default PointOFSaleDetilasPage;