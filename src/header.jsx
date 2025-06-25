/**
 * @param {{ 
*   cartItemsCount: number, 
*   onCartClick: () => void, 
*   onMenuClick: () => void 
* }} props
*/
export function Header({ cartItemsCount, onCartClick, onMenuClick }) {
 return (
   <header className="bg-white shadow-sm border-b">
     <div className="container mx-auto px-4">
       <div className="flex items-center justify-between h-16">
         {/* Logo + Menu */}
         <div className="flex items-center space-x-4">
           <button
             onClick={onMenuClick}
             className="lg:hidden p-2 rounded hover:bg-gray-100"
             aria-label="Open menu"
           >
             {/* Hamburger Menu Icon */}
             <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>

           <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-sm">PS</span>
             </div>
             <h1 className="text-xl font-bold text-gray-900">ProductStore</h1>
           </div>
         </div>

         {/* Navigation */}
         <nav className="hidden md:flex items-center space-x-8">
           <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
             Home
           </a>
           <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
             Products
           </a>
           <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
             Categories
           </a>
           <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
             About
           </a>
         </nav>

         {/* Cart Button */}
         <button
           onClick={onCartClick}
           className="relative px-3 py-2 border rounded text-sm flex items-center hover:bg-gray-50"
         >
           {/* Shopping Cart Icon */}
           <svg className="h-4 w-4 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5m12-5l2 5M9 21h.01M15 21h.01" />
           </svg>
           Cart
           {cartItemsCount > 0 && (
             <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
               {cartItemsCount}
             </span>
           )}
         </button>
       </div>
     </div>
   </header>
 )
}
