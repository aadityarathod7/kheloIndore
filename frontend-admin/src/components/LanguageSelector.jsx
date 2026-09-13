import React from "react";
import { Form } from "react-bootstrap";

const DEFAULT_LANGUAGES = ["Hindi", "English"];

const normaliseLanguages = (languages) =>
  [...new Set((Array.isArray(languages) ? languages : [])
    .map((language) => String(language || "").trim())
    .filter(Boolean))];

export default function LanguageSelector({ value = [], onChange, label = "Languages Known" }) {
  const languages = normaliseLanguages(value);
  const otherLanguages = languages.filter((language) => !DEFAULT_LANGUAGES.includes(language));

  const toggleDefaultLanguage = (language) => {
    const next = languages.includes(language)
      ? languages.filter((item) => item !== language)
      : [...languages, language];
    onChange(normaliseLanguages(next));
  };

  const updateOtherLanguages = (event) => {
    const typedLanguages = event.target.value
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean);
    const selectedDefaults = DEFAULT_LANGUAGES.filter((language) => languages.includes(language));
    onChange(normaliseLanguages([...selectedDefaults, ...typedLanguages]));
  };

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <div className="d-flex flex-wrap gap-2 mb-2">
        {DEFAULT_LANGUAGES.map((language) => {
          const selected = languages.includes(language);
          return (
            <button
              key={language}
              type="button"
              className={`btn btn-sm ${selected ? "btn-success" : "btn-outline-success"}`}
              onClick={() => toggleDefaultLanguage(language)}
              aria-pressed={selected}
            >
              {selected ? "✓ " : ""}{language}
            </button>
          );
        })}
      </div>
      <Form.Control
        type="text"
        value={otherLanguages.join(", ")}
        onChange={updateOtherLanguages}
        placeholder="Other language(s), separated by commas"
      />
    </Form.Group>
  );
}
