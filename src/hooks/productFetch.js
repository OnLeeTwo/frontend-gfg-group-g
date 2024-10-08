import { useState, useEffect } from "react";
import axios from "axios";

const useFetchProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
        );
        if (response.data.success && response.data.data.length > 0) {
          setProduct(response.data.data[0]);
        } else {
          setProduct(null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  return { product, error, isLoading };
};

export default useFetchProduct;
