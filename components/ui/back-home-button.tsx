"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ConfirmationDialog } from "./confirmation-dialog"
import { Button } from "./button"

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
      <Button
        onClick={handleClick}
        variant="outline"
        className="fixed top-6 right-6 z-50 bg-black/40 border border-cyan-500/50 backdrop-blur-md text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-black/60 transition-all duration-300 group"
      >
        <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Back Home
      </Button>

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