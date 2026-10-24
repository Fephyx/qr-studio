"use client";

import { useState } from "react";
import "@/css/CustomSelect.css";

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const options = [
  { label: "WEP", value: "WEP" },
  { label: "WPA/WPA2", value: "WPA" },
];

export default function CustomSelect({
  value,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  return (
    <div className="custom-select">
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label ?? "-- Choose option --"}</span>
        <i
          className={`bx bx-chevron-down custom-select-icon ${
            isOpen ? "rotated" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="custom-select-menu" role="listbox">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              className={`custom-select-option ${
                value === option.value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
              {value === option.value && (
                <i className="bx bx-check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}