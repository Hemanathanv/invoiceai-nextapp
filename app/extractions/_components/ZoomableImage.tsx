// Name: V.Hemanathan
// Describe: This component is used to display the image in a zoomable format.
// Framework: Next.js -15.3.2 

"use client";

import { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";
// import { createClient } from "@/utils/supabase/client";
import { getImageFromStrorage } from "../service/ZoomableImage.service";

// const supabase = createClient();

const getImage = async (fileName: string): Promise<string | null> => {
  const { data, error } =await getImageFromStrorage(fileName);
  // await
  //  supabase.storage
  //   .from("documents")
  //   .download(extractFileName(fileName));
  if (error) {
    console.error("Error downloading image:", error);
    return null;
  }
  return URL.createObjectURL(data);
};

interface Props {
  fileName: string;
}

export function ZoomableImage({ fileName }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const wrapperRef = useRef<ReactZoomPanPinchRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let mounted = true;
    getImage(fileName).then((url) => mounted && setImageUrl(url));
    return () => {
      mounted = false;
    };
  }, [fileName]);

  // once imageUrl changes (i.e. image loaded), wait a tick then fit it
  useEffect(() => {
    if (!imageUrl) return;
    const handle = setTimeout(() => {
      const cont = containerRef.current;
      const img = imgRef.current;
      const api = wrapperRef.current;
      if (cont && img && api) {
        const scaleX = cont.clientWidth / img.naturalWidth;
        const scaleY = cont.clientHeight / img.naturalHeight;
        const bestFit = Math.min(scaleX, scaleY, 1);
        api.zoomToElement(img, bestFit, 200);
      }
    }, 50);
    return () => clearTimeout(handle);
  }, [imageUrl]);

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8 text-gray-500 mb-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
        </svg>
        <p className="text-gray-500">Loading image…</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden flex flex-col  justify-center bg-gray-50">
      <TransformWrapper
        ref={wrapperRef}
        centerOnInit={false}
        wheel={{ step: 0.1 }}
        doubleClick={{ step: 1 }}
        pinch={{ step: 5 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="flex items-center space-x-2 z-10">
              <Button size="sm" variant="outline" onClick={() => zoomIn()}>
                +
              </Button>
              <Button size="sm" variant="outline" onClick={() => zoomOut()}>
                –
              </Button>
              <Button size="sm" variant="outline" onClick={() => resetTransform()}>
                ↺
              </Button>
            </div>
            <TransformComponent>
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Zoomable Invoice"
                className="block h-full w-full"
                style={{ userSelect: "none" }}
                />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
