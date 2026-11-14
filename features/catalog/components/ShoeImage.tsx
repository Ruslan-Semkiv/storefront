import Image from 'next/image';
import { cn } from '@/lib/cn';

type Props = {
  name: string;
  /** API image path or a browser-only data URL. */
  imageUrl?: string | null;
  /** Tint for the placeholder silhouette when there is no image. */
  colorHex: string;
  className?: string;
  imageClassName?: string;
};

/** Product photo if there is one; otherwise a tinted sneaker silhouette on the tile background. */
export function ShoeImage({ name, imageUrl, colorHex, className, imageClassName }: Props) {
  const isDataUrl = imageUrl?.startsWith('data:');

  return (
    <div className={cn('relative aspect-[4/5] overflow-hidden bg-tile', className)}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized={isDataUrl} // data URLs can't go through the Next image optimizer
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={cn('object-cover', imageClassName)}
        />
      ) : (
        <svg viewBox="0 0 200 250" role="img" aria-label={name} className="size-full">
          <ellipse cx="100" cy="172" rx="76" ry="6" fill="#000" opacity="0.07" />
          <path d="M22 154 h156 c4 0 6 3 6 6 v4 c0 3-3 6-6 6 H24 c-3 0-6-3-6-6 v-4 c0-3 2-6 4-6z" fill="#fbfbfa" stroke="#000" strokeOpacity="0.12" />
          <path
            d="M24 154 c0-14 6-26 22-30 l28-8 c8-2 14-10 18-22 l4-10 c2-5 7-7 12-5 l34 14 c10 4 16 12 18 22 l6 39 z"
            fill={colorHex}
            stroke="#000"
            strokeOpacity="0.08"
          />
          <path d="M60 140 c30 2 70-6 106-20" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M98 96 l14 6 M94 106 l14 6 M90 116 l14 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </svg>
      )}
    </div>
  );
}
