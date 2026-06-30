"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

type CoverImageFieldProps = {
  currentUrl?: string | null;
};

const inputClass =
  "min-h-[54px] border border-[#8a8277] bg-transparent px-4 text-base font-semibold normal-case tracking-normal text-[#191817] outline-none placeholder:text-[#6f6962] focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]";

export default function CoverImageField({ currentUrl }: CoverImageFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  const visiblePreview = previewUrl || currentUrl;

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
        Upload Cover Image
        <input
          accept="image/jpeg,image/png,image/webp"
          className={`${inputClass} py-3`}
          name="coverImageFile"
          onChange={handleFileChange}
          type="file"
        />
      </label>
      <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
        Cover Image URL
        <input
          className={inputClass}
          defaultValue={currentUrl ?? ""}
          name="coverImageUrl"
          placeholder="https://..."
          type="url"
        />
      </label>
      {visiblePreview ? (
        <div className="overflow-hidden border border-[#d9cec1] bg-[#ede1d3]">
          <Image
            alt=""
            className="aspect-[1.8] h-auto w-full object-cover"
            height={500}
            src={visiblePreview}
            unoptimized={visiblePreview.startsWith("blob:")}
            width={900}
          />
        </div>
      ) : (
        <div className="grid min-h-[180px] place-items-center border border-dashed border-[#b9ad9e] text-sm font-black uppercase tracking-[0.14em] text-[#8d867c]">
          No cover selected
        </div>
      )}
      <p className="text-sm font-semibold leading-6 text-[#6f6962]">
        Upload JPG, PNG, or WebP up to 5MB. A manual URL still works as a
        fallback.
      </p>
    </div>
  );
}
