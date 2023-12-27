import { useMemo } from "react"


export const Dots = '....';

const range = (start, end) => {
      let length = end - start + 1;
      /*
            Create an array of certain length and set the elements within it from
            start value to end value.
      */
      return Array.from({ length }, (_, idx) => idx + start);
}


export const usePagination = ({
      totalCount,
      pageSize,
      siblingCount = 1,
      currentPage,
}) => {
      const paginationRange = useMemo(() => {
            // logic implements here
            const totalPageCount = Math.ceil(totalCount / pageSize);

            // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
            const totalPageNumbers = siblingCount + 5;

            /*
                  Case 1:
                        If the number of pages is less than the page numbers we want to show in our
                        paginationComponent, we return the range [1..totalPageCount]
            */

            if (totalPageNumbers >= totalPageCount) {
                  return range(1, totalPageCount);
            }

            /* 
                  Calculate left & right sibling index and make sure they are with range 1 and totalPageCount
            */





      }, [totalCount, pageSize, siblingCount, currentPage]);
      return paginationRange;
};