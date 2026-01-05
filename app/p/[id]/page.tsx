"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  async function submit() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <div>
      <textarea onChange={e => setContent(e.target.value)} />
      <button onClick={submit}>Create Paste</button>
      {url && <p>{url}</p>}
    </div>
  );
}

