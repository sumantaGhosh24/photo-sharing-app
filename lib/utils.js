import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function validFiles(file) {
  const imgTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!file.type.startsWith("image")) {
    return {
      status: "error",
      message: "Invalid image.",
      title: file.name,
      imgUrl: "https://placehold.co/600x400.png",
    };
  }
  if (!imgTypes.includes(file.type)) {
    return {
      status: "error",
      message: "Invalid image format (required type jpeg, jpg and png).",
      title: file.name,
      imgUrl: URL.createObjectURL(file),
    };
  }
  if (file.size > 1024 * 1024) {
    return {
      status: "error",
      message: "Image is too large (required size 1mb).",
      title: file.name,
      imgUrl: URL.createObjectURL(file),
    };
  }
  return {
    status: "success",
    title: file.name.replace(/.(jpeg|jpg|png)$/gi, ""),
    tags: ["nature"],
    public: false,
    imgUrl: URL.createObjectURL(file),
    fileUpload: file,
  };
}

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://localhost:3000";

export async function dynamicBlurDataUrl(url) {
  const base64str = await fetch(
    `${baseURL}/_next/image?url=${url}&w=16&q=75`
  ).then(async (res) =>
    Buffer.from(await res.arrayBuffer()).toString("base64")
  );

  const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
      <filter id='b' color-interpolation-filters='sRGB'>
        <feGaussianBlur stdDeviation='1'/>
      </filter>

      <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%' href='data:image/webp;base64,${base64str}'/> 
    </svg>
  `;

  const toBase64 = (str) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
}

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export function handleDownloadImage(photo) {
  fetch(photo?.imgUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = photo?.imgName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
}

export function formatNumber(number) {
  const formatNumber = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  });
  return formatNumber.format(number);
}
