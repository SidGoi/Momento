export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const {
    width = 600,
    quality = "auto",
    format = "auto",
  } = options;

  return url.replace(
    "/upload/",
    `/upload/f_${format},q_${quality},w_${width},dpr_auto/`
  );
}
