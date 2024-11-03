import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finance Manager",
    short_name: "Finance Manager",
    description: "Manage Your Income, Expenses and Savings",
    start_url: "/",
    display: "standalone",
    background_color: "#225bac",
    theme_color: "#ab2261",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
