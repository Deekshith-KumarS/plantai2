import {
  createContext,
  useEffect,
  useState,
} from "react";

export const RecentContext =
  createContext();

export const RecentProvider = ({
  children,
}) => {

  const [recentPlants,
    setRecentPlants] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "recentPlants"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  useEffect(() => {

    localStorage.setItem(
      "recentPlants",
      JSON.stringify(
        recentPlants
      )
    );

  }, [recentPlants]);

  const addRecentPlant = (
    plant
  ) => {

    const filtered =
      recentPlants.filter(
        (item) =>
          item.id !== plant.id
      );

    setRecentPlants([
      plant,
      ...filtered,
    ].slice(0, 6));
  };

  return (
    <RecentContext.Provider
      value={{
        recentPlants,
        addRecentPlant,
      }}
    >
      {children}
    </RecentContext.Provider>
  );
};