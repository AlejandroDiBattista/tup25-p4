"use client";

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MarkdownRendererProps {
  content: string;
  title?: string;
  description?: string;
  showCard?: boolean;
  className?: string;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export default function MarkdownRenderer({
  content,
  title,
  description,
  showCard = false,
  className = ""
}: MarkdownRendererProps) {

  const MarkdownContent = () => (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Componente personalizado para bloques de código
          code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            return !inline && language ? (
              <div className="relative">
                <div className="absolute top-0 right-0 bg-gray-800 text-gray-300 px-2 py-1 text-xs rounded-bl-md z-10">
                  {language}
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={language}
                  PreTag="div"
                  className="!mt-0 !mb-4 rounded-lg"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code 
                className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Componentes personalizados para elementos HTML
          h1: ({ children }) => (
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
              {children}
            </h1>
          ),
          
          h2: ({ children }) => (
            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              {children}
            </h2>
          ),
          
          h3: ({ children }) => (
            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
              {children}
            </h3>
          ),
          
          h4: ({ children }) => (
            <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight">
              {children}
            </h4>
          ),
          
          p: ({ children }) => (
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {children}
            </p>
          ),
          
          ul: ({ children }) => (
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              {children}
            </ul>
          ),
          
          ol: ({ children }) => (
            <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
              {children}
            </ol>
          ),
          
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-2 pl-6 italic">
              {children}
            </blockquote>
          ),
          
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-primary font-medium underline underline-offset-4 hover:text-primary/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          table: ({ children }) => (
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full">
                {children}
              </table>
            </div>
          ),
          
          thead: ({ children }) => (
            <thead>
              {children}
            </thead>
          ),
          
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          
          tr: ({ children }) => (
            <tr className="even:bg-muted m-0 border-t p-0">
              {children}
            </tr>
          ),
          
          th: ({ children }) => (
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              {children}
            </th>
          ),
          
          td: ({ children }) => (
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  if (showCard) {
    return (
      <Card className="w-full">
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <MarkdownContent />
        </CardContent>
      </Card>
    );
  }

  return <MarkdownContent />;
}