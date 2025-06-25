import { useState, useEffect } from "react";

const PRODUCTS_PER_PAGE = 8;

export function ProductShowcase() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
  });
  const [sortBy, setSortBy] = useState("name-asc");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("https://fakestoreapi.com/products"),
          fetch("https://fakestoreapi.com/products/categories"),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">Product Showcase</h1>
        <button
          className="relative px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowCart(true)}
        >
          Cart ({cartItemsCount})
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 border p-4 rounded">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={() =>
                setFilters({ category: "", priceRange: [0, 1000] })
              }
              className="text-sm text-blue-500 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-2">Categories</h4>
            <ul className="space-y-1 text-sm">
              {categories.map((cat) => (
                <li key={cat} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.category === cat}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: prev.category === cat ? "" : cat,
                      }))
                    }
                  />
                  <label className="capitalize">{cat}</label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </h4>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [0, parseInt(e.target.value)],
                }))
              }
              className="w-full"
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} -{" "}
              {Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)}{" "}
              of {filteredProducts.length} products
            </p>
            <div>
              <label htmlFor="sort" className="mr-2 text-sm font-medium">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="rating-desc">Rating (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id);
              const quantity = cartItem?.quantity || 0;

              return (
                <div
                  key={product.id}
                  className="border p-4 rounded shadow-sm flex flex-col"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-contain mb-2"
                  />
                  <h2 className="text-lg font-medium line-clamp-2">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    ${product.price}
                  </p>
                  <p className="text-sm text-yellow-600 flex items-center gap-1 mb-2">
                    ⭐ {product.rating.rate}
                    <span className="text-gray-500">
                      ({product.rating.count})
                    </span>
                  </p>
                  <div className="mt-auto">
                    {quantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCartQuantity(product.id, quantity - 1)
                          }
                          className="w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          −
                        </button>
                        <span className="text-sm w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4">
              Shopping Cart ({cartItemsCount}{" "}
              {cartItemsCount === 1 ? "item" : "items"})
            </h2>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 border rounded-lg p-3"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-contain"
                        />
                        <div>
                          <h3 className="font-semibold text-sm">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category}
                          </p>
                          <p className="font-bold text-sm mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 border rounded hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => updateCartQuantity(item.id, 0)}
                          className="text-red-500 hover:text-red-600"
                        >
                          🗑️
                        </button>
                        <div className="font-semibold ml-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-4 flex justify-between items-center">
                  <div className="text-xl font-bold">
                    Total:{" "}
                    <span className="text-blue-600">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setShowCart(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Continue Shopping
                  </button>
                  <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-900">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => setShowCart(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
