import React from 'react';
import { base_path } from '../../../environment'

interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?:string;
  style?: React.CSSProperties;
}

const ImageWithBasePath = (props: Image) => {
  const src = props.src?.trim?.() ?? "";

  // Profile photos from the dummy seed data are full URLs. Several existing
  // screens also prepend IMG_URL before calling this component, so recover the
  // actual URL instead of producing `https://api-hosthttps://photo-host/...`.
  const lastHttpIndex = Math.max(src.lastIndexOf("https://"), src.lastIndexOf("http://"));
  const fullSrc =
    src.startsWith("data:") || src.startsWith("blob:")
      ? src
      : lastHttpIndex > 0
        ? src.slice(lastHttpIndex)
        : src.startsWith("http://") || src.startsWith("https://")
          ? src
          : `${base_path}${src}`;
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
      style={props.style}
    />
  );
};

export default ImageWithBasePath;
