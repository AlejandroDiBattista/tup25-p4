"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

import type { Exam } from "@/types/exam"

type ExamResult = {
  score: number
  total: number
  examNumber: number
}

type ExamContextValue = {
  legajo: string
  setLegajo: (value: string) => void
  exam: Exam | null
  answers: Partial<Record<number, number>>
  currentIndex: number
  setCurrentIndex: (value: number) => void
  loading: boolean
  error: string | null
  result: ExamResult | null
  totalQuestions: number
  answeredCount: number
  allAnswered: boolean
  currentQuestion: Exam["questions"][number] | null
  currentAnswer: number | undefined
  startExam: (options?: { examNumber?: number }) => Promise<number | null>
  answerQuestion: (index: number, answer: number) => void
  goToNextUnanswered: () => void
  finalizeExam: () => ExamResult | null
  resetError: () => void
  repeatExam: () => Promise<number | null>
  newExam: () => Promise<number | null>
  clearState: () => void
}

const EXAM_MIN = 1
const EXAM_MAX = 60

const generateRandomExamNumber = () => Math.floor(Math.random() * (EXAM_MAX - EXAM_MIN + 1)) + EXAM_MIN

const ExamContext = createContext<ExamContextValue | undefined>(undefined)

async function fetchExam(examNumber: number) {
  const response = await fetch(`/api/examen/${examNumber}`, { cache: "no-store" })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    const message = payload?.message ?? "No se pudo obtener el examen. Intentalo nuevamente."
    throw new Error(message)
  }

  return (await response.json()) as Exam
}

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [legajo, setLegajo] = useState("")
  const [exam, setExam] = useState<Exam | null>(null)
  const [answers, setAnswers] = useState<Partial<Record<number, number>>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ExamResult | null>(null)
  const [lastExamNumber, setLastExamNumber] = useState<number | null>(null)

  const totalQuestions = exam?.questions.length ?? 0
  const answeredCount = totalQuestions
    ? exam!.questions.reduce((count, _question, index) => (answers[index] !== undefined ? count + 1 : count), 0)
    : 0
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions

  const currentQuestion = exam?.questions[currentIndex] ?? null
  const currentAnswer = answers[currentIndex]

  const resetExamState = useCallback(() => {
    setExam(null)
    setAnswers({})
    setCurrentIndex(0)
    setResult(null)
  }, [])

  const startExam = useCallback(
    async ({ examNumber }: { examNumber?: number } = {}) => {
      const targetExamNumber = examNumber ?? generateRandomExamNumber()

      setLoading(true)
      setError(null)
      resetExamState()

      try {
        const examData = await fetchExam(targetExamNumber)
        setExam(examData)
        setLastExamNumber(examData.examNumber)
        return examData.examNumber
      } catch (err) {
        const message = err instanceof Error ? err.message : "Ocurrió un error inesperado."
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [resetExamState]
  )

  const answerQuestion = useCallback((index: number, answer: number) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: answer,
    }))
  }, [])

  const goToNextUnanswered = useCallback(() => {
    if (!exam) return

    if (allAnswered) {
      return
    }

    for (let offset = 1; offset <= exam.questions.length; offset++) {
      const nextIndex = (currentIndex + offset) % exam.questions.length
      if (answers[nextIndex] === undefined) {
        setCurrentIndex(nextIndex)
        break
      }
    }
  }, [allAnswered, answers, currentIndex, exam])

  const finalizeExam = useCallback(() => {
    if (!exam) return null

    const total = exam.questions.length

    const score = exam.questions.reduce((count, question, index) => {
      const expected = question.correcta
      const selected = answers[index]
      const isCorrect = selected === expected
      return count + (isCorrect ? 1 : 0)
    }, 0)

    const examResult: ExamResult = { score, total, examNumber: exam.examNumber }
    setResult(examResult)
    return examResult
  }, [answers, exam])

  const resetError = useCallback(() => setError(null), [])

  const repeatExam = useCallback(async () => {
    if (lastExamNumber === null) return null
    return startExam({ examNumber: lastExamNumber })
  }, [lastExamNumber, startExam])

  const newExam = useCallback(async () => startExam({ examNumber: generateRandomExamNumber() }), [startExam])

  const clearState = useCallback(() => {
    setLegajo("")
    setError(null)
    setResult(null)
    setLastExamNumber(null)
    resetExamState()
  }, [resetExamState])

  const value = useMemo<ExamContextValue>(
    () => ({
      legajo,
      setLegajo,
      exam,
      answers,
      currentIndex,
      setCurrentIndex,
      loading,
      error,
      result,
      totalQuestions,
      answeredCount,
      allAnswered,
      currentQuestion,
      currentAnswer,
      startExam,
      answerQuestion,
      goToNextUnanswered,
      finalizeExam,
      resetError,
      repeatExam,
      newExam,
      clearState,
    }),
    [
      legajo,
      exam,
      answers,
      currentIndex,
      loading,
      error,
      result,
      totalQuestions,
      answeredCount,
      allAnswered,
      currentQuestion,
      currentAnswer,
      startExam,
      answerQuestion,
      goToNextUnanswered,
      finalizeExam,
      resetError,
      repeatExam,
      newExam,
      clearState,
    ]
  )

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
}

export function useExamContext() {
  const context = useContext(ExamContext)
  if (!context) {
    throw new Error("useExamContext debe utilizarse dentro de un ExamProvider")
  }
  return context
}
