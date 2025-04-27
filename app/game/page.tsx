"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [timeLeft, setTimeLeft] = useState<number>(180) // 3 minutes in seconds
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [isSelectingDifficulty, setIsSelectingDifficulty] = useState<boolean>(true)
  const [currentQuestionData, setCurrentQuestionData] = useState<Question | null>(null)

  useEffect(() => {
    const storedName = localStorage.getItem("playerName")
    const storedSport = localStorage.getItem("selectedSport")

    if (!storedName || !storedSport) {
      router.push("/player-setup")
      return
    }

    setPlayerName(storedName)
    setSelectedSport(storedSport)
  }, [router])

  // Fetch questions when difficulty is selected
  const fetchQuestionByDifficulty = async (difficulty: number) => {
    const fetchedQuestions = await getQuestionsByCategory(selectedSport, difficulty);
    if (fetchedQuestions.length > 0) {
      // Get a random question from the fetched questions
      const randomIndex = Math.floor(Math.random() * fetchedQuestions.length);
      setCurrentQuestionData(fetchedQuestions[randomIndex]);
      setIsSelectingDifficulty(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      endGame()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleOptionSelect = (option: string) => {
    if (showFeedback || !currentQuestionData) return

    setSelectedOption(option)
    setIsCorrect(option === currentQuestionData.correctAnswer)
    setShowFeedback(true)

    if (option === currentQuestionData.correctAnswer) {
      setScore((prev) => prev + currentQuestionData.difficulty)
    }

    // Move to next question after a delay
    setTimeout(() => {
      setShowFeedback(false)
      setSelectedOption(null)
      setIsCorrect(null)
      setCurrentQuestionIndex((prev) => prev + 1)
      setIsSelectingDifficulty(true)
      setCurrentQuestionData(null)
    }, 1500)
  }

  const endGame = async () => {
    setGameOver(true)

    // Save score to Firebase
    await saveScore(playerName, score, selectedSport)

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
        return "��"
    }
  }

  if (isSelectingDifficulty && selectedSport && !gameOver) {
    const difficulties = SPORT_DIFFICULTIES[selectedSport] || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden relative flex items-center justify-center">
        <BackHomeButton />
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-black/60 border border-purple-500/50 backdrop-blur-md px-4 py-2 rounded-lg">
              <p className="text-white">
                <span className="text-cyan-400 font-bold">{playerName}</span> | {getSportIcon()}{" "}
                {selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)}
              </p>
            </div>

            <div className="bg-black/60 border border-purple-500/50 backdrop-blur-md px-4 py-2 rounded-lg flex items-center">
              <Clock className="h-5 w-5 text-cyan-400 mr-2" />
              <span className="text-white font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-cyan-300">Time Remaining</span>
              <span className="text-cyan-300">{formatTime(timeLeft)}</span>
            </div>
            <Progress value={(timeLeft / 180) * 100} className="h-2 bg-gray-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </Progress>
          </div>

          <Card className="bg-black/60 border border-purple-500/50 backdrop-blur-md p-8 rounded-xl max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Question Type</h2>
            <div className="grid gap-4">
              {difficulties.map((diff: SportDifficulty) => (
                <Button
                  key={diff.points}
                  onClick={() => fetchQuestionByDifficulty(diff.points)}
                  className={`h-16 text-lg ${
                    selectedSport === 'basketball' ? (
                      diff.points === 2 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    ) : selectedSport === 'football' ? (
                      diff.points === 3 ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'
                    ) : selectedSport === 'baseball' ? (
                      diff.points === 1 ? 'bg-green-600 hover:bg-green-700' :
                      diff.points === 2 ? 'bg-yellow-600 hover:bg-yellow-700' :
                      diff.points === 3 ? 'bg-orange-600 hover:bg-orange-700' :
                      'bg-red-600 hover:bg-red-700'
                    ) : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {diff.label} - {diff.points} {diff.points === 1 ? 'point' : 'points'}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
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
              <p className="text-4xl font-bold text-white mb-2">{score} points</p>
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

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <BackHomeButton />
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden relative">
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
            <span className="text-white font-bold">{score} points</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-cyan-300">Time Remaining</span>
            <Clock className="h-5 w-5 text-cyan-400" />
          </div>
          <Progress value={(timeLeft / 180) * 100} className="h-2 bg-gray-800">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
          </Progress>
          <div className="text-right mt-1">
            <span className="text-cyan-300 font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="bg-black/60 border border-cyan-500/50 backdrop-blur-md px-4 py-2 rounded-lg">
            <p className="text-white">
              Question {currentQuestionIndex + 1}
            </p>
          </div>
        </div>

        <Card className="bg-black/60 border border-purple-500/50 backdrop-blur-md p-6 rounded-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-500"></div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">{currentQuestionData.text}</h2>
            <div className="text-sm text-cyan-300 mb-1">
              Worth: <span className="font-bold">{currentQuestionData.difficulty} points</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestionData.options.map((option, index) => (
              <AnimatePresence key={`${currentQuestionIndex}-${index}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showFeedback}
                    className={`w-full h-16 text-lg justify-start px-6 transition-all duration-300 ${
                      selectedOption === option
                        ? isCorrect
                          ? "bg-green-600 hover:bg-green-700 border-green-400"
                          : "bg-red-600 hover:bg-red-700 border-red-400"
                        : "bg-black/70 border border-cyan-500/30 hover:border-cyan-400 hover:bg-black/90"
                    }`}
                  >
                    <span className="mr-3">{String.fromCharCode(65 + index)}.</span> {option}
                  </Button>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </Card>

        {showFeedback && (
          <div className={`fixed inset-0 flex items-center justify-center z-20 pointer-events-none`}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`text-white text-6xl font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}
            >
              {isCorrect ? "CORRECT!" : "WRONG!"}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
