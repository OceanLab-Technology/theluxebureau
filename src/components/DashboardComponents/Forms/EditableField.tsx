"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditableFieldProps = {
  label: string;
  name: string;
  value: string | number;
  type?: "text" | "number" | "email" | "date";
  onSave: (name: string, value: string) => void;
};

export function EditableField({
  label,
  name,
  value,
  type = "text",
  onSave,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  const handleBlur = () => {
    setEditing(false);
    if (inputValue !== String(value)) {
      onSave(name, inputValue);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        name={name}
        type={type}
        value={inputValue}
        readOnly={!editing}
        onClick={() => setEditing(true)}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        className={editing ? "border-ring" : "cursor-pointer"}
      />
    </div>
  );
}
