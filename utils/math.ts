export function haversineDistance(
  lat1: number | null | undefined,
  lon1: number | null | undefined,
  lat2: number,
  lon2: number,
): number {
  if (
    lat1 === null ||
    lat1 === undefined ||
    lon1 === null ||
    lon1 === undefined
  ) {
    return 0;
  }
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
