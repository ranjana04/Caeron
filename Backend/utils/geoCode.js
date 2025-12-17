import fetch from "node-fetch";

export async function geocodeAddress(address) {
  if (!address) throw new Error("Address is required");

  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "CaeronApp/1.0 (ranjana.dewangan@example.com)", // use real email
        "Accept-Language": "en-US"
      }
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return [0, 0]; // fallback coordinates without logging
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return [0, 0]; // fallback coordinates without logging
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    return [lng, lat];

  } catch (err) {
    return [0, 0]; // fallback coordinates without logging
  }
}
