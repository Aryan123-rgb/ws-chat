"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scroll on unmount
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            TechTalk
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect, collaborate, and communicate in real-time with TechTalk - your modern chat platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="bg-blue-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Public Groups</h3>
            <p className="text-gray-400 mt-2">Join or create public communities to connect with people who share your interests</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Private Groups</h3>
            <p className="text-gray-400 mt-2">Create secure private channels for your team, friends, or family</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="bg-green-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">One-to-One Chat</h3>
            <p className="text-gray-400 mt-2">Private messaging with anyone on the platform</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 cursor-pointer"
            onClick={() => router.push('/sign-up')}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-black hover:text-white hover:bg-gray-700 text-lg px-8 py-6 cursor-pointer"
            onClick={() => router.push('/sign-in')}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
