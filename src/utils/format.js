export const USD_TO_PKR = 280; // change this one number to change all prices
export const toPKR = (usd) => Math.round(usd * USD_TO_PKR);
export const formatPrice = (usd) => "Rs. " + toPKR(usd).toLocaleString("en-PK");
export const API_URL = "https://fakestoreapi.com";
export const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
