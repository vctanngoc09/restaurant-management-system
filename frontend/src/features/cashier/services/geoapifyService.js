const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v1";

const geocodeCache = new Map();

function getApiKey() {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Thiếu VITE_GEOAPIFY_API_KEY. Hãy thêm API key Geoapify vào file .env.",
    );
  }

  return apiKey;
}

async function fetchJson(url, signal) {
  const response = await fetch(url, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let message = `Geoapify API lỗi ${response.status}.`;

    try {
      const payload = await response.json();

      message = payload?.message || payload?.error || message;
    } catch {
      // Giữ message mặc định nếu response không phải JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

function normalizeLocation(result) {
  if (!result) {
    return null;
  }

  const lat = Number(result.lat);
  const lon = Number(result.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return {
    lat,
    lon,
    formatted:
      result.formatted ||
      [result.address_line1, result.address_line2].filter(Boolean).join(", ") ||
      result.name ||
      "Địa điểm",
    addressLine1: result.address_line1 || result.name || "",
    addressLine2: result.address_line2 || "",
    city: result.city || "",
    district: result.district || result.suburb || "",
    state: result.state || "",
    postcode: result.postcode || "",
    country: result.country || "",
    confidence: Number(result.rank?.confidence) || null,
  };
}

const geoapifyService = {
  // ==================================================
  // ADDRESS AUTOCOMPLETE
  // ==================================================

  async autocompleteAddress(
    text,
    {
      limit = 5,
      countryCode = "vn",
      language = "vi",
      bias = null,
      signal,
    } = {},
  ) {
    const query = text?.trim();

    if (!query) {
      return [];
    }

    const params = new URLSearchParams({
      text: query,
      format: "json",
      filter: `countrycode:${countryCode}`,
      lang: language,
      limit: String(limit),
      apiKey: getApiKey(),
    });

    if (
      bias &&
      Number.isFinite(Number(bias.lat)) &&
      Number.isFinite(Number(bias.lon))
    ) {
      params.set("bias", `proximity:${Number(bias.lon)},${Number(bias.lat)}`);
    }

    const data = await fetchJson(
      `${GEOAPIFY_BASE_URL}/geocode/autocomplete?${params.toString()}`,
      signal,
    );

    const results = Array.isArray(data?.results) ? data.results : [];

    return results.map(normalizeLocation).filter(Boolean);
  },

  // ==================================================
  // FORWARD GEOCODING
  //
  // Dùng cho địa chỉ cố định của nhà hàng.
  // Cache theo address để không gọi lại liên tục.
  // ==================================================

  async geocodeAddress(
    address,
    { countryCode = "vn", language = "vi", signal } = {},
  ) {
    const query = address?.trim();

    if (!query) {
      throw new Error("Địa chỉ nhà hàng đang trống.");
    }

    const cacheKey = `${countryCode}:${query.toLowerCase()}`;

    if (geocodeCache.has(cacheKey)) {
      return geocodeCache.get(cacheKey);
    }

    const params = new URLSearchParams({
      text: query,
      format: "json",
      filter: `countrycode:${countryCode}`,
      lang: language,
      limit: "1",
      apiKey: getApiKey(),
    });

    const data = await fetchJson(
      `${GEOAPIFY_BASE_URL}/geocode/search?${params.toString()}`,
      signal,
    );

    const result = normalizeLocation(data?.results?.[0]);

    if (!result) {
      throw new Error("Không xác định được vị trí từ địa chỉ nhà hàng.");
    }

    geocodeCache.set(cacheKey, result);

    return result;
  },

  // ==================================================
  // ROUTING
  //
  // mode=scooter phù hợp giao hàng bằng xe máy.
  // traffic=approximated giúp ETA thực tế hơn free-flow.
  // ==================================================

  async getRoute(
    origin,
    destination,
    { mode = "scooter", traffic = "approximated", signal } = {},
  ) {
    if (!origin || !destination) {
      throw new Error("Thiếu điểm bắt đầu hoặc điểm giao hàng.");
    }

    const waypoints = [
      `${Number(origin.lat)},${Number(origin.lon)}`,
      `${Number(destination.lat)},${Number(destination.lon)}`,
    ].join("|");

    const params = new URLSearchParams({
      waypoints,
      mode,
      traffic,
      type: "balanced",
      format: "geojson",
      apiKey: getApiKey(),
    });

    const data = await fetchJson(
      `${GEOAPIFY_BASE_URL}/routing?${params.toString()}`,
      signal,
    );

    const feature = data?.features?.[0];

    if (!feature) {
      throw new Error("Không tìm thấy tuyến đường phù hợp.");
    }

    const distanceMeters = Number(feature.properties?.distance);
    const timeSeconds = Number(feature.properties?.time);

    if (!Number.isFinite(distanceMeters) || !Number.isFinite(timeSeconds)) {
      throw new Error(
        "Geoapify không trả về khoảng cách hoặc thời gian hợp lệ.",
      );
    }

    return {
      geoJson: data,
      distanceMeters,
      timeSeconds,
    };
  },

  // ==================================================
  // MAP TILE URL
  // ==================================================

  getMapTileUrl() {
    return `https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${getApiKey()}`;
  },
};

export default geoapifyService;
