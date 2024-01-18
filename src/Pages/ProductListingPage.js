import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Pagination from '../Components/Pagination/Pagination';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const ProductListingPage = () => {
      const [isDropdownVisible, setDropdownVisible] = useState(false);
      const [dropDownBtn, setDropDownBtn] = useState('Recommended');
      const [currentPage, setCurrentPage] = useState(1);
      const [productsBrandName, setProductsBrandName] = useState();
      const [state, setState] = useState({
            products: [],
            filters: new Set(),
      })
      console.log(state.products)
      useEffect(() => {
            // Initial product data fetch
            // const fetchData = async () => {
            //       try {
            //             const response = await axios.get('http://localhost:5000/data');

            //             setProductData(response.data);
            //             setState((prevState) => ({
            //                   ...prevState,
            //                   products: response.data,
            //             }))
            //       } catch (error) {
            //             console.error(error, 'error');
            //       }
            // };

            // Initial category data fetch
            const categoryData = async () => {
                  try {
                        const response = await fetch('category.json');
                        const data = await response.json();
                        setProductsBrandName(data.brands);
                  } catch (error) {
                        console.error(error);
                  }
            };

            categoryData()
      }, []);



      // const { data: allProducts, refetch } = useQuery({
      //       queryKey: ['products'],
      //       queryFn: async () => {
      //             const res = await axios.get('http://localhost:5000/data')
      //             return (
      //                   res.data
      //                   setState((prevState) => ({
      //                         ...prevState,
      //                         products: response.data,
      //                   }))
      //                   )
      //       }
      // });




      const { data: allProducts, refetch } = useQuery({
            queryKey: ['products'],
            queryFn: async () => {
                  try {
                        const res = await axios.get('http://localhost:5000/data');
                        const responseData = res.data;

                        // Additional logic after fetching the data
                        // For example, updating state
                        setState((prevState) => ({
                              ...prevState,
                              products: responseData,
                        }));

                        return responseData;
                  } catch (error) {
                        // Handle errors if necessary
                        console.error('Error fetching data:', error);
                        throw error;
                  }
            },
      });





      const setProductRecommended = (btnText) => {
            refetch()
            setDropDownBtn(btnText)
      }
      const shortedPriceHighToLow = (btnText) => {
            const shortedPrice = [...state.products].sort((a, b) => a.currentPrice - b.currentPrice)
            setState((prevState) => ({
                  ...prevState,
                  products: shortedPrice,
            }))
            setDropDownBtn(btnText)
      }
      const shortedPriceLowToHigh = (btnText) => {
            const shortedPrice = [...state.products].sort((a, b) => b.currentPrice - a.currentPrice)
            setState((prevState) => ({
                  ...prevState,
                  products: shortedPrice,
            }))
            setDropDownBtn(btnText)
      }
      const shortedPriceAToZ = (btnText) => {
            const shortedPrice = [...state.products].sort((a, b) => a.productName.localeCompare(b.productName))
            setState((prevState) => ({
                  ...prevState,
                  products: shortedPrice,
            }))
            setDropDownBtn(btnText)
      }
      const shortedPriceZToA = (btnText) => {
            const shortedPrice = [...state.products].sort((a, b) => b.productName.localeCompare(a.productName))
            setState((prevState) => ({
                  ...prevState,
                  products: shortedPrice,
            }))
            setDropDownBtn(btnText)
      }

      const sortBetterDiscount = (btnText) => {
            const discountedProducts = state.products.slice().sort((a, b) => {
                  const discountA = (a.previousPrice - a.currentPrice) / a.previousPrice * 100;
                  const discountB = (b.previousPrice - b.currentPrice) / b.previousPrice * 100;

                  return discountB - discountA;
            })
            setState((prevState) => ({
                  ...prevState,
                  products: discountedProducts,
            }))
            setDropDownBtn(btnText)
      }


      // pagination part 
      let pageSize = 10;

      const currentProductsData = useMemo(() => {
            const firstPageIndex = (currentPage - 1) * pageSize;
            const lastPageIndex = firstPageIndex + pageSize;
            return state.products?.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, pageSize, state.products])

      console.log(currentProductsData)

      const handleFilterChange = useCallback(event => {
            setState(previousState => {
                  let filters = new Set(previousState.filters)
                  let products = allProducts

                  if (event.target.checked) {
                        filters.add(event.target.value)
                  } else {
                        filters.delete(event.target.value)
                  }

                  if (filters.size) {
                        products = products.filter(product => {
                              return filters.has(product.brandName)
                        })
                  }

                  return {
                        filters,
                        products,
                  }
            })
      }, [setState, allProducts])


      return (
            <>
                  <div className='w-full  flex items-center relative'>
                        <div className='h-full w-[20%] px-3'>
                              <h4 className='text-2xl font-semibold text-gray-800'>
                                    Filters
                              </h4>
                        </div>
                        <div className='h-full w-[80%] px-4 py-2  flex justify-between items-center'>
                              <div className='hidden lg:flex items-center gap-6 text-gray-500   font-light '>
                                    <span className='hover:text-gray-800 cursor-pointer' >Bundle</span>
                                    <span className='hover:text-gray-800 cursor-pointer' >Country OF Origin</span>
                                    <span className='hover:text-gray-800 cursor-pointer' >Sizes</span>
                              </div>
                              <div className="App relative z-50">
                                    {/* <div className="App-header w-[300px] ">
                                          <div
                                                className=""
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                          >
                                                <button className='w-full flex items-center gap-3' ><span>Sort By :</span><span>{dropDownBtn}</span></button>
                                                
                                                {isDropdownVisible &&
                                                      <div className={`dropdown-menu w-full  absolute top-12  duration-1000 ${isDropdownVisible ? 'opacity-100' : 'opacity-0 '} `}>
                                                            <ul>
                                                                  <li onClick={(e) => shortedPriceHighToLow(e.target.textContent)}>Price: Low To High</li>
                                                                  <li onClick={(e) => shortedPriceLowToHigh(e.target.textContent)}>Price: High To Low</li>
                                                                  <li onClick={(e) => shortedPriceAToZ(e.target.textContent)}>Name: A To Z</li>
                                                                  <li onClick={(e) => shortedPriceZToA(e.target.textContent)}>Name: Z To A</li>
                                                                  <li onClick={(e) => sortBetterDiscount(e.target.textContent)}>Better Discount</li>
                                                            </ul>
                                                      </div>
                                                }
                                          </div>
                                    </div> */}
                                    <li class="dropdown dropdown-4 w-[280px]">
                                          <span>Sort By :</span><span>{dropDownBtn}</span>
                                          <ul class="dropdown_menu dropdown_menu-4">
                                                <li className="dropdown_item-1" onClick={(e) => setProductRecommended(e.target.textContent)}>Recommended</li>
                                                <li className="dropdown_item-1" onClick={(e) => shortedPriceHighToLow(e.target.textContent)}>Price: Low To High</li>
                                                <li className="dropdown_item-2" onClick={(e) => shortedPriceLowToHigh(e.target.textContent)}>Price: High To Low</li>
                                                <li className="dropdown_item-3" onClick={(e) => shortedPriceAToZ(e.target.textContent)}>Name: A To Z</li>
                                                <li className="dropdown_item-4" onClick={(e) => shortedPriceZToA(e.target.textContent)}>Name: Z To A</li>
                                                <li className="dropdown_item-5" onClick={(e) => sortBetterDiscount(e.target.textContent)}>Better Discount</li>
                                          </ul>
                                    </li>
                              </div>
                        </div>
                  </div>
                  <div className='flex border-t-[1px] border-gray-200'>
                        <div className='border-r-[1px] border-gray-200 w-[20%] hidden    overflow-x-hidden lg:flex flex-col gap-1 ms-8 '>
                              <h3 className='text-xl font-medium'>
                                    Brands
                              </h3>
                              {
                                    productsBrandName?.map((brand, idx) => (
                                          <div key={idx} className=' flex items-center gap-2  text-lg text-gray-500 hover:text-gray-900 duration-0 cursor-pointer'>
                                                <label className='cursor-pointer' htmlFor={brand} /* onChange={(e) => test(e)} */  >
                                                      <input className='cursor-pointer' type="checkbox" name={brand} value={brand} id={brand} onChange={handleFilterChange} />
                                                      {brand}</label>
                                          </div>
                                    ))
                              }
                        </div>
                        <div className='w-full lg:w-[80%]  p-5 flex flex-col justify-center items-center'>
                              <div className='grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-14 lg:gap-y-12'>
                                    {
                                          currentProductsData?.map(elm => (
                                                <div key={elm.id} className='product-items-card  min-h-[400px] w-full lg:w-[230px] border border-gray-100 hover:shadow-2xl duration-300 rounded-md hover:rounded-xl overflow-hidden cursor-pointer'>
                                                      <div className='w-full h-[280px] overflow-hidden '>
                                                            <img className='w-full h-full' src={elm.imgUrl} alt="" />
                                                      </div>
                                                      <div className='flex flex-col  p-3'>
                                                            <h4>
                                                                  {elm.productName}
                                                            </h4>
                                                            <div className="flex gap-4 ">
                                                                  <h6 className='mt-2 text-sm text-gray-400'>
                                                                        {elm.productType}
                                                                  </h6>
                                                                  <h6 className='mt-2 text-sm text-gray-800'>
                                                                        {elm.brandName}
                                                                  </h6>
                                                            </div>
                                                            <div className='flex items-center mt-4 gap-3 text-sm'>
                                                                  <p className='font-medium'>
                                                                        Rs:{elm.currentPrice}
                                                                  </p>
                                                                  <p className='text-gray-400'>
                                                                        <strike>
                                                                              Rs:{elm.previousPrice}
                                                                        </strike>
                                                                  </p>
                                                                  {
                                                                        (
                                                                              () => {
                                                                                    const discountPrice = elm.previousPrice - elm.currentPrice;
                                                                                    const discountPresentence = (discountPrice / elm.previousPrice) * 100;
                                                                                    return (
                                                                                          <p className='text-xs font-light text-[#cd6272]'>
                                                                                                ({discountPresentence.toFixed()}% OFF)
                                                                                          </p>
                                                                                    );
                                                                              }
                                                                        )()
                                                                  }
                                                            </div>
                                                      </div>
                                                </div>
                                          ))
                                    }
                              </div>
                              {
                                    state?.products?.length > pageSize &&
                                    <Pagination
                                          className='pagination-bar'
                                          currentPage={currentPage}
                                          totalCount={allProducts?.length}
                                          pageSize={pageSize}
                                          onPageChange={page => setCurrentPage(page)}
                                    />}
                        </div>
                  </div>
            </>
      );
};

export default ProductListingPage;