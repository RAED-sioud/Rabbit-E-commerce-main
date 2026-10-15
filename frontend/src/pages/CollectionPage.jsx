import React from 'react'
import { FaFilter } from 'react-icons/fa';
import FilterSideBar from '../components/Products/FilterSideBar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';


const CollectionPage = () => {

  const sidebarRef = React.useRef(null)
  const [isSidebarOpen , setIsSidebarOpen] = React.useState(false)
  const dispatch = useDispatch();
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const { products, loading, error } = useSelector((state) => state.products);
  
   
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  
  const handleClickOutside = (e) => {
    // Close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  }


  React.useEffect(() => {
    // Add Event Listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    // Clean Event Listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  React.useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    const collectionParam = collection?.toLowerCase();
    const genderFromCollection =
      collectionParam === 'men' ? 'Men' : collectionParam === 'women' ? 'Women' : '';

    dispatch(
      fetchProductsByFilters({
        collection: collectionParam && !['all', 'men', 'women'].includes(collectionParam) ? collectionParam : params.collection,
        size: params.size,
        color: params.color,
        gender: params.gender || genderFromCollection,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        sortBy: params.sortBy,
        search: params.search,
        category: params.category,
        material: params.material,
        brand: params.brand,
      })
    );
  }, [dispatch, collection, searchParams]);

  return (
    <div className='flex flex-col lg:flex-row '>
      {/* Mobile Filter button */}
      <button 
        onClick={toggleSidebar}
        className='flex items-center justify-center p-2 border lg:hidden'>
        <FaFilter className='mr-2 ' /> Filters
      </button>
      
      {/* Filter SideBar */}
      <div ref={sidebarRef} 
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50
        left-0 w-64 bg-white overflow-y-auto transition-transform duration-300
        lg:static lg:translate-x-0 `}
        >
        <FilterSideBar />
      </div> 
      <div className='flex-grow p-4'>
        <h2 className='text-2xl uppercase mb-4'>
          {searchParams.get('gender') || (collection === 'men' ? 'Men' : collection === 'women' ? 'Women' : 'All')} Collection
        </h2>

        {/* Sort Options */}
        <SortOptions />

        {/* Product Grid  */}
        {loading && <p className='text-gray-500'>Loading products...</p>}
        {error && <p className='text-red-500'>{error?.message || error}</p>}
        {!loading && !error && <ProductGrid products={products} />}
              
      </div> 
    </div>
  )
}

export default CollectionPage
