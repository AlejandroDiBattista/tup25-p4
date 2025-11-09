"use client";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

// Puedes importar un tema CSS de highlight.js en tu layout global si quieres:
// import 'highlight.js/styles/github-dark.min.css';
// (Asegúrate de instalar highlight.js)

export interface MarkdownViewerProps {
  content: string;
  className?: string;
  /** Si quieres envolver el contenido en un contenedor con estilos predefinidos */
  variant?: "prose" | "raw";
  /** Forzar tema claro/oscuro de highlight (puedes alternar con data attributes) */
  highlightThemeClassName?: string;
  /** Permitir HTML crudo (cuidado XSS si el contenido no es confiable) */
  allowDangerousHtml?: boolean;
}

export function MarkdownViewer({
  content,
  className,
  variant = "prose",
  highlightThemeClassName,
  allowDangerousHtml = false,
}: MarkdownViewerProps) {
  return (
    <div
      className={cn(
        variant === "prose" &&
          "prose prose-neutral dark:prose-invert max-w-none prose-pre:rounded-md prose-pre:bg-muted/60 prose-code:before:hidden prose-code:after:hidden",
        highlightThemeClassName,
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
          allowDangerousHtml ? (rehypeRaw as any) : null,
        ].filter(Boolean)}
        components={{
          code(node) {
            const { className, children, ref, ...rest } = node as any;
            const isBlock = !(rest.inline === true);
            if (isBlock) {
              return (
                <pre className={cn("overflow-x-auto rounded-md bg-muted/70 p-4 text-sm", className)}>
                  <code {...rest}>{children}</code>
                </pre>
              );
            }
            return (
              <code className={cn("rounded bg-muted px-1 py-0.5 text-xs", className)} {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownViewer;
