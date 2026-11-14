'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { env } from '@/lib/env';
import { routes } from '@/config/routes';
import { cn } from '@/lib/cn';
import { addProductFormSchema, SHOE_SIZES, type AddProductFormValues } from '../schemas/create-product.schema';
import { SHOE_COLORS } from '../lib/palette';
import { resizeImageToDataUrl } from '../lib/resize-image';
import { localImageStore } from '../lib/local-image-store';
import { useCreateProduct } from '../api/useCreateProduct';
import { ShoeImage } from './ShoeImage';

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

export function AddProductForm() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: { name: '', model: '', price: '', units: '10', colorNames: ['Black'], sizes: [40, 41, 42, 43, 44] },
  });

  const name = useWatch({ control, name: 'name' });
  const colorNames = useWatch({ control, name: 'colorNames' });
  const previewTint = SHOE_COLORS.find((c) => c.name === colorNames[0])?.hex ?? '#111111';

  async function onPickImage(file: File | undefined) {
    if (!file) return;
    setImageError(null);
    setProcessing(true);
    try {
      setImage(await resizeImageToDataUrl(file));
    } catch (e) {
      setImageError(e instanceof Error ? e.message : 'Could not read that image');
    } finally {
      setProcessing(false);
    }
  }

  function onSubmit(values: AddProductFormValues) {
    const model = values.model.trim();
    const price = Math.round(Number(values.price.replace(',', '.')) * 100);
    // the backend sells one item per colour and size
    const items = values.colorNames.flatMap((colour) =>
      values.sizes.map((size) => ({
        name: values.name.trim(),
        model,
        colour: colour.toLowerCase(),
        size,
        unitsNumber: Number(values.units),
        price,
        currency: env.NEXT_PUBLIC_DEFAULT_CURRENCY,
      })),
    );
    createProduct.mutate(items, {
        onSuccess: () => {
          if (image) {
            try {
              localImageStore.save(model, image); // a product card is one model; stays in this browser only
            } catch {
              window.alert('The shoe was added, but this browser has no room left to store its photo.');
            }
          }
          router.push(routes.catalog);
        },
      });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 md:grid-cols-[320px_1fr]" noValidate>
      {/* Image picker + live preview */}
      <div className="space-y-3">
        <Label htmlFor="image">Photo</Label>
        <label
          htmlFor="image"
          className={cn(
            'group relative block cursor-pointer overflow-hidden rounded-md ring-1 ring-border transition hover:ring-ink',
            processing && 'animate-pulse',
          )}
        >
          <ShoeImage name={name || 'New shoe'} imageUrl={image} colorHex={previewTint} imageClassName="object-cover" />
          {!image && (
            <span className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-xl border border-white/50 bg-white/40 py-2 text-sm font-medium backdrop-blur-xl">
              <ImagePlus aria-hidden className="size-4" /> Choose a photo
            </span>
          )}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onPickImage(e.target.files?.[0])}
        />
        {image && (
          <Button type="button" variant="outline" size="sm" onClick={() => setImage(null)}>
            <X aria-hidden /> Remove photo
          </Button>
        )}
        <FieldError message={imageError ?? undefined} />
        <p className="flex gap-2 text-xs text-muted-foreground">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          The photo is resized and saved only in this browser. It is never uploaded to the server, so other
          devices will show the placeholder.
        </p>
      </div>

      {/* Details */}
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="e.g. Forest Runner 3" aria-invalid={Boolean(errors.name)} {...register('name')} />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="model">Model code</Label>
            <Input id="model" placeholder="e.g. FR-300" aria-invalid={Boolean(errors.model)} {...register('model')} />
            <FieldError message={errors.model?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ({env.NEXT_PUBLIC_DEFAULT_CURRENCY})</Label>
            <Input id="price" inputMode="decimal" placeholder="129.90" aria-invalid={Boolean(errors.price)} {...register('price')} />
            <FieldError message={errors.price?.message} />
          </div>
        </div>

        <div className="space-y-2 sm:w-1/2">
          <Label htmlFor="units">Pairs in stock, per colour and size</Label>
          <Input id="units" inputMode="numeric" placeholder="10" aria-invalid={Boolean(errors.units)} {...register('units')} />
          <FieldError message={errors.units?.message} />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Colours</legend>
          <Controller
            control={control}
            name="colorNames"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {SHOE_COLORS.map((c) => {
                  const on = field.value.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() => field.onChange(on ? field.value.filter((n) => n !== c.name) : [...field.value, c.name])}
                      className={cn(
                        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition',
                        on ? 'border-ink bg-ink/5' : 'border-border text-muted-foreground hover:border-ink/40',
                      )}
                    >
                      <span className="size-3.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
          />
          <FieldError message={errors.colorNames?.message} />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Sizes</legend>
          <Controller
            control={control}
            name="sizes"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {SHOE_SIZES.map((s) => {
                  const on = field.value.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => field.onChange(on ? field.value.filter((n) => n !== s) : [...field.value, s])}
                      className={cn(
                        'min-w-11 rounded-full border px-3 py-1.5 text-sm tabular-nums transition',
                        on ? 'border-ink bg-ink/5' : 'border-border text-muted-foreground hover:border-ink/40',
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          />
          <FieldError message={errors.sizes?.message} />
        </fieldset>

        {createProduct.isError && (
          <p className="text-sm text-destructive" role="alert">Couldn&apos;t save the shoe: {createProduct.error.message}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg" disabled={createProduct.isPending || processing}>
            {createProduct.isPending ? 'Saving…' : 'Add to catalog'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.push(routes.catalog)}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
