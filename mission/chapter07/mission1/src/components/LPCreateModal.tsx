import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLP } from "../api/lpApi";
import { uploadImage } from "../api/uploadApi";
import TagInput from "./TagInput";
import { useLocalStorage } from "../hooks/useLocalStorage";
import lpDefault from "../assets/lp_default.png";

export default function LPCreateModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { value: token } = useLocalStorage<string | null>("auth_token", null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("로그인이 필요합니다.");

      let imageUrl = "";

      if (file) {
        setUploading(true);
        imageUrl = await uploadImage(file);
        setUploading(false);
      }

      return createLP({
        title,
        content,
        thumbnail: imageUrl || "",
        tags,
        token,
      });
    },
    onSuccess: () => {
      alert("LP 업로드 성공!");
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose();
    },
    onError: (err: any) => {
      console.error("LP 업로드 실패:", err.response || err);
      alert("LP 업로드 실패");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleLPClick = () => fileInputRef.current?.click();

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div className="relative bg-zinc-900 rounded-2xl p-6 w-[90%] max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-zinc-400 hover:text-pink-400 text-xl"
        >
          ✕
        </button>

        <div className="flex flex-col items-center mb-5">
          <div
            onClick={handleLPClick}
            className="relative w-40 h-40 rounded-full bg-zinc-800 cursor-pointer 
                       flex items-center justify-center overflow-hidden border border-zinc-700"
          >
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="LP Thumbnail"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={lpDefault}
                alt="LP 기본 이미지"
                className="object-cover w-full h-full opacity-80"
              />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="LP 제목"
          className="w-full mb-3 bg-zinc-800 rounded px-3 py-2 outline-none 
                     border border-zinc-700 focus:border-pink-500"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="LP 내용"
          className="w-full mb-3 bg-zinc-800 rounded px-3 py-2 outline-none 
                     border border-zinc-700 focus:border-pink-500 resize-none"
        />

        <TagInput tags={tags} setTags={setTags} />

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || uploading}
          className="w-full mt-5 py-2 rounded bg-pink-600 hover:bg-pink-500 font-semibold"
        >
          {uploading
            ? "이미지 업로드 중..."
            : mutation.isPending
            ? "LP 생성 중..."
            : "Add LP"}
        </button>
      </div>
    </div>
  );
}
