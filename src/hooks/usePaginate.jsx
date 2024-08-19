import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useDataPaginate = (ApiEndpoint, dataLimit, nameSearch='') => {
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${ApiEndpoint}?name=${nameSearch}&page=${currentPage}&per_page=${dataLimit}`
      );
      setData(response.data.data);
      setTotalPage(response.data.total_pages)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [ApiEndpoint, currentPage, dataLimit]);

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
