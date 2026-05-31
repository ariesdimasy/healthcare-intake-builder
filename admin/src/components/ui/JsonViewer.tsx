"use client";

interface JsonViewerProps {
  data: unknown;
  collapsed?: boolean;
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "color: #93c5fd;"; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "color: #86efac;"; // key
          } else {
            cls = "color: #fda4af;"; // string
          }
        } else if (/true|false/.test(match)) {
          cls = "color: #fcd34d;"; // boolean
        } else if (/null/.test(match)) {
          cls = "color: #d1d5db;"; // null
        }
        return `<span style="${cls}">${match}</span>`;
      }
    );
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const json = JSON.stringify(data, null, 2);

  return (
    <div className="json-viewer">
      <pre
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(json) }}
        style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      />
    </div>
  );
}
