export const getMediaUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return "";
  }

  const path = imagePath.trim();

  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${backendUrl}${cleanPath}`;
};

export default getMediaUrl;
