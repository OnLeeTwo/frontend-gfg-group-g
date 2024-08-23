import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useDataPaginate = (ApiEndpoint, limit, name, button) => {
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isButton, setIsButton] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)

      setError(null)
      if(button) {
        setCurrentPage(1)
      }
     
      setIsButton(false)

    
      const response = await axios.get(
        `${ApiEndpoint}?name=${name}&page=${currentPage}&per_page=${limit}`
      );
      setData(response.data.data);
      setTotalPage(response.data.total_pages)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [ApiEndpoint, currentPage, limit, name, button]);

  useEffect(() => {
    fetchData();
  }, [currentPage, fetchData]);

  const nextPage = () => {
    setCurrentPage((previousPage) => previousPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previousPage) => previousPage - 1);
    }
  };

  return { prevPage, nextPage, data, currentPage, totalPage, error, isLoading };
};
