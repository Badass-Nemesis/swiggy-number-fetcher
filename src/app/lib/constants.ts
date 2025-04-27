// NinjaOTP API constants
export const NINJAOTP_BASE_URL = "https://api.ninjaotp.com";
export const NINJAOTP_HANDLER_API_URL = `${NINJAOTP_BASE_URL}/stubs/handler_api.php`;

// PowerSMS API constants
export const POWERSMS_BASE_URL = "https://powersms.shop"
export const POWERSMS_HANDLER_API_URL = `${POWERSMS_BASE_URL}/stubs/handler_api.php`;

// Swiggy API constants
export const SWIGGY_BASE_URL = "https://www.swiggy.com";
export const SWIGGY_RESTAURANTS_URL = `${SWIGGY_BASE_URL}/restaurants`;
export const SWIGGY_SIGNIN_CHECK_URL = `${SWIGGY_BASE_URL}/dapi/auth/signin-with-check`;

export const PROXY_URL = process.env.PROXY_URL || "socks5://id:pass@ip:port";
export const RETRY_DELAY = 5000;