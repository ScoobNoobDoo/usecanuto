import Image from "next/image";

export default function AdminImageThumb({
  src,
  alt = "",
}: {
  src: string;
  alt?: string;
}) {
  const isExternal = src.startsWith("http");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={isExternal}
      className="object-cover"
      sizes="120px"
    />
  );
}