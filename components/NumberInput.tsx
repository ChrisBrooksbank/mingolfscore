"use client";

import { useEffect, useState } from "react";
import { parseBoundedInt } from "@/lib/scoring";

type Props = {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

/**
 * A number field that keeps what the user is typing, so the box can be cleared
 * (e.g. deleting "18" to type "9") without snapping back to the old value.
 * Valid values are committed as they are typed; leaving the field restores the
 * committed value if the text is empty or invalid.
 */
export function NumberInput({ id, value, min, max, onChange }: Props) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText((current) => (parseBoundedInt(current, min, max) === value ? current : String(value)));
  }, [value, min, max]);

  return (
    <input
      id={id}
      className="input"
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        const parsed = parseBoundedInt(event.target.value, min, max);
        if (parsed !== null) onChange(parsed);
      }}
      onBlur={() => setText(String(value))}
    />
  );
}
