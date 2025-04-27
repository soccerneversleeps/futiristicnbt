"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Star } from "lucide-react"
import { 
  getQuestionsByCategory, 
  saveScore, 
  type Question,
  SPORT_DIFFICULTIES,
  type SportDifficulty 
} from '@/lib/firebaseService'
import { BackHomeButton } from "@/components/ui/back-home-button"

export default function GamePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState<string>("")
  const [selectedSport, setSelectedSport] = useState<string>("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)

  useEffect(() => {
    const storedName = localStorage.getItem("playerName")
    const storedSport = localStorage.getItem("selectedSport")

    if (!storedName || !storedSport) {
      router.push("/player-setup")
      return
    }

    setPlayerName(storedName)
    setSelectedSport(storedSport)
    
    // Automatically fetch questions using the first difficulty option
    const fetchQuestions = async () => {
      const sportDifficulties = SPORT_DIFFICULTIES[storedSport]
      if (sportDifficulties && sportDifficulties.length > 0) {
        const fetchedQuestions = await getQuestionsByCategory(storedSport, sportDifficulties[0].value)
        if (fetchedQuestions.length === 0) {
          console.error("No questions available for this category")
          return
        }
        setQuestions(fetchedQuestions)
      }
    }
    fetchQuestions()
  }, [router])

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1) // Always add 1 point regardless of difficulty
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleGameOver()
    }
  }

  const handleGameOver = async () => {
    if (playerName && selectedSport) {
      await saveScore(playerName, score, selectedSport)
    }
    setGameOver(true)
  }

  const endGame = async () => {
    setGameOver(true)
    if (playerName && selectedSport) {
      await saveScore(playerName, score, selectedSport)
    }

    // Also update local storage for immediate leaderboard display
    const existingScores = JSON.parse(localStorage.getItem("leaderboard") || "[]")
    const newLeaderboard = [...existingScores, { name: playerName, score, sport: selectedSport }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden relative flex items-center justify-center">
        <BackHomeButton />
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
        <Card className="bg-black/60 border border-purple-500/50 backdrop-blur-md p-8 rounded-xl">
          <div className="text-2xl text-white">Loading questions...</div>
        </Card>
      </div>
    )
  }

  const getSportIcon = () => {
    switch (selectedSport) {
      case "basketball":
        return "🏀"
      case "football":
        return "🏈"
      case "soccer":
        return "⚽"
      case "baseball":
        return "⚾"
      default:
        return "🎮"
    }
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden relative flex items-center justify-center">
        <BackHomeButton />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
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

        <Card className="bg-black/60 border border-purple-500/50 backdrop-blur-md p-8 rounded-xl max-w-md w-full mx-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-500"></div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Time's Up!</h1>
            <p className="text-cyan-300 text-xl mb-6">Great job, {playerName}!</p>

            <div className="bg-black/40 rounded-lg p-6 mb-6 border border-cyan-500/30">
              <p className="text-gray-300 mb-2">Your final score:</p>
              <p className="text-4xl font-bold text-white mb-2">{score} correct</p>
              <p className="text-gray-300">
                Sport: {getSportIcon()} {selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push("/leaderboard")}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <Trophy className="mr-2 h-5 w-5" />
                Leaderboard
              </Button>

              <Button
                onClick={() => router.push("/player-setup")}
                className="bg-black border border-cyan-500/50 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-black/80 transition-all duration-300"
              >
                Play Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden relative">
      <BackHomeButton />
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-black/60 border border-purple-500/50 backdrop-blur-md px-4 py-2 rounded-lg">
            <p className="text-white">
              <span className="text-cyan-400 font-bold">{playerName}</span> | {getSportIcon()}{" "}
              {selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)}
            </p>
          </div>

          <div className="bg-black/60 border border-green-500/50 backdrop-blur-md px-4 py-2 rounded-lg flex items-center">
            <Star className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-white font-bold">{score} correct</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-cyan-300">Time Remaining</span>
            <Clock className="h-5 w-5 text-cyan-400" />
          </div>
          <Progress value={(timeLeft / 60) * 100} className="h-2 bg-gray-800">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
          </Progress>
          <div className="text-right mt-1">
            <span className="text-cyan-300 font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Card className="bg-black/60 border border-purple-500/50 backdrop-blur-md p-6 rounded-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-500"></div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">{questions[currentQuestionIndex].question}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Button
                key={option}
                onClick={() => handleAnswer(option === questions[currentQuestionIndex].correctAnswer)}
                disabled={showFeedback}
                className="w-full h-16 text-lg justify-start px-6 transition-all duration-300 bg-black/70 border border-cyan-500/30 hover:border-cyan-400 hover:bg-black/90"
              >
                <span className="mr-3">{String.fromCharCode(65 + index)}.</span> {option}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}