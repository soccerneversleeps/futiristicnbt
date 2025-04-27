"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react"
import { BackHomeButton } from "@/components/ui/back-home-button"

interface LeaderboardEntry {
  name: string
  score: number
  sport: string
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // In a real app, we would fetch this from an API
    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]")

    // If empty, add some mock data
    if (storedLeaderboard.length === 0) {
      const mockLeaderboard: LeaderboardEntry[] = [
        { name: "SpaceJam23", score: 87, sport: "basketball" },
        { name: "GoalMaster", score: 76, sport: "soccer" },
        { name: "TouchdownKing", score: 72, sport: "football" },
        { name: "HoopDreams", score: 65, sport: "basketball" },
        { name: "SoccerStar", score: 58, sport: "soccer" },
        { name: "HomeRunHero", score: 54, sport: "baseball" },
        { name: "BallWizard", score: 49, sport: "basketball" },
        { name: "FieldGoal", score: 42, sport: "football" },
        { name: "BaseballPro", score: 38, sport: "baseball" },
        { name: "SportsQuiz", score: 35, sport: "soccer" },
      ]
      localStorage.setItem("leaderboard", JSON.stringify(mockLeaderboard))
      setLeaderboard(mockLeaderboard)
    } else {
      setLeaderboard(storedLeaderboard)
    }
  }, [])

  const getSportIcon = (sport: string): string => {
    switch (sport) {
      case "basketball":
        return "🏀"
      case "football":
        return "🏈"
      case "soccer":
        return "⚽"
      case "baseball":
        return "⚾"
      default:
        return "🏆"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-400" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-300" />
      case 2:
        return <Award className="h-6 w-6 text-amber-700" />
      default:
        return (
          <span className="text-gray-400 font-mono text-lg w-6 h-6 flex items-center justify-center">{rank + 1}</span>
        )
    }
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

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 mb-4">
              LEADERBOARD
            </h1>
            <p className="text-cyan-300 text-xl">Top Sports Trivia Champions</p>
          </div>

          <Card className="bg-black/60 border border-purple-500/50 backdrop-blur-md p-6 rounded-xl">
            <div className="space-y-4">
              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-lg ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30"
                      : index === 1
                        ? "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border border-gray-400/30"
                        : index === 2
                          ? "bg-gradient-to-r from-amber-700/20 to-amber-800/10 border border-amber-700/30"
                          : "bg-black/40 border border-cyan-500/20"
                  }`}
                >
                  <div className="flex items-center justify-center w-10">{getRankIcon(index)}</div>

                  <div className="ml-4 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="font-bold text-white text-lg mb-1 sm:mb-0">
                        {player.name} <span className="text-sm text-gray-400">{getSportIcon(player.sport)}</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono font-bold text-xl ${
                            index === 0
                              ? "text-yellow-400"
                              : index === 1
                                ? "text-gray-300"
                                : index === 2
                                  ? "text-amber-700"
                                  : "text-cyan-400"
                          }`}
                        >
                          {player.score}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-gray-400">No scores yet. Be the first to play!</div>
              )}
            </div>
          </Card>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => (window.location.href = "/player-setup")}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
            >
              PLAY AGAIN
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
