"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BackHomeButton } from "@/components/ui/back-home-button"

export default function PlayerSetup() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [nameError, setNameError] = useState(false)

  const sports = [
    { id: "basketball", name: "Basketball", image: "/action-packed-basketball-game.png" },
    { id: "football", name: "Football", image: "/action-packed-football-game.png" },
    { id: "soccer", name: "Soccer", image: "/vibrant-soccer-match.png" },
    { id: "baseball", name: "Baseball", image: "/sunlit-baseball-field.png" },
  ]

  const handleSubmit = () => {
    if (playerName.trim() === "") {
      setNameError(true)
      return
    }

    if (selectedSport) {
      // In a real app, we would store this in context or state management
      localStorage.setItem("playerName", playerName)
      localStorage.setItem("selectedSport", selectedSport)
      router.push("/game")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden relative">
      <BackHomeButton />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/60 border border-purple-500/50 backdrop-blur-md p-8 rounded-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                Player Setup
              </span>
            </h1>

            <div className="mb-8">
              <label htmlFor="playerName" className="block text-cyan-300 mb-2 text-lg">
                Enter Your Name:
              </label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value)
                  setNameError(false)
                }}
                placeholder="Your name here..."
                className={`bg-black/50 border-cyan-500/50 text-white placeholder:text-gray-500 h-12 text-lg ${
                  nameError ? "border-red-500" : ""
                }`}
              />
              {nameError && <p className="text-red-500 mt-1">Please enter your name</p>}
            </div>

            <div className="mb-8">
              <h2 className="text-cyan-300 mb-4 text-lg">Choose Your Sport:</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sports.map((sport) => (
                  <div
                    key={sport.id}
                    onClick={() => setSelectedSport(sport.id)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 transform ${
                      selectedSport === sport.id
                        ? "ring-2 ring-green-500 scale-105"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="aspect-square relative">
                      <Image src={sport.image || "/placeholder.svg"} alt={sport.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-2">
                        <span className="text-white font-bold">{sport.name}</span>
                      </div>
                      {selectedSport === sport.id && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={!selectedSport}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-5 px-10 rounded-full text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                START CHALLENGE
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
