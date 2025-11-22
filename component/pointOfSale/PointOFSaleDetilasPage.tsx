"use client";
import api from "@/lib/api";
import { useSidebar } from "@/lib/SidebarContext";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdCash } from "react-icons/io";
import {
  MdAccountBalanceWallet,
  MdAdd,
  MdAttachMoney,
  MdCheck,
  MdClose,
  MdCreditCard,
  MdDelete,
  MdEmail,
  MdLocalOffer,
  MdPayment,
  MdPercent,
  MdPerson,
  MdPrint,
  MdQrCodeScanner,
  MdRemove,
  MdSearch,
  MdShoppingCart,
} from "react-icons/md";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
  sku: string;
  barcode: string;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
  discount: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  membershipType?: "none" | "silver" | "gold" | "platinum";
  membershipNumber?: string;
  points?: number;
}

interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount?: number;
}

const PointOFSaleDetilasPage = () => {
  const { isDarkMode } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "wallet"
  >("cash");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [itemDiscount, setItemDiscount] = useState<{ [key: string]: number }>(
    {}
  );
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(1001);
  const [scannerActive, setScannerActive] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [membershipType, setMembershipType] = useState<
    "none" | "silver" | "gold" | "platinum"
  >("none");
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [showCustomerFields, setShowCustomerFields] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [storeId, setStoreId] = useState<string>("");
  const [customerSuggestions, setCustomerSuggestions] = useState<Customer[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchDebounceTimer, setSearchDebounceTimer] =
    useState<NodeJS.Timeout | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch store information on component mount
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get("/stores");
        if (response.data && response.data.length > 0) {
          const firstStore = response.data[0];
          setStoreId(firstStore._id);
          console.log(
            "✅ Store ID set:",
            firstStore._id,
            "- Store:",
            firstStore.name
          );
          toast.success(`Connected to ${firstStore.name}`);
        } else {
          console.error("❌ No stores found in database");
          toast.error(
            "No store found. Please contact administrator to set up a store."
          );
        }
      } catch (error: any) {
        console.error("❌ Error fetching store:", error);
        toast.error(
          error.response?.data?.message || "Failed to load store information"
        );
      }
    };

    fetchStore();
  }, []);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await api.get("/products");

        // Transform backend data to match our Product interface
        const transformedProducts = response.data.products.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          price: p.sellingPrice || p.price,
          category: p.category?.name || p.category || "General",
          stock: p.stock || p.quantity || 0,
          sku: p.sku || p.code || "",
          barcode: p.barcode || p.sku || "",
          image: p.image || "📦",
        }));

        setProducts(transformedProducts);
        toast.success(`${transformedProducts.length} products loaded`);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Sample coupons (you can also fetch these from backend if needed)
  const availableCoupons: Coupon[] = [
    { code: "SAVE10", type: "percentage", value: 10, minAmount: 20 },
    { code: "SAVE20", type: "percentage", value: 20, minAmount: 50 },
    { code: "FLAT5", type: "fixed", value: 5, minAmount: 15 },
    { code: "WELCOME", type: "percentage", value: 15, minAmount: 30 },
  ];

  // Listen for barcode scanner input (keyboard wedge)
  useEffect(() => {
    let scanBuffer = "";
    let scanTimeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      clearTimeout(scanTimeout);

      if (e.key === "Enter") {
        if (scanBuffer.length > 5) {
          // Likely a barcode scan
          handleBarcodeScanned(scanBuffer);
          scanBuffer = "";
        }
      } else {
        scanBuffer += e.key;
        scanTimeout = setTimeout(() => {
          scanBuffer = "";
        }, 100); // Reset if too slow (not a scanner)
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [cart]);

  // Close suggestions dropdown when clicking outside
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

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(
      (p) => p.barcode === barcode || p.sku === barcode
    );
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
      setBarcodeInput("");
    } else {
      toast.error("Product not found!");
    }
  };

  // Search customers as user types (with debouncing)
  const searchCustomers = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setCustomerSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Search customers by phone or name
      const response = await api.get(`/customers?search=${searchQuery}`);

      if (response.data && response.data.length > 0) {
        setCustomerSuggestions(response.data.slice(0, 5)); // Show max 5 suggestions
        setShowSuggestions(true);
      } else {
        setCustomerSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error searching customers:", error);
      setCustomerSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle phone input with debounced search
  const handlePhoneInput = (value: string) => {
    const phone = value.replace(/\D/g, ""); // Remove non-digits
    setCustomerPhone(phone);

    // Clear previous timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    // Reset states if input is cleared
    if (!phone) {
      setPhoneExists(false);
      setShowCustomerFields(false);
      setCustomerName("");
      setCustomerEmail("");
      setMembershipType("none");
      setCustomerSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Show suggestions after 3 digits
    if (phone.length >= 3) {
      const timer = setTimeout(() => {
        searchCustomers(phone);
      }, 500); // 500ms debounce
      setSearchDebounceTimer(timer);
    } else {
      setCustomerSuggestions([]);
      setShowSuggestions(false);
    }

    // Exact match check after 10 digits
    if (phone.length === 10) {
      checkExactPhoneMatch(phone);
    }
  };

  // Check for exact phone match
  const checkExactPhoneMatch = async (phone: string) => {
    setIsCheckingPhone(true);
    setShowSuggestions(false); // Hide suggestions when checking exact match

    try {
      const response = await api.get(`/customers/phone/${phone}`);

      if (response.data) {
        selectCustomer(response.data);
      } else {
        // New customer
        setPhoneExists(false);
        setShowCustomerFields(true);
        setCustomerName("");
        setCustomerEmail("");
        setMembershipType("none");
        console.log("📝 New customer - phone not found");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setPhoneExists(false);
        setShowCustomerFields(true);
        setCustomerName("");
        setCustomerEmail("");
        setMembershipType("none");
        console.log("📝 New customer - 404 response");
        toast("New customer - please enter details");
      } else {
        console.error("❌ Error checking customer:", error);
        setShowCustomerFields(false);
      }
    } finally {
      setIsCheckingPhone(false);
    }
  };

  // Select customer from suggestion or search result
  const selectCustomer = (customer: any) => {
    setPhoneExists(true);
    setShowCustomerFields(true);
    setCustomerPhone(customer.phone || "");
    setCustomerName(customer.name || "");
    setCustomerEmail(customer.email || "");
    setMembershipType(customer.membershipType || "none");
    setShowSuggestions(false);
    setCustomerSuggestions([]);
    toast.success(`Welcome back, ${customer.name}!`);
    console.log(
      "✅ Customer selected:",
      customer.name,
      "| Membership:",
      customer.membershipType
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
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

  const applyItemDiscount = (id: string, discountPercent: number) => {
    if (discountPercent < 0 || discountPercent > 100) {
      toast.error("Discount must be between 0-100%");
      return;
    }
    setItemDiscount({ ...itemDiscount, [id]: discountPercent });
    toast.success(`${discountPercent}% discount applied!`);
  };

  const getItemDiscount = (item: CartItem) => {
    const discountPercent = itemDiscount[item.id] || 0;
    return (item.subtotal * discountPercent) / 100;
  };

  const getItemFinalPrice = (item: CartItem) => {
    return item.subtotal - getItemDiscount(item);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateItemDiscounts = () => {
    return cart.reduce((sum, item) => sum + getItemDiscount(item), 0);
  };

  const getMembershipDiscount = () => {
    if (membershipType === "none") return 0;

    const subtotal = calculateSubtotal() - calculateItemDiscounts();

    switch (membershipType) {
      case "silver":
        return subtotal * 0.05; // 5% discount
      case "gold":
        return subtotal * 0.1; // 10% discount
      case "platinum":
        return subtotal * 0.15; // 15% discount
      default:
        return 0;
    }
  };

  const getMembershipPoints = () => {
    if (membershipType === "none") return 0;

    const grandTotal = calculateGrandTotal();

    switch (membershipType) {
      case "silver":
        return Math.floor(grandTotal * 1); // 1 point per dollar
      case "gold":
        return Math.floor(grandTotal * 2); // 2 points per dollar
      case "platinum":
        return Math.floor(grandTotal * 3); // 3 points per dollar
      default:
        return 0;
    }
  };

  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateSubtotal() - calculateItemDiscounts();

    if (appliedCoupon.minAmount && subtotal < appliedCoupon.minAmount) {
      return 0;
    }

    if (appliedCoupon.type === "percentage") {
      return (subtotal * appliedCoupon.value) / 100;
    } else {
      return appliedCoupon.value;
    }
  };

  const calculateTax = () => {
    const subtotal =
      calculateSubtotal() -
      calculateItemDiscounts() -
      calculateCouponDiscount() -
      getMembershipDiscount();
    return subtotal * 0.1; // 10% tax
  };

  const calculateGrandTotal = () => {
    return (
      calculateSubtotal() -
      calculateItemDiscounts() -
      calculateCouponDiscount() -
      getMembershipDiscount() +
      calculateTax()
    );
  };

  const applyCoupon = () => {
    const coupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === couponCode.toUpperCase()
    );

    if (!coupon) {
      toast.error("Invalid coupon code!");
      return;
    }

    const subtotal = calculateSubtotal() - calculateItemDiscounts();
    if (coupon.minAmount && subtotal < coupon.minAmount) {
      toast.error(`Minimum purchase of $${coupon.minAmount} required!`);
      return;
    }

    setAppliedCoupon(coupon);
    setShowCouponModal(false);
    toast.success(`Coupon ${coupon.code} applied successfully!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    setShowPaymentModal(true);
    // Focus on phone input when modal opens
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setMembershipType("none");
    setPhoneExists(false);
    setShowCustomerFields(false);
    setIsCheckingPhone(false);
    setReceivedAmount("");
    setCustomerSuggestions([]);
    setShowSuggestions(false);
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      setSearchDebounceTimer(null);
    }
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
      // Step 1: Handle customer creation/lookup if phone is provided
      let customerId = null;
      let customerData = null;

      if (customerPhone.trim()) {
        try {
          // Try to find existing customer by phone using the same endpoint as checkPhoneNumber
          const customerResponse = await api.get(
            `/customers/phone/${customerPhone.trim()}`
          );

          if (customerResponse.data) {
            // Customer exists
            customerId = customerResponse.data._id;
            customerData = customerResponse.data;
            console.log("✅ Using existing customer:", customerData.name);
          }
        } catch (error: any) {
          // Customer not found (404) - create new if name is provided
          if (error.response?.status === 404 && customerName.trim()) {
            try {
              const newCustomerResponse = await api.post("/customers", {
                name: customerName.trim(),
                phone: customerPhone.trim(),
                email: customerEmail.trim() || undefined,
                membershipType: "regular", // Default membership
              });
              customerId = newCustomerResponse.data._id;
              customerData = newCustomerResponse.data;
              console.log("✅ Created new customer:", customerData.name);
            } catch (createError) {
              console.error("❌ Error creating customer:", createError);
              // Continue without customer if creation fails
            }
          } else {
            console.error("❌ Customer handling error:", error);
            // Continue without customer if there's an error
          }
        }
      }

      // Step 2: Validate storeId
      if (!storeId || storeId.trim() === "") {
        toast.error(
          "Store information not available. Please refresh the page or contact administrator."
        );
        console.error("❌ Sale failed: No store ID available");
        return;
      }

      console.log("💰 Processing sale for store:", storeId);

      // Step 3: Prepare sale data in correct backend format
      const saleData = {
        storeId: storeId, // Required by backend
        customerId: customerId, // Optional ObjectId reference
        items: cart.map((item) => ({
          productId: item.id, // Backend expects productId
          quantity: item.quantity,
          discount: getItemDiscount(item), // Item-level discount
        })),
        payments: [
          {
            method:
              paymentMethod === "cash"
                ? "cash"
                : paymentMethod === "card"
                ? "card"
                : "mobile_wallet",
            amount: grandTotal,
            reference:
              paymentMethod !== "cash" ? `REF-${Date.now()}` : undefined,
          },
        ],
      };

      // Send sale to backend
      const response = await api.post("/sales", saleData);

      const savedSale = response.data;

      // Create invoice for display
      const invoice = {
        invoiceNumber: savedSale.saleNo || `INV-${Date.now()}`,
        date: savedSale.createdAt || new Date().toISOString(),
        customer: customerData || {
          name: customerName.trim() || "Walk-in Customer",
          phone: customerPhone.trim() || null,
          email: customerEmail.trim() || null,
          membershipType: membershipType,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
          discount: getItemDiscount(item),
          finalPrice: getItemFinalPrice(item),
        })),
        subtotal: calculateSubtotal(),
        itemDiscounts: calculateItemDiscounts(),
        couponDiscount: calculateCouponDiscount(),
        membershipDiscount: getMembershipDiscount(),
        appliedCoupon: appliedCoupon,
        tax: calculateTax(),
        grandTotal: grandTotal,
        paymentMethod: paymentMethod,
        receivedAmount:
          paymentMethod === "cash" ? parseFloat(receivedAmount) : grandTotal,
        changeAmount: paymentMethod === "cash" ? getChangeAmount() : 0,
        earnedPoints:
          customerData?.membershipType !== "none" ? Math.floor(grandTotal) : 0,
      };

      setLastInvoice(invoice);
      setInvoiceNumber(invoiceNumber + 1);

      // Reset everything
      setCart([]);
      setSelectedCustomer(customerData);
      setShowPaymentModal(false);
      setReceivedAmount("");
      setAppliedCoupon(null);
      setCouponCode("");
      setItemDiscount({});
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setMembershipType("none");
      setPhoneExists(false);
      setShowCustomerFields(false);
      setIsCheckingPhone(false);
      setCustomerSuggestions([]);
      setShowSuggestions(false);
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
        setSearchDebounceTimer(null);
      }

      // Show invoice
      setShowInvoiceModal(true);
      toast.success("Payment successful!");

      if (customerData && customerData.membershipType !== "none") {
        toast.success(`${invoice.earnedPoints} points earned!`, {
          icon: "🎉",
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to process payment. Please try again.";
      toast.error(errorMessage);
    }
  };

  const getChangeAmount = () => {
    const received = parseFloat(receivedAmount) || 0;
    const grandTotal = calculateGrandTotal();
    return Math.max(0, received - grandTotal);
  };

  const printInvoice = () => {
    window.print();
    toast.success("Printing invoice...");
  };

  const emailInvoice = () => {
    if (!selectedCustomer?.email) {
      toast.error("Customer email not available!");
      return;
    }
    // API call to send email would go here
    toast.success(`Invoice sent to ${selectedCustomer.email}`);
  };

  const startNewSale = () => {
    setShowInvoiceModal(false);
    setLastInvoice(null);
  };

  return (
    <div className="h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Point of Sale System
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Professional POS for Pharmacy & Supermarket
        </p>
      </div>

      {/* Main POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-8rem)]">
        {/* Left Section - Products */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Search & Barcode Section */}
          <div
            className={`p-4 rounded-xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Search Bar */}
              <div className="relative">
                <MdSearch
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-xl ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, SKU, barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:border-indigo-500 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Barcode Scanner Input */}
              <div className="relative">
                <MdQrCodeScanner
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-xl ${
                    scannerActive
                      ? "text-green-500 animate-pulse"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Scan or enter barcode..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleBarcodeScanned(barcodeInput);
                    }
                  }}
                  onFocus={() => setScannerActive(true)}
                  onBlur={() => setScannerActive(false)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:border-green-500 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div
                className={`p-2 rounded-lg text-center ${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                }`}
              >
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-blue-600"
                  }`}
                >
                  Total Items
                </p>
                <p
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
              <div
                className={`p-2 rounded-lg text-center ${
                  isDarkMode ? "bg-gray-700" : "bg-green-50"
                }`}
              >
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-green-600"
                  }`}
                >
                  Products
                </p>
                <p
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-green-400" : "text-green-700"
                  }`}
                >
                  {products.length}
                </p>
              </div>
              <div
                className={`p-2 rounded-lg text-center ${
                  isDarkMode ? "bg-gray-700" : "bg-purple-50"
                }`}
              >
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-purple-600"
                  }`}
                >
                  In Cart
                </p>
                <p
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-purple-400" : "text-purple-700"
                  }`}
                >
                  {cart.length}
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={`flex-1 p-4 rounded-xl shadow-md overflow-y-auto ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 hover:border-indigo-500"
                      : "bg-gray-50 border-gray-200 hover:border-indigo-500"
                  }`}
                >
                  <div className="text-3xl mb-2 text-center">
                    {product.image}
                  </div>
                  <h3
                    className={`font-semibold mb-1 text-xs ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </h3>
                  <p
                    className={`text-xs mb-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {product.sku}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`font-bold text-sm ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        product.stock > 50
                          ? isDarkMode
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-700"
                          : product.stock > 20
                          ? isDarkMode
                            ? "bg-orange-900 text-orange-300"
                            : "bg-orange-100 text-orange-700"
                          : isDarkMode
                          ? "bg-red-900 text-red-300"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Cart & Checkout */}
        <div className="flex flex-col gap-4">
          {/* Customer Section */}
          <div
            className={`p-4 rounded-xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <MdPerson
                className={`text-2xl ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <div className="flex-1">
                {selectedCustomer ? (
                  <div>
                    <p
                      className={`font-semibold ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {selectedCustomer.name}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedCustomer.phone}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      // Demo customer for now
                      setSelectedCustomer({
                        id: "1",
                        name: "Walk-in Customer",
                        phone: "N/A",
                      });
                    }}
                    className={`text-sm ${
                      isDarkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-700"
                    }`}
                  >
                    + Add Customer
                  </button>
                )}
              </div>
              {selectedCustomer && (
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-red-500 hover:text-red-600"
                >
                  <MdClose />
                </button>
              )}
            </div>
          </div>

          {/* Cart */}
          <div
            className={`flex-1 rounded-xl shadow-md flex flex-col ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`p-4 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdShoppingCart
                    className={`text-2xl ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-bold text-lg ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Cart ({cart.length})
                  </h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => {
                      setCart([]);
                      setItemDiscount({});
                      setAppliedCoupon(null);
                      toast.success("Cart cleared");
                    }}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                  >
                    <MdDelete /> Clear
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <MdShoppingCart
                    className={`text-6xl mb-4 ${
                      isDarkMode ? "text-gray-600" : "text-gray-300"
                    }`}
                  />
                  <p
                    className={`text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Cart is empty. Scan or add products.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4
                            className={`font-semibold text-sm ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </h4>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className={`p-1 rounded ${
                              isDarkMode
                                ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                            }`}
                          >
                            <MdRemove className="text-sm" />
                          </button>
                          <span
                            className={`font-semibold px-2 min-w-[30px] text-center ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className={`p-1 rounded ${
                              isDarkMode
                                ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                            }`}
                          >
                            <MdAdd className="text-sm" />
                          </button>
                        </div>

                        {/* Item Discount */}
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="0%"
                            value={itemDiscount[item.id] || ""}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              applyItemDiscount(item.id, val);
                            }}
                            className={`w-16 px-2 py-1 text-xs rounded border ${
                              isDarkMode
                                ? "bg-gray-600 border-gray-500 text-gray-100"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          />
                          <MdPercent
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                        {getItemDiscount(item) > 0 && (
                          <div className="text-xs">
                            <span
                              className={
                                isDarkMode
                                  ? "text-gray-400 line-through"
                                  : "text-gray-600 line-through"
                              }
                            >
                              ${item.subtotal.toFixed(2)}
                            </span>
                            <span className="text-green-500 ml-2">
                              -${getItemDiscount(item).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <span
                          className={`font-bold ml-auto ${
                            isDarkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        >
                          ${getItemFinalPrice(item).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div
                className={`p-4 border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {/* Coupon Section */}
                <div className="mb-4">
                  {appliedCoupon ? (
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isDarkMode ? "bg-green-900" : "bg-green-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MdLocalOffer
                          className={
                            isDarkMode ? "text-green-300" : "text-green-700"
                          }
                        />
                        <span
                          className={`text-sm font-semibold ${
                            isDarkMode ? "text-green-300" : "text-green-700"
                          }`}
                        >
                          {appliedCoupon.code}
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className={`text-xs ${
                          isDarkMode ? "text-green-300" : "text-green-700"
                        }`}
                      >
                        <MdClose />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCouponModal(true)}
                      className={`w-full p-2 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? "border-gray-600 text-gray-400 hover:border-gray-500"
                          : "border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <MdLocalOffer />
                      <span className="text-sm">Apply Coupon</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Subtotal:
                    </span>
                    <span
                      className={
                        isDarkMode
                          ? "text-gray-100 font-semibold"
                          : "text-gray-900 font-semibold"
                      }
                    >
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>

                  {calculateItemDiscounts() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Item Discounts:</span>
                      <span className="text-green-600 font-semibold">
                        -${calculateItemDiscounts().toFixed(2)}
                      </span>
                    </div>
                  )}

                  {calculateCouponDiscount() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Coupon Discount:</span>
                      <span className="text-green-600 font-semibold">
                        -${calculateCouponDiscount().toFixed(2)}
                      </span>
                    </div>
                  )}

                  {getMembershipDiscount() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        Membership Discount:
                      </span>
                      <span className="text-green-600 font-semibold">
                        -${getMembershipDiscount().toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Tax (10%):
                    </span>
                    <span
                      className={
                        isDarkMode
                          ? "text-gray-100 font-semibold"
                          : "text-gray-900 font-semibold"
                      }
                    >
                      ${calculateTax().toFixed(2)}
                    </span>
                  </div>

                  <div
                    className={`flex justify-between pt-2 border-t text-lg ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`font-bold ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Total:
                    </span>
                    <span
                      className={`font-bold ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      ${calculateGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <MdPayment className="text-xl" />
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Apply Coupon
              </h2>
              <button
                onClick={() => setShowCouponModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-indigo-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              <button
                onClick={applyCoupon}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg mb-4"
              >
                Apply Coupon
              </button>

              <div className="space-y-2">
                <p
                  className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Available Coupons:
                </p>
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    onClick={() => {
                      setCouponCode(coupon.code);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer hover:border-indigo-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p
                          className={`font-bold ${
                            isDarkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        >
                          {coupon.code}
                        </p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {coupon.type === "percentage"
                            ? `${coupon.value}% OFF`
                            : `$${coupon.value} OFF`}
                          {coupon.minAmount && ` • Min: $${coupon.minAmount}`}
                        </p>
                      </div>
                      <MdLocalOffer
                        className={
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal - Enhanced with Customer Details & Membership */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-white/80 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl z-10">
              <div className="flex justify-between items-center p-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Complete Payment
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Enter customer details and select payment method
                  </p>
                </div>
                <button
                  onClick={closePaymentModal}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Amount Display */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
                <p className="text-sm text-gray-600 mb-1">
                  Total Amount to Pay
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${calculateGrandTotal().toFixed(2)}
                </p>
                {getMembershipDiscount() > 0 && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <MdCheck className="text-lg" />
                    Membership discount of ${getMembershipDiscount().toFixed(
                      2
                    )}{" "}
                    applied!
                  </p>
                )}
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <MdPerson className="text-xl text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Information
                  </h3>
                  <span className="text-xs text-gray-500">
                    (All fields are optional)
                  </span>
                </div>

                {/* Phone Number - Always Visible with Smart Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                    <span className="text-xs text-gray-500 ml-2">
                      (Type to search or enter new number)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      onFocus={() => {
                        if (
                          customerPhone.length >= 3 &&
                          customerSuggestions.length > 0
                        ) {
                          setShowSuggestions(true);
                        }
                      }}
                      placeholder="Enter phone number (min 3 digits)"
                      maxLength={15}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      autoComplete="off"
                    />
                    {isCheckingPhone && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      </div>
                    )}

                    {/* Customer Suggestions Dropdown */}
                    {showSuggestions && customerSuggestions.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-2 bg-white border-2 border-indigo-300 rounded-lg shadow-xl max-h-80 overflow-y-auto"
                      >
                        <div className="p-2">
                          <p className="text-xs font-semibold text-gray-600 px-2 py-1">
                            💡 Select a customer:
                          </p>
                          {customerSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.id || suggestion.phone}
                              onClick={() => selectCustomer(suggestion)}
                              className="w-full text-left px-3 py-3 rounded-lg hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <MdPerson className="text-indigo-600" />
                                    {suggestion.name}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    📞 {suggestion.phone}
                                  </p>
                                  {suggestion.email && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      ✉️ {suggestion.email}
                                    </p>
                                  )}
                                </div>
                                {suggestion.membershipType &&
                                  suggestion.membershipType !== "none" && (
                                    <div className="ml-2">
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300 text-xs font-bold uppercase">
                                        {suggestion.membershipType ===
                                          "silver" && "🥈"}
                                        {suggestion.membershipType === "gold" &&
                                          "🥇"}
                                        {suggestion.membershipType ===
                                          "platinum" && "💎"}
                                        {suggestion.membershipType}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Helper text */}
                  {customerPhone.length > 0 && customerPhone.length < 3 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Type at least 3 digits to search customers
                    </p>
                  )}
                  {customerPhone.length >= 3 &&
                    !showSuggestions &&
                    !isCheckingPhone &&
                    !phoneExists && (
                      <p className="text-xs text-amber-600 mt-1">
                        No matching customers found. Enter full number to create
                        new customer.
                      </p>
                    )}
                </div>

                {/* Customer Found Message */}
                {phoneExists && showCustomerFields && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <MdCheck className="text-green-600 text-2xl flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-800">
                        Customer Found!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Welcome back! Your details have been loaded.
                      </p>
                    </div>
                  </div>
                )}

                {/* New Customer Message */}
                {!phoneExists &&
                  showCustomerFields &&
                  customerPhone.length >= 10 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <MdPerson className="text-blue-600 text-2xl flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-blue-800">
                          New Customer
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Fill in details below to create a customer profile
                          (optional)
                        </p>
                      </div>
                    </div>
                  )}

                {/* Name and Email - Conditionally Shown */}
                {showCustomerFields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Name
                        <span className="text-xs text-gray-500 ml-2">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        disabled={phoneExists}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          phoneExists ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                        <span className="text-xs text-gray-500 ml-2">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="customer@example.com"
                        disabled={phoneExists}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          phoneExists ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Membership Status - Display Only (managed by backend) */}
              {showCustomerFields && membershipType !== "none" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MdLocalOffer className="text-xl text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Customer Membership
                    </h3>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-2 border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">
                        {membershipType === "silver"
                          ? "🥈"
                          : membershipType === "gold"
                          ? "🥇"
                          : "💎"}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 capitalize text-lg">
                          {membershipType} Member
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          This customer has a {membershipType} membership with
                          special benefits.
                        </p>
                        <ul className="text-sm text-gray-700 mt-3 space-y-1">
                          <li className="flex items-center gap-2">
                            <MdCheck className="text-green-600" />
                            {membershipType === "silver"
                              ? "5"
                              : membershipType === "gold"
                              ? "10"
                              : "15"}
                            % discount applied automatically
                          </li>
                          <li className="flex items-center gap-2">
                            <MdCheck className="text-green-600" />
                            Earns{" "}
                            {membershipType === "silver"
                              ? "1"
                              : membershipType === "gold"
                              ? "2"
                              : "3"}{" "}
                            point{membershipType === "silver" ? "" : "s"} per
                            dollar
                          </li>
                          <li className="flex items-center gap-2">
                            <MdCheck className="text-green-600" />
                            Will earn{" "}
                            <span className="font-bold text-indigo-600">
                              {getMembershipPoints()} points
                            </span>{" "}
                            from this sale
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Customer Message */}
              {showCustomerFields &&
                membershipType === "none" &&
                !phoneExists && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">👤</div>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-800">
                          Regular Customer
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          New customer will be created with regular membership.
                          The backend will manage membership upgrades.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Payment Method */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <MdPayment className="text-xl text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "cash"
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <IoMdCash
                      className={`text-4xl mx-auto mb-2 ${
                        paymentMethod === "cash"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm font-semibold ${
                        paymentMethod === "cash"
                          ? "text-indigo-600"
                          : "text-gray-700"
                      }`}
                    >
                      Cash
                    </p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "card"
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <MdCreditCard
                      className={`text-4xl mx-auto mb-2 ${
                        paymentMethod === "card"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm font-semibold ${
                        paymentMethod === "card"
                          ? "text-indigo-600"
                          : "text-gray-700"
                      }`}
                    >
                      Card
                    </p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("wallet")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "wallet"
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <MdAccountBalanceWallet
                      className={`text-4xl mx-auto mb-2 ${
                        paymentMethod === "wallet"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm font-semibold ${
                        paymentMethod === "wallet"
                          ? "text-indigo-600"
                          : "text-gray-700"
                      }`}
                    >
                      Wallet
                    </p>
                  </button>
                </div>
              </div>

              {/* Cash Payment Input */}
              {paymentMethod === "cash" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Received Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdAttachMoney className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
                    />
                  </div>
                  {receivedAmount &&
                    parseFloat(receivedAmount) >= calculateGrandTotal() && (
                      <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                        <p className="text-sm text-green-700 flex items-center gap-2">
                          <MdCheck className="text-lg" />
                          Change to Return:
                          <span className="font-bold text-xl text-green-600 ml-auto">
                            ${getChangeAmount().toFixed(2)}
                          </span>
                        </p>
                      </div>
                    )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={closePaymentModal}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <MdCheck className="text-xl" />
                  Complete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && lastInvoice && (
        <div className="fixed inset-0 bg-white/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-2xl w-full rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
            id="invoice-print"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Invoice
              </h2>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className={`p-2 rounded-lg transition-colors print:hidden ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            <div className="p-6">
              {/* Invoice Header */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-indigo-600">
                      Your Pharmacy/Store
                    </h1>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      123 Main Street, City, State 12345
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Phone: (555) 123-4567
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {lastInvoice.invoiceNumber}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {new Date(lastInvoice.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {lastInvoice.customer && (
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Customer:
                        </p>
                        <p
                          className={`font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {lastInvoice.customer.name}
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {lastInvoice.customer.phone}
                        </p>
                        {lastInvoice.customer.email && (
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {lastInvoice.customer.email}
                          </p>
                        )}
                      </div>
                      {lastInvoice.customer.membershipType &&
                        lastInvoice.customer.membershipType !== "none" && (
                          <div className="text-right">
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300">
                              <span className="text-lg">
                                {lastInvoice.customer.membershipType ===
                                "silver"
                                  ? "🥈"
                                  : lastInvoice.customer.membershipType ===
                                    "gold"
                                  ? "🥇"
                                  : "💎"}
                              </span>
                              <span className="text-xs font-bold text-purple-700 uppercase">
                                {lastInvoice.customer.membershipType}
                              </span>
                            </div>
                            {lastInvoice.customer.membershipNumber && (
                              <p className="text-xs text-gray-500 mt-1">
                                {lastInvoice.customer.membershipNumber}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b-2 ${
                        isDarkMode ? "border-gray-700" : "border-gray-300"
                      }`}
                    >
                      <th
                        className={`text-left py-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Item
                      </th>
                      <th
                        className={`text-center py-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Qty
                      </th>
                      <th
                        className={`text-right py-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Price
                      </th>
                      <th
                        className={`text-right py-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Discount
                      </th>
                      <th
                        className={`text-right py-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastInvoice.items.map((item: any) => (
                      <tr
                        key={item.id}
                        className={`border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <td
                          className={`py-2 ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                          <br />
                          <span
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.sku}
                          </span>
                        </td>
                        <td
                          className={`text-center ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {item.quantity}
                        </td>
                        <td
                          className={`text-right ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="text-right text-green-600">
                          {item.discount > 0
                            ? `-$${item.discount.toFixed(2)}`
                            : "-"}
                        </td>
                        <td
                          className={`text-right font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          ${item.finalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Subtotal:
                  </span>
                  <span
                    className={
                      isDarkMode
                        ? "text-gray-100 font-semibold"
                        : "text-gray-900 font-semibold"
                    }
                  >
                    ${lastInvoice.subtotal.toFixed(2)}
                  </span>
                </div>

                {lastInvoice.itemDiscounts > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Item Discounts:</span>
                    <span className="text-green-600 font-semibold">
                      -${lastInvoice.itemDiscounts.toFixed(2)}
                    </span>
                  </div>
                )}

                {lastInvoice.couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">
                      Coupon ({lastInvoice.appliedCoupon.code}):
                    </span>
                    <span className="text-green-600 font-semibold">
                      -${lastInvoice.couponDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {lastInvoice.membershipDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Membership Discount:</span>
                    <span className="text-green-600 font-semibold">
                      -${lastInvoice.membershipDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Tax (10%):
                  </span>
                  <span
                    className={
                      isDarkMode
                        ? "text-gray-100 font-semibold"
                        : "text-gray-900 font-semibold"
                    }
                  >
                    ${lastInvoice.tax.toFixed(2)}
                  </span>
                </div>

                <div
                  className={`flex justify-between pt-2 border-t-2 text-xl ${
                    isDarkMode ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <span
                    className={`font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Grand Total:
                  </span>
                  <span className="font-bold text-indigo-600">
                    ${lastInvoice.grandTotal.toFixed(2)}
                  </span>
                </div>

                {lastInvoice.paymentMethod === "cash" && (
                  <>
                    <div className="flex justify-between pt-2">
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        Paid:
                      </span>
                      <span
                        className={
                          isDarkMode
                            ? "text-gray-100 font-semibold"
                            : "text-gray-900 font-semibold"
                        }
                      >
                        ${lastInvoice.receivedAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        Change:
                      </span>
                      <span
                        className={
                          isDarkMode
                            ? "text-gray-100 font-semibold"
                            : "text-gray-900 font-semibold"
                        }
                      >
                        ${lastInvoice.changeAmount.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Payment Method:
                  </span>
                  <span
                    className={
                      isDarkMode
                        ? "text-gray-100 font-semibold"
                        : "text-gray-900 font-semibold"
                    }
                  >
                    {lastInvoice.paymentMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Points Earned */}
              {lastInvoice.earnedPoints > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎉</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Loyalty Points Earned!
                        </p>
                        <p className="text-sm text-gray-600">
                          You've earned {lastInvoice.earnedPoints} points from
                          this purchase
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">
                        +{lastInvoice.earnedPoints}
                      </p>
                      <p className="text-xs text-gray-500">Points</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Message */}
              <div
                className={`text-center p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Thank you for your purchase!
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Please keep this invoice for your records.
                </p>
                {lastInvoice.customer?.membershipType &&
                  lastInvoice.customer.membershipType !== "none" && (
                    <p className="text-xs text-purple-600 mt-2 font-semibold">
                      Keep shopping to earn more rewards! 🎁
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 print:hidden">
                <button
                  onClick={printInvoice}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-2 font-semibold"
                >
                  <MdPrint className="text-xl" />
                  Print
                </button>
                {selectedCustomer?.email && (
                  <button
                    onClick={emailInvoice}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center justify-center gap-2 font-semibold"
                  >
                    <MdEmail className="text-xl" />
                    Email
                  </button>
                )}
                <button
                  onClick={startNewSale}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center justify-center gap-2 font-semibold"
                >
                  <MdShoppingCart className="text-xl" />
                  New Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointOFSaleDetilasPage;
