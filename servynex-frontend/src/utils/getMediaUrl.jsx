export const getMediaUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${backendUrl}${cleanPath}`;
};

export default getMediaUrl;
