import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Trophy, Clock, Info } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden relative">
      {/* Animated background elements */}
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

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 mb-4">
            SPORTS TRIVIA
            <span className="block text-3xl md:text-5xl mt-2">CHALLENGE</span>
          </h1>
          <p className="text-cyan-300 text-xl md:text-2xl max-w-2xl mx-auto">
            Test your sports knowledge in this futuristic trivia arena!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2 mb-12">
          <Card className="bg-black/40 border border-purple-500/50 backdrop-blur-md overflow-hidden group hover:border-purple-400 transition-all duration-300">
            <div className="p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              <Clock className="h-12 w-12 text-cyan-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Solo Challenge</h2>
              <p className="text-gray-300 mb-4">Answer as many questions as you can in 3 minutes!</p>
              <div className="text-cyan-300 flex items-center">
                <span>Start now</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 border border-green-500/50 backdrop-blur-md overflow-hidden group hover:border-green-400 transition-all duration-300">
            <div className="p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-cyan-500"></div>
              <Trophy className="h-12 w-12 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Leaderboard</h2>
              <p className="text-gray-300 mb-4">See the top 10 players and their high scores!</p>
              <div className="text-green-300 flex items-center">
                <span>View rankings</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-center mb-16">
          <Link href="/player-setup">
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-6 px-12 rounded-full text-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 group">
              START GAME
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto bg-black/40 border border-cyan-500/30 backdrop-blur-md p-6">
          <div className="flex items-start mb-4">
            <Info className="h-6 w-6 text-cyan-400 mr-2 flex-shrink-0 mt-1" />
            <h2 className="text-xl font-bold text-white">How To Play</h2>
          </div>
          <ul className="text-gray-300 space-y-2 list-disc pl-5">
            <li>Enter your name and choose your favorite sport</li>
            <li>Answer as many questions as you can in 3 minutes</li>
            <li>Basketball questions are worth 2 or 3 points</li>
            <li>Football questions score touchdowns (6 points)</li>
            <li>Soccer questions score goals (1 point each)</li>
            <li>Baseball questions can be singles, doubles, triples or home runs</li>
            <li>See if you can make it to the top of the leaderboard!</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
