import { useState, useEffect } from "react";

const useCartFetch = (initialCart, token) => {
  const [cartProducts, setCartProducts] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token || !initialCart || Object.keys(initialCart).length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const cartQuery = JSON.stringify(initialCart);
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/product/cart?carts=${encodeURIComponent(cartQuery)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        setCartProducts(data.product_on_cart);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [token]);

  return { cartProducts, setCartProducts, error, isLoading };
};

export default useCartFetch;
