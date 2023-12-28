import React, { useEffect, useMemo, useState } from 'react';
import Pagination from '../Components/Pagination/Pagination';

const ProductListingPage = () => {
      const [isDropdownVisible, setDropdownVisible] = useState(false);
      const [dropDownBtn, setDropDownBtn] = useState('Recommended');
      const [products, setProduct] = useState();
      const [currentPage, setCurrentPage] = useState(1);


      useEffect(() => {
            // Initial data fetch
            const fetchData = async () => {
                  try {
                        const response = await fetch('RandomData.json');
                        const data = await response.json();
                        setProduct(data);
                  } catch (error) {
                        console.error(error);
                  }
            };

            fetchData();
      }, []);


      const handleMouseEnter = () => {
            setDropdownVisible(true);
      };

      const handleMouseLeave = () => {
            setDropdownVisible(false);
      };

      // const setDefaultDropDownBtn = (btnText) => {
      //       setDropDownBtn(btnText);
      //       fetchData()
      // }

      const shortedPriceHighToLow = (btnText) => {
            const shortedPrice = [...products].sort((a, b) => a.currentPrice - b.currentPrice)
            setProduct(shortedPrice)
            setDropDownBtn(btnText)
      }
      const shortedPriceLowToHigh = (btnText) => {
            const shortedPrice = [...products].sort((a, b) => b.currentPrice - a.currentPrice)
            setProduct(shortedPrice)
            setDropDownBtn(btnText)
      }
      const shortedPriceAToZ = (btnText) => {
            const shortedPrice = [...products].sort((a, b) => a.productName.localeCompare(b.productName))
            setProduct(shortedPrice)
            setDropDownBtn(btnText)
      }
      const shortedPriceZToA = (btnText) => {
            const shortedPrice = [...products].sort((a, b) => b.productName.localeCompare(a.productName))
            setProduct(shortedPrice)
            setDropDownBtn(btnText)
      }

      const sortBetterDiscount = (btnText) => {
            const discountedProducts = products.slice().sort((a, b) => {
                  const discountA = (a.previousPrice - a.currentPrice) / a.previousPrice * 100;
                  const discountB = (b.previousPrice - b.currentPrice) / b.previousPrice * 100;

                  return discountB - discountA;
            })
            setProduct(discountedProducts)
            setDropDownBtn(btnText)
      }


      // pagination part 
      let pageSize = 1;

      const currentProductsData = useMemo(() => {
            const firstPageIndex = (currentPage - 1) * pageSize;
            const lastPageIndex = firstPageIndex + pageSize;
            return products?.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, pageSize, products])


      return (
            <>
                  <div className='w-full  flex items-center relative'>
                        <div className='h-full w-[20%] px-3'>
                              <h4 className='text-2xl font-semibold text-gray-800'>
                                    Filters
                              </h4>
                        </div>
                        <div className='h-full w-[80%] px-4 py-2  flex justify-between items-center'>
                              <div className='flex items-center gap-6 text-gray-500   font-light'>
                                    <span className='hover:text-gray-800 cursor-pointer' >Bundle</span>
                                    <span className='hover:text-gray-800 cursor-pointer' >Country OF Origin</span>
                                    <span className='hover:text-gray-800 cursor-pointer' >Sizes</span>
                              </div>
                              <div className="App relative z-50">
                                    <div className="App-header w-[280px]">
                                          <div
                                                className=""
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                          >
                                                <button className='w-full flex items-center gap-3' ><span>Sort By :</span><span>{dropDownBtn}</span></button>
                                                {/* <DropdownMenu /> */}
                                                {isDropdownVisible &&
                                                      <div className="dropdown-menu w-full  absolute top-12  duration-1000">
                                                            <ul>
                                                                  <li onClick={() => shortedPriceHighToLow('Price: Low To High')}>Price: Low To High</li>
                                                                  <li onClick={() => shortedPriceLowToHigh('Price: High To Low')}>Price: High To Low</li>
                                                                  <li onClick={() => shortedPriceAToZ('Name: A To Z')}>Name: A To Z</li>
                                                                  <li onClick={() => shortedPriceZToA('Name: Z To A')}>Name: Z To A</li>
                                                                  <li onClick={() => sortBetterDiscount('Better Discount')}>Better Discount</li>
                                                            </ul>
                                                      </div>
                                                }
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <div className='flex border-t-[1px] border-gray-200'>
                        <div className='border-r-[1px] border-gray-200 w-[20%] hidden lg:block   overflow-x-hidden'>

                        </div>
                        <div className='w-full lg:w-[80%]  p-5 flex flex-col justify-center items-start'>
                              <div className='grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-14 gap-y-12'>
                                    {
                                          currentProductsData?.map(elm => (
                                                <div key={elm.id} className='product-items-card  min-h-[400px] w-[230px] border border-gray-100 hover:shadow-2xl duration-300 rounded-md hover:rounded-xl overflow-hidden cursor-pointer'>
                                                      <div className='w-full h-[280px] overflow-hidden '>
                                                            <img className='w-full h-full' src={elm.imgUrl} alt="" />
                                                      </div>
                                                      <div className='flex flex-col  p-3'>
                                                            <h4>
                                                                  {elm.productName}
                                                            </h4>
                                                            <h6 className='mt-2 text-sm text-gray-400'>
                                                                  {elm.productType}
                                                            </h6>
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
                              <Pagination
                                    className='pagination-bar'
                                    currentPage={currentPage}
                                    totalCount={products?.length}
                                    pageSize={pageSize}
                                    onPageChange={page => setCurrentPage(page)}
                              />
                        </div>
                  </div>
            </>
      );
};

export default ProductListingPage;