// export const API_URL = "http://localhost:4000/api";
// export const API_URL = "https://ec19f0a2a1000bcc066e0def301792c6.serveo.net/api";
// export const API_URL = "http://192.168.0.148:4000/api";
// export const API_URL ="https://api-kheloindore.swapinfotech.com/api/v1/kheloindore";

// export const IMG_URL = 'http://localhost:4000';
// export const IMG_URL = 'https://ec19f0a2a1000bcc066e0def301792c6.serveo.net';
// export const IMG_URL = 'http://192.168.0.145:4000';
// export const IMG_URL = "https://api-kheloindore.swapinfotech.com";

// Use the hostname currently open in the browser. This lets the same dev
// server work from a phone on the local network as well as from localhost.
const apiOrigin = `${window.location.protocol}//${window.location.hostname}:4000`;

export const API_URL = `${apiOrigin}/api`;
export const IMG_URL = apiOrigin;
// export const IMG_URL = "https://qa.kheloindore.in";
// export const API_URL = "https://qa.kheloindore.in/api";

// Google Maps browser key (client-side key, restricted by HTTP referrer in
// the Google Cloud console). Kept in one place so it can be rotated easily.
export const GOOGLE_MAPS_KEY = "AIzaSyCj51aGIAt-Yue3rjWoYz1FZYq8wB6jCIY";
