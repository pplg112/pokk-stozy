declare module "pngjs" {
  export class PNG {
    data: Buffer;
    width: number;
    height: number;
    static sync: {
      read(buffer: Buffer): { data: Buffer; width: number; height: number };
    };
  }
}

declare module "jpeg-js" {
  export function decode(
    buffer: Buffer,
    options?: { useTArray?: boolean; maxMemoryUsageInMB?: number }
  ): { data: Uint8Array | Uint8ClampedArray; width: number; height: number };
}

declare module "jsqr" {
  export default function jsQR(
    data: Uint8ClampedArray | Uint8Array,
    width: number,
    height: number,
    options?: { inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst" }
  ): { data: string; location: any } | null;
}
