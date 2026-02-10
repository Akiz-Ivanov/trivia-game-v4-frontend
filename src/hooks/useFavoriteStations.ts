import { useCallback, useMemo } from "react"
import useLocalStorageState from "use-local-storage-state"
import type { Station } from "@/types/radio.types"

const useFavoriteStations = () => {
 
  const [favorites, setFavorites] = useLocalStorageState<Station[]>("radio-favorites", {
    defaultValue: []
  })

  const toggleFavorite = useCallback((station: Station) => {
    setFavorites(prev => {
      const exists = prev.find(s => s.stationuuid === station.stationuuid)
      return exists
        ? prev.filter(s => s.stationuuid !== station.stationuuid) // remove
        : [...prev, station]; // add
    });
  }, [setFavorites])

  const isFavorite = useCallback(
    (uuid: string) => favorites.some(s => s.stationuuid === uuid),
    [favorites]
  )

  const reorderFavorites = useCallback((newOrder: Station[]) => {
    setFavorites(newOrder)
  }, [setFavorites])

  const value = useMemo(() => ({
    favorites,
    toggleFavorite,
    isFavorite,
    reorderFavorites
  }), [favorites, toggleFavorite, isFavorite, reorderFavorites])

  return value
}

export default useFavoriteStations