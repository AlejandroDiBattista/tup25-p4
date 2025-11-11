"use client"

import { useId } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const remarkPlugins = [remarkGfm]
const rehypePlugins = [rehypeHighlight]

function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("markdown-body", className)}>
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

export type MultipleChoiceOption = {
  value: string
  markdown: string
}

export type MultipleChoiceQuestionProps = {
  prompt: string
  options: MultipleChoiceOption[]
  value?: string
  onChange?: (value: string) => void
}

export function MultipleChoiceQuestion({ prompt, options, value, onChange }: MultipleChoiceQuestionProps) {
  const groupId = useId()
  const normalizedValue = value ?? ""

  return (
    <Card>
      <CardHeader className="pb-0 mb-4">
        <Markdown className="text-xl font-semibold leading-tight text-foreground">{prompt}</Markdown>
      </CardHeader>

      <CardContent className="space-y-3">
        <RadioGroup value={normalizedValue} onValueChange={onChange} className="space-y-3">
          {options.map((option, index) => {
            const optionId = `${groupId}-${index}`

            return (
              <div
                key={option.value}
                className="flex items-start gap-3 rounded-lg border border-border/80 bg-card/60 p-3 transition hover:bg-muted/60"
              >
                <RadioGroupItem id={optionId} value={option.value} className="mt-1" />

                <Label htmlFor={optionId} className="flex-1 cursor-pointer text-foreground">
                  <Markdown className="text-base font-normal leading-relaxed text-foreground">
                    {option.markdown}
                  </Markdown>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
