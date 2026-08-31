"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { useToasts } from "@/store/toasts";
import { XIcon } from "@/components/icons";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

export default function ImageUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const toast = useToasts((s) => s.push);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    if (!CLOUD || !PRESET) {
      toast("Cloudinary env vars missing — paste an image URL instead", "error");
      return;
    }
    setBusy(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: fd });
        if (!res.ok) throw new Error("upload failed");
        const data = await res.json();
        uploaded.push(data.secure_url);
      }
      onChange([...images, ...uploaded]);
      toast(`${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded ✓`);
    } catch {
      toast("Upload failed — try a smaller image or paste a URL", "error");
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <p className="label">Photos * <span className="normal-case tracking-normal text-ink/40">(first one is the cover)</span></p>
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={src + i} className="relative h-24 w-20 overflow-hidden rounded-xl border border-forest-900/10">
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            {i === 0 && <span className="absolute inset-x-0 bottom-0 bg-forest-900/85 py-0.5 text-center text-[10px] font-bold text-cream">COVER</span>}
            <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white">
              <XIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}
          className="grid h-24 w-20 place-items-center rounded-xl border-2 border-dashed border-forest-900/20 p-1 text-center text-xs font-semibold text-forest-700 transition hover:border-forest-600">
          {busy ? "Uploading…" : "📷 Add photos"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
      </div>
      <div className="mt-2 flex gap-2">
        <input className="input flex-1" placeholder="…or paste an image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="button" className="btn btn-ghost px-4 text-sm"
          onClick={() => { if (url.trim()) { onChange([...images, url.trim()]); setUrl(""); } }}>
          Add
        </button>
      </div>
    </div>
  );
}