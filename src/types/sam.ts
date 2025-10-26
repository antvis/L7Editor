export interface SAMMapHelper {
  tileToLngLat: (x: number, y: number, z: number) => [number, number];
}

export interface SAMAdapter {
  predict: (points: { x: number; y: number; clickType: number }[]) => Promise<any>;
  exportGeoPolygon: (output: any, threshold?: number) => Promise<any>;
  exportImageClip: (output: any) => Promise<HTMLImageElement>;
  setGeoImage: (
    dataUrl: string,
    options: { extent: [number, number, number, number]; width: number; height: number },
  ) => Promise<void>;
  setEmbedding: (buffer: ArrayBuffer) => void;
  lngLat2ImagePixel: (lnglat: [number, number]) => [number, number] | undefined;
  mapHelper?: SAMMapHelper;
  initModel?: () => Promise<void>;
}
