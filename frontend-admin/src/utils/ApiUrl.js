// export const API_URL = 'http://localhost:4000/api';
// export const API_URL = "http://192.168.0.148:4000/api";
// export const API_URL = 'https://ec19f0a2a1000bcc066e0def301792c6.serveo.net/api';
// export const Image_URL = "http://192.168.0.159:4000";
// export const Image_URL = 'http://localhost:4000';
// Keep API calls on the same LAN host when the admin is opened from a phone.
const apiOrigin = `${window.location.protocol}//${window.location.hostname}:4000`;

export const API_URL = `${apiOrigin}/api`;
export const Image_URL = apiOrigin;
// export const API_URL = 'https://qa.kheloindore.in/api';
// export const Image_URL = 'https://qa.kheloindore.in';
