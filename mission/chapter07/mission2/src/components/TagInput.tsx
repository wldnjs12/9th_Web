import { useState } from "react";

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
  }
  
  export default function TagInput({ tags, setTags }: TagInputProps) {
    const [text, setText] = useState("");
  
    const addTag = () => {
      if (text.trim() && !tags.includes(text.trim())) {
        setTags([...tags, text.trim()]);
        setText("");
      }
    };
  
    const removeTag = (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    };
  
    return (
      <div className="w-full">
        <div className="flex gap-2 mb-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="태그 입력"
            className="flex-1 bg-zinc-800 rounded px-3 py-2 border border-zinc-700 outline-none"
          />
          <button
            onClick={addTag}
            className="bg-pink-600 hover:bg-pink-500 px-3 py-1 rounded"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-pink-700 px-2 py-1 rounded-full text-sm"
            >
              #{tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-xs text-zinc-200 hover:text-white"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  }
  