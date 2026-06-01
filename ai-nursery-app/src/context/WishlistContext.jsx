import {
  createContext,
  useEffect,
  useState,
} from "react";

export const WishlistContext =
  createContext();

export const WishlistProvider = ({
  children,
}) => {

  const [wishlist,
    setWishlist] =
    useState(() => {

      const savedWishlist =
        localStorage.getItem(
          "wishlist"
        );

      return savedWishlist
        ? JSON.parse(
            savedWishlist
          )
        : [];
    });

  useEffect(() => {

    localStorage.setItem(
      "wishlist",
      JSON.stringify(
        wishlist
      )
    );

  }, [wishlist]);

  const addToWishlist = (
    plant
  ) => {

    const exists =
      wishlist.find(
        (item) =>
          item.id === plant.id
      );

    if (!exists) {

      setWishlist([
        ...wishlist,
        plant,
      ]);
    }
  };

  const removeFromWishlist =
    (id) => {

      setWishlist(
        wishlist.filter(
          (item) =>
            item.id !== id
        )
      );
    };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};