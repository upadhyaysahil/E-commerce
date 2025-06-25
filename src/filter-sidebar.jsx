import { useState, useEffect } from "react"

/**
 * @param {{
 *   categories: string[],
 *   filters: { category: string, priceRange: [number, number] },
 *   onFiltersChange: (filters: { category: string, priceRange: [number, number] }) => void,
 *   products: Array<{ price: number }>,
 *   isOpen: boolean,
 *   onClose: () => void
 * }} props
 */
export function FilterSidebar({ categories, filters, onFiltersChange, products, isOpen, onClose }) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [priceRange, setPriceRange] = useState([0, 1000])

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price)
      const minPrice = Math.floor(Math.min(...prices))
      const maxPrice = Math.ceil(Math.max(...prices))
      setPriceRange([minPrice, maxPrice])

      if (filters.priceRange[1] === 1000) {
        setLocalFilters((prev) => ({
          ...prev,
          priceRange: [minPrice, maxPrice],
        }))
      }
    }
  }, [products, filters.priceRange])

  const handleCategoryChange = (category) => {
    const newFilters = {
      ...localFilters,
      category: localFilters.category === category ? "" : category,
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceRangeChange = (event, index) => {
    const value = Number(event.target.value)
    const updated = [...localFilters.priceRange]
    updated[index] = value
    const newFilters = {
      ...localFilters,
      priceRange: updated,
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      priceRange: [priceRange[0], priceRange[1]],
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div>
        <label className="block font-medium text-base mb-2">Categories</label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.category === category}
                onChange={() => handleCategoryChange(category)}
              />
              <span className="text-sm capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block font-medium text-base mb-2">
          Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={priceRange[0]}
            max={priceRange[1]}
            step={1}
            value={localFilters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange(e, 0)}
            className="w-full"
          />
          <input
            type="range"
            min={priceRange[0]}
            max={priceRange[1]}
            step={1}
            value={localFilters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange(e, 1)}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  )

  // Mobile Sidebar Overlay
  if (isOpen) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose}></div>
        <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-black text-lg"
              >
                ×
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <div className="hidden lg:block w-80 bg-white rounded-lg shadow-sm border p-6 h-fit sticky top-8">
      {sidebarContent}
    </div>
  )
}
