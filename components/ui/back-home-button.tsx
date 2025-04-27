"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ConfirmationDialog } from "./confirmation-dialog"

export function BackHomeButton() {
  const router = useRouter()
  const pathname = usePathname()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const isGamePage = pathname === "/game"

  const handleClick = () => {
    if (isGamePage) {
      setShowConfirmation(true)
    } else {
      router.push("/")
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors absolute top-6 left-6 z-20"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back Home
      </button>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => router.push("/")}
        title="Leave Game?"
        message="Are you sure you want to leave? Your current game progress will be lost."
      />
    </>
  )
} 