import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useDataPaginate = (ApiEndpoint, dataType, limit, name, search) => {
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  let apiParams = dataType == 'product' ? `name=${name}&category=${search}` : `name=${name}&location=${search}`
  apiParams = `${apiParams}&page=${currentPage}&per_page=${limit}`

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get(
        `${ApiEndpoint}?${apiParams}`
      );
      setData(response.data.data);
      setTotalPage(response.data.total_pages)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [ApiEndpoint, currentPage, limit, name, search]);

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
