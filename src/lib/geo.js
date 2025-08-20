// Haversine distance in meters between two [lat, lng] points
export function haversineDistanceMeters(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const aa = s1 * s1 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

export function isWithinRadius(point, center, radiusMeters) {
  return haversineDistanceMeters(point, center) <= radiusMeters;
}
