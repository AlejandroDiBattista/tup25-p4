"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type MarkdownRendererProps = {
  content: string;
  title?: string;
  description?: string;
  className?: string;
  showCard?: boolean;
  theme?: "light" | "dark" | "auto";
};

export function MarkdownRenderer({
  content,
  title,
  description,
  className,
  showCard = true,
  theme = "dark",
}: MarkdownRendererProps) {
  const baseTypographyClasses = cn(
    "prose prose-sm max-w-none",
    "prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground",
    "prose-blockquote:text-muted-foreground prose-blockquote:border-l-border",
    "prose-code:text-foreground prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5",
    "prose-pre:p-0 prose-pre:bg-transparent",
    "prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground",
    "prose-a:text-primary hover:prose-a:text-primary/80",
  );

  const typographyClasses = cn(
    baseTypographyClasses,
    !showCard && "px-0 py-0"
  );


  const markdown = (
    <ReactMarkdown
      components={{
        code(props) {
          const { children, className } = props;
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !match;

          if (isInline) {
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            );
          }

          return (
            <SyntaxHighlighter
              PreTag="div"
              language={match?.[1]}
              style={oneLight}
              customStyle={{
                margin: 0,
                fontSize: "0.875rem",
                padding: "1rem",

              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-medium text-foreground mb-2">
            {children}
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-border pl-4 py-2 my-4 text-muted-foreground italic ">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 text-foreground">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 text-foreground">
            {children}
          </ol>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  if (!showCard) {
    return (
      <Card
        className={cn(
          "w-full border-none bg-transparent shadow-none gap-0 rounded-none py-0",
          className
        )}
      >
        <CardContent className={cn("px-0", typographyClasses)}>
          {markdown}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={typographyClasses}>{markdown}</CardContent>
    </Card>
  );
}