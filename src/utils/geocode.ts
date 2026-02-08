
// Zip code to coordinates mapping for Michigan (major cities/zips)
// This is a subset - in production you'd want a complete database
const MICHIGAN_ZIP_COORDS: Record<string, { lat: number; lng: number }> = {
  // Detroit area
  '48201': { lat: 42.3314, lng: -83.0458 },
  '48202': { lat: 42.3314, lng: -83.0458 },
  '48226': { lat: 42.3314, lng: -83.0458 },
  '48243': { lat: 42.3314, lng: -83.0458 },
  // Grand Rapids
  '49503': { lat: 42.9634, lng: -85.6681 },
  '49504': { lat: 42.9634, lng: -85.6681 },
  '49505': { lat: 42.9634, lng: -85.6681 },
  '49506': { lat: 42.9634, lng: -85.6681 },
  '49507': { lat: 42.9634, lng: -85.6681 },
  '49508': { lat: 42.9634, lng: -85.6681 },
  // Ann Arbor
  '48103': { lat: 42.2808, lng: -83.7430 },
  '48104': { lat: 42.2808, lng: -83.7430 },
  '48105': { lat: 42.2808, lng: -83.7430 },
  '48108': { lat: 42.2808, lng: -83.7430 },
  '48109': { lat: 42.2808, lng: -83.7430 },
  // Lansing
  '48910': { lat: 42.7325, lng: -84.5555 },
  '48911': { lat: 42.7325, lng: -84.5555 },
  '48912': { lat: 42.7325, lng: -84.5555 },
  '48915': { lat: 42.7325, lng: -84.5555 },
  '48917': { lat: 42.7325, lng: -84.5555 },
  '48933': { lat: 42.7325, lng: -84.5555 },
  // Flint
  '48502': { lat: 43.0125, lng: -83.6875 },
  '48503': { lat: 43.0125, lng: -83.6875 },
  '48504': { lat: 43.0125, lng: -83.6875 },
  '48505': { lat: 43.0125, lng: -83.6875 },
  '48506': { lat: 43.0125, lng: -83.6875 },
  '48507': { lat: 43.0125, lng: -83.6875 },
  // Kalamazoo
  '49001': { lat: 42.2917, lng: -85.5872 },
  '49004': { lat: 42.2917, lng: -85.5872 },
  '49006': { lat: 42.2917, lng: -85.5872 },
  '49007': { lat: 42.2917, lng: -85.5872 },
  '49008': { lat: 42.2917, lng: -85.5872 },
  '49009': { lat: 42.2917, lng: -85.5872 },
  // Traverse City
  '49684': { lat: 44.7631, lng: -85.6206 },
  '49685': { lat: 44.7631, lng: -85.6206 },
  '49686': { lat: 44.7631, lng: -85.6206 },
  // Muskegon
  '49440': { lat: 43.2342, lng: -86.2484 },
  '49441': { lat: 43.2342, lng: -86.2484 },
  '49442': { lat: 43.2342, lng: -86.2484 },
  '49444': { lat: 43.2342, lng: -86.2484 },
  '49445': { lat: 43.2342, lng: -86.2484 },
  // Jackson
  '49201': { lat: 42.2459, lng: -84.4014 },
  '49202': { lat: 42.2459, lng: -84.4014 },
  '49203': { lat: 42.2459, lng: -84.4014 },
  // Saginaw
  '48601': { lat: 43.4195, lng: -83.9508 },
  '48602': { lat: 43.4195, lng: -83.9508 },
  '48604': { lat: 43.4195, lng: -83.9508 },
  '48607': { lat: 43.4195, lng: -83.9508 },
  // Holland
  '49423': { lat: 42.7875, lng: -86.1089 },
  '49424': { lat: 42.7875, lng: -86.1089 },
  // East Lansing
  '48823': { lat: 42.7369, lng: -84.4839 },
  '48824': { lat: 42.7369, lng: -84.4839 },
  '48825': { lat: 42.7369, lng: -84.4839 },
  '48826': { lat: 42.7369, lng: -84.4839 },
  // Farmington Hills
  '48331': { lat: 42.4989, lng: -83.3677 },
  '48334': { lat: 42.4989, lng: -83.3677 },
  '48335': { lat: 42.4989, lng: -83.3677 },
  '48336': { lat: 42.4989, lng: -83.3677 },
  // Troy
  '48007': { lat: 42.6064, lng: -83.1498 },
  '48083': { lat: 42.6064, lng: -83.1498 },
  '48084': { lat: 42.6064, lng: -83.1498 },
  '48085': { lat: 42.6064, lng: -83.1498 },
  '48098': { lat: 42.6064, lng: -83.1498 },
  '48099': { lat: 42.6064, lng: -83.1498 },
  // Royal Oak
  '48067': { lat: 42.4895, lng: -83.1446 },
  '48068': { lat: 42.4895, lng: -83.1446 },
  '48073': { lat: 42.4895, lng: -83.1446 },
  // Southfield
  '48033': { lat: 42.4734, lng: -83.2219 },
  '48034': { lat: 42.4734, lng: -83.2219 },
  '48037': { lat: 42.4734, lng: -83.2219 },
  '48075': { lat: 42.4734, lng: -83.2219 },
  '48076': { lat: 42.4734, lng: -83.2219 },
  // Warren
  '48088': { lat: 42.5145, lng: -83.0147 },
  '48089': { lat: 42.5145, lng: -83.0147 },
  '48090': { lat: 42.5145, lng: -83.0147 },
  '48091': { lat: 42.5145, lng: -83.0147 },
  '48092': { lat: 42.5145, lng: -83.0147 },
  '48093': { lat: 42.5145, lng: -83.0147 },
  // Sterling Heights
  '48310': { lat: 42.5803, lng: -83.0302 },
  '48311': { lat: 42.5803, lng: -83.0302 },
  '48312': { lat: 42.5803, lng: -83.0302 },
  '48313': { lat: 42.5803, lng: -83.0302 },
  '48314': { lat: 42.5803, lng: -83.0302 },
  // Rochester Hills
  '48306': { lat: 42.6584, lng: -83.1499 },
  '48307': { lat: 42.6584, lng: -83.1499 },
  '48309': { lat: 42.6584, lng: -83.1499 },
  // Auburn Hills
  '48321': { lat: 42.6875, lng: -83.2341 },
  '48326': { lat: 42.6875, lng: -83.2341 },
  // Pontiac
  '48340': { lat: 42.6389, lng: -83.2911 },
  '48341': { lat: 42.6389, lng: -83.2911 },
  '48342': { lat: 42.6389, lng: -83.2911 },
  '48343': { lat: 42.6389, lng: -83.2911 },
  // Livonia
  '48150': { lat: 42.3684, lng: -83.3527 },
  '48151': { lat: 42.3684, lng: -83.3527 },
  '48152': { lat: 42.3684, lng: -83.3527 },
  '48153': { lat: 42.3684, lng: -83.3527 },
  '48154': { lat: 42.3684, lng: -83.3527 },
  // Dearborn
  '48120': { lat: 42.3223, lng: -83.1763 },
  '48121': { lat: 42.3223, lng: -83.1763 },
  '48123': { lat: 42.3223, lng: -83.1763 },
  '48124': { lat: 42.3223, lng: -83.1763 },
  '48126': { lat: 42.3223, lng: -83.1763 },
  '48128': { lat: 42.3223, lng: -83.1763 },
  // Canton
  '48187': { lat: 42.3078, lng: -83.4852 },
  '48188': { lat: 42.3078, lng: -83.4852 },
  // Westland
  '48185': { lat: 42.3242, lng: -83.4002 },
  '48186': { lat: 42.3242, lng: -83.4002 },
  // Taylor
  '48180': { lat: 42.2409, lng: -83.2697 },
  // Novi
  '48374': { lat: 42.4806, lng: -83.4755 },
  '48375': { lat: 42.4806, lng: -83.4755 },
  '48377': { lat: 42.4806, lng: -83.4755 },
  // Northville
  '48167': { lat: 42.4311, lng: -83.4830 },
  '48168': { lat: 42.4311, lng: -83.4830 },
  // Plymouth
  '48170': { lat: 42.3714, lng: -83.4702 },
  // Ypsilanti
  '48197': { lat: 42.2411, lng: -83.6129 },
  '48198': { lat: 42.2411, lng: -83.6129 },
  // Howell
  '48843': { lat: 42.6073, lng: -83.9294 },
  '48844': { lat: 42.6073, lng: -83.9294 },
  // Brighton
  '48114': { lat: 42.5295, lng: -83.7802 },
  '48116': { lat: 42.5295, lng: -83.7802 },
  // Milford
  '48380': { lat: 42.5939, lng: -83.5994 },
  '48381': { lat: 42.5939, lng: -83.5994 },
  // Highland
  '48356': { lat: 42.6547, lng: -83.6200 },
  '48357': { lat: 42.6547, lng: -83.6200 },
  // White Lake
  '48383': { lat: 42.6600, lng: -83.5400 },
  '48386': { lat: 42.6600, lng: -83.5400 },
  // Commerce Township
  '48382': { lat: 42.5911, lng: -83.4894 },
  '48390': { lat: 42.5911, lng: -83.4894 },
  // Walled Lake
  '48391': { lat: 42.5378, lng: -83.4811 },
  // Wixom
  '48393': { lat: 42.5248, lng: -83.5363 },
  // Oxford
  '48371': { lat: 42.8239, lng: -83.2647 },
  // Clarkston
  '48346': { lat: 42.7359, lng: -83.4188 },
  '48347': { lat: 42.7359, lng: -83.4188 },
  '48348': { lat: 42.7359, lng: -83.4188 },
  // Lake Orion
  '48359': { lat: 42.7845, lng: -83.2397 },
  '48362': { lat: 42.7845, lng: -83.2397 },
  // Romeo
  '48065': { lat: 42.8023, lng: -83.0129 },
  // Almont
  '48003': { lat: 42.9209, lng: -83.0459 },
  // Imlay City
  '48444': { lat: 43.0247, lng: -83.0777 },
  // Lapeer
  '48446': { lat: 43.0514, lng: -83.3188 },
  // Davison
  '48423': { lat: 43.0347, lng: -83.5188 },
  // Burton
  '48509': { lat: 42.9998, lng: -83.6163 },
  '48519': { lat: 42.9998, lng: -83.6163 },
  '48529': { lat: 42.9998, lng: -83.6163 },
  // Grand Blanc
  '48439': { lat: 42.9275, lng: -83.6300 },
  // Fenton
  '48430': { lat: 42.7978, lng: -83.7049 },
  // Linden
  '48451': { lat: 42.8145, lng: -83.7825 },
  // Swartz Creek
  '48473': { lat: 42.9572, lng: -83.8300 },
  // Mount Pleasant
  '48858': { lat: 43.5978, lng: -84.7675 },
  '48859': { lat: 43.5978, lng: -84.7675 },
  // Midland
  '48640': { lat: 43.6156, lng: -84.2472 },
  '48641': { lat: 43.6156, lng: -84.2472 },
  '48642': { lat: 43.6156, lng: -84.2472 },
  '48667': { lat: 43.6156, lng: -84.2472 },
  '48670': { lat: 43.6156, lng: -84.2472 },
  // Bay City
  '48706': { lat: 43.5945, lng: -83.8889 },
  '48707': { lat: 43.5945, lng: -83.8889 },
  '48708': { lat: 43.5945, lng: -83.8889 },
  // Port Huron
  '48060': { lat: 42.9709, lng: -82.4249 },
  // Marquette
  '49855': { lat: 46.5436, lng: -87.3954 },
  // Sault Ste. Marie
  '49783': { lat: 46.4953, lng: -84.3453 },
  // Petoskey
  '49770': { lat: 45.3733, lng: -84.9553 },
  // Cheboygan
  '49721': { lat: 45.6469, lng: -84.4745 },
  // Alpena
  '49707': { lat: 45.0617, lng: -83.4328 },
  // Gaylord
  '49734': { lat: 45.0275, lng: -84.6748 },
  // Cadillac
  '49601': { lat: 44.2519, lng: -85.3980 },
  // Big Rapids
  '49307': { lat: 43.6981, lng: -85.4837 },
  // Alma
  '48801': { lat: 43.3789, lng: -84.6597 },
  // St. Johns
  '48879': { lat: 43.0011, lng: -84.5595 },
  // Owosso
  '48867': { lat: 42.9978, lng: -84.1766 },
  // Corunna
  '48817': { lat: 42.9819, lng: -84.1175 },
  // Durand
  '48429': { lat: 42.9111, lng: -83.9847 },
  // Byron
  '48418': { lat: 42.8233, lng: -83.9481 },
  // Gaines
  '48436': { lat: 42.8731, lng: -83.8925 },
  // Bancroft
  '48414': { lat: 42.8789, lng: -84.0667 },
  // Vernon
  '48476': { lat: 42.9400, lng: -84.0317 },
  // Henderson
  '48841': { lat: 42.9894, lng: -84.1950 },
  // Oakley
  '48649': { lat: 43.0508, lng: -84.1692 },
  // Chesaning
  '48616': { lat: 43.1847, lng: -84.1149 },
  // St. Charles
  '48855': { lat: 43.3006, lng: -84.1375 },
  // Brant
  '48614': { lat: 43.2583, lng: -84.2283 },
  // Atlas
  '48411': { lat: 42.9442, lng: -83.5392 },
  // Goodrich
  '48438': { lat: 42.9169, lng: -83.5064 },
  // Ortonville
  '48462': { lat: 42.8523, lng: -83.4430 },
  // Metamora
  '48455': { lat: 42.9484, lng: -83.2897 },
  // Columbiaville
  '48421': { lat: 43.1584, lng: -83.3864 },
  // Otter Lake
  '48464': { lat: 43.2106, lng: -83.4525 },
  // Millington
  '48746': { lat: 43.2811, lng: -83.5286 },
  // Reese
  '48757': { lat: 43.4517, lng: -83.6875 },
  // Vassar
  '48768': { lat: 43.3719, lng: -83.5831 },
  // Frankenmuth
  '48734': { lat: 43.3317, lng: -83.7381 },
  // Birch Run
  '48415': { lat: 43.2508, lng: -83.7911 },
  // Clio
  '48420': { lat: 43.1775, lng: -83.7342 },
  // Montrose
  '48457': { lat: 43.1767, lng: -83.8928 },
  // Flushing
  '48433': { lat: 43.0631, lng: -83.8511 },
  // New Lothrop
  '48460': { lat: 43.1175, lng: -83.9747 },
  // Lennon
  '48449': { lat: 43.1319, lng: -83.8850 },
  // Holly
  '48442': { lat: 42.7919, lng: -83.6277 },
  // Bloomfield Hills
  '48301': { lat: 42.5836, lng: -83.2455 },
  '48302': { lat: 42.5836, lng: -83.2455 },
  '48304': { lat: 42.5836, lng: -83.2455 },
  // Birmingham
  '48009': { lat: 42.5467, lng: -83.2117 },
  // Beverly Hills
  '48025': { lat: 42.5239, lng: -83.2239 },
  // Franklin / Bingham Farms
  '48036': { lat: 42.5223, lng: -83.3069 },
  // Lathrup Village
  '48385': { lat: 42.4931, lng: -83.2217 },
  // Oak Park
  '48237': { lat: 42.4595, lng: -83.1827 },
  // Pleasant Ridge
  '48069': { lat: 42.4711, lng: -83.1425 },
  // Huntington Woods
  '48070': { lat: 42.4806, lng: -83.1675 },
  // Berkley
  '48072': { lat: 42.5031, lng: -83.1836 },
  // Clawson
  '48017': { lat: 42.5334, lng: -83.1463 },
  // Madison Heights
  '48071': { lat: 42.4864, lng: -83.1046 },
  // Hazel Park
  '48030': { lat: 42.4625, lng: -83.1042 },
  // Ferndale
  '48220': { lat: 42.4606, lng: -83.1346 },
  // Center Line
  '48015': { lat: 42.4850, lng: -83.0274 },
  // Eastpointe
  '48021': { lat: 42.4684, lng: -82.9555 },
  // Roseville
  '48066': { lat: 42.4973, lng: -82.9372 },
  // Fraser
  '48026': { lat: 42.5392, lng: -82.9494 },
  // Clinton Township
  '48035': { lat: 42.5869, lng: -82.9195 },
  '48038': { lat: 42.5869, lng: -82.9195 },
  // Harrison Township
  '48045': { lat: 42.5958, lng: -82.8265 },
  // Chesterfield
  '48047': { lat: 42.6792, lng: -82.8071 },
  // New Baltimore
  '48467': { lat: 42.6811, lng: -82.7368 },
  // Mount Clemens
  '48043': { lat: 42.5973, lng: -82.8780 },
  // Utica
  '48315': { lat: 42.6261, lng: -83.0335 },
  '48316': { lat: 42.6261, lng: -83.0335 },
  '48317': { lat: 42.6261, lng: -83.0335 },
  '48318': { lat: 42.6261, lng: -83.0335 },

  // Macomb
  '48042': { lat: 42.6667, lng: -82.9167 },
  '48044': { lat: 42.6667, lng: -82.9167 },
  // Washington Township
  '48094': { lat: 42.7245, lng: -83.0336 },
  '48095': { lat: 42.7245, lng: -83.0336 },
};

// Haversine formula to calculate distance between two points in miles
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get coordinates from zip code
export function getCoordinatesFromZip(zip: string): { lat: number; lng: number } | null {
  const normalizedZip = zip.trim();
  return MICHIGAN_ZIP_COORDS[normalizedZip] || null;
}

// Check if a location search should use radius-based filtering
export function isZipCode(query: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(query.trim());
}

// Filter practices within radius (100 miles)
export function filterByRadius(
  practices: { lat?: number; lng?: number; zip: string; city: string; state: string }[],
  userLat: number,
  userLng: number,
  radiusMiles: number = 100
) {
  return practices.filter((practice) => {
    if (practice.lat && practice.lng) {
      const distance = calculateDistance(userLat, userLng, practice.lat, practice.lng);
      return distance <= radiusMiles;
    }
    // Fallback: if practice doesn't have coordinates, check if zip matches
    return false;
  });
}

// Geocode a zip code using a simple lookup (expandable to use API)
export async function geocodeZipCode(zip: string): Promise<{ lat: number; lng: number } | null> {
  // First try local lookup
  const localResult = getCoordinatesFromZip(zip);
  if (localResult) {
    return localResult;
  }

  // Optionally use external API (OpenStreetMap Nominatim)
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=USA&format=json&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }

  return null;
}
