import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Set natural title
    document.title = "ChatKOOL";
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden max-w-full">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">ChatKOOL</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Online Chat Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">How to Chat</a>
              <a href="#safety" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Anonymous Safety</a>
            </nav>
            <Button 
              onClick={() => setLocation('/chat')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 font-bold"
              data-testid="button-header-start-chat"
            >
              Start Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 sm:pt-32 pb-12 sm:pb-20 overflow-hidden min-h-screen flex items-center max-w-full">
        {/* Animated Background Elements - Mobile Safe */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-4 sm:left-10 w-32 h-32 sm:w-64 sm:h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-4 sm:right-20 w-36 h-36 sm:w-72 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10 w-full overflow-hidden">
          {/* High CPC Ad - Above the Fold Hero */}
          <div className="w-full max-w-4xl mx-auto mb-8 flex justify-center">
            <ins className="adsbygoogle"
                 style={{display: 'block'}}
                 data-ad-client="ca-pub-5411070266437879"
                 data-ad-slot="1234567890"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
          
          <div className="text-center px-4">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight tracking-tight" data-testid="hero-title">
              <span className="block">CHAT</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-pulse">
                KOOL
              </span>
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl text-blue-600 mb-4 sm:mb-6 font-bold tracking-wide px-2" data-testid="hero-tagline">
              CONNECT WITH FILIPINO COLLEGE STUDENTS
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4" data-testid="hero-description">
              Connect with fellow college and university students across the Philippines! Share experiences, get academic help, 
              discuss campus life, and make genuine friendships. Join our vibrant student community where every conversation matters. 
              No registration needed - just jump in and start connecting!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
              <Button 
                onClick={() => setLocation('/chat')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 sm:px-16 py-4 sm:py-6 text-lg sm:text-2xl font-black rounded-full shadow-2xl transition-all duration-300 hover:shadow-orange-500/25 hover:scale-105 w-full sm:w-auto"
                data-testid="button-start-chatting"
              >
                🚀 JOIN NOW
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 px-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>100% Anonymous & safe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Instant connections</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                <span>Filipino student community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High CPC Ad - Between Hero and Features */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client="ca-pub-5411070266437879"
               data-ad-slot="2345678901"
               data-ad-format="rectangle"
               data-full-width-responsive="true"></ins>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Filipino Students Choose ChatKOOL</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of Filipino college students who connect, share experiences, and build lasting friendships 
              through meaningful conversations in our supportive community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safe & Private</h3>
              <p className="text-gray-600">
                Share your thoughts and experiences freely in a secure environment. 
                Connect with fellow students while maintaining your privacy and safety.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Connections</h3>
              <p className="text-gray-600">
                Connect instantly with fellow Filipino college students. 
                No waiting, no barriers, just genuine conversations and new friendships.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Filipino Student Community</h3>
              <p className="text-gray-600">
                Connect exclusively with fellow Filipino college and university students who understand your culture and experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* High CPC Ad - Between Features and How It Works */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client="ca-pub-5411070266437879"
               data-ad-slot="3456789012"
               data-ad-format="leaderboard"
               data-full-width-responsive="true"></ins>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Join the Student Community</h2>
            <p className="text-xl text-gray-600">
              Connect with fellow Filipino students in just 3 simple steps - no registration needed to start meaningful conversations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Username</h3>
              <p className="text-gray-600 leading-relaxed">
                Pick any username to represent yourself in our student community. No personal information required - 
                just choose a name and start connecting with fellow Filipino students.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect with Students</h3>
              <p className="text-gray-600 leading-relaxed">
                Our system instantly connects you with other Filipino college students. 
                Get paired with someone who shares your interests and is ready for genuine conversation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Meaningful Conversations</h3>
              <p className="text-gray-600 leading-relaxed">
                Begin connecting with fellow students! Share experiences, ask questions, get academic help, 
                or simply enjoy fun conversations in our supportive student community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* High CPC Ad - Between How It Works and Safety */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client="ca-pub-5411070266437879"
               data-ad-slot="4567890123"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Safe Student Community Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ChatKOOL provides a safe, respectful space for Filipino students to connect, 
              share experiences, and learn from each other in our secure community environment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Private & Secure</h3>
                  <p className="text-gray-600">Your personal information stays protected. Connect safely without revealing your identity.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Student-Only Community</h3>
                  <p className="text-gray-600">Connect only with verified Filipino college and university students.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Respectful Conversations</h3>
                  <p className="text-gray-600">Our community promotes positive, respectful dialogue among students.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Community</h3>
                <p className="text-gray-600 mb-6">
                  Thousands of Filipino students are already connecting and supporting each other on ChatKOOL
                </p>
                <Button 
                  onClick={() => setLocation('/chat')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 font-bold rounded-full"
                  data-testid="button-join-community"
                >
                  Start Your First Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High CPC Ad - Between Safety and FAQ */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client="ca-pub-5411070266437879"
               data-ad-slot="5678901234"
               data-ad-format="rectangle"
               data-full-width-responsive="true"></ins>
        </div>
      </section>

      {/* FAQ Section for Long-tail SEO */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about connecting with fellow Filipino students on ChatKOOL
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How to talk to strangers online safely?</h3>
              <p className="text-gray-600 leading-relaxed">
                ChatKOOL provides safe online chat with strangers through anonymous matching. No personal information is shared, 
                and you can end any stranger chat instantly. Our platform connects only Filipino college students for secure random chat online.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Is ChatKOOL a free random chat site?</h3>
              <p className="text-gray-600 leading-relaxed">
                Yes! ChatKOOL is completely free random chat with strangers online. No hidden fees, no premium accounts - 
                just free stranger chat for Filipino students. Start random chat online instantly without any costs.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">What makes ChatKOOL different from Omegle Philippines?</h3>
              <p className="text-gray-600 leading-relaxed">
                ChatKOOL is designed specifically for Filipino college students, creating a safer online chat environment. 
                Unlike other random chat sites, we focus on educational support and cultural connections through anonymous stranger chat.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How does random chat online matching work?</h3>
              <p className="text-gray-600 leading-relaxed">
                Our random chat system pairs you with another Filipino student online within seconds. 
                The anonymous online chat matching considers your preferences for safe stranger chat experiences.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Can I chat online with strangers from specific Philippines regions?</h3>
              <p className="text-gray-600 leading-relaxed">
                Currently, ChatKOOL connects Filipino students nationwide for random chat online. 
                Our online chat platform creates diverse connections across Philippines universities through anonymous stranger chat.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Is registration required for anonymous chat Philippines?</h3>
              <p className="text-gray-600 leading-relaxed">
                No registration needed! Start free random chat with strangers online immediately. 
                Just choose a username and begin anonymous online chat - no email, phone number, or personal details required for stranger chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the Filipino Student Community Today!
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of Filipino college students using ChatKOOL to connect, share experiences, 
            get academic help, and build lasting friendships through our secure student community.
          </p>
          <Button 
            onClick={() => setLocation('/chat')}
            className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-4 text-xl font-bold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            data-testid="button-final-cta"
          >
            Join Our Community - It's Free!
          </Button>
          <p className="text-blue-200 mt-6 text-sm">
            No registration • No personal info required • 100% Anonymous
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <h3 className="text-2xl font-bold">ChatKOOL</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                ChatKOOL - The premier free random chat with strangers online platform connecting Filipino college and university students 
                across the Philippines. Safe stranger chat, anonymous online chat, and meaningful connections through our secure random chat site.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#safety" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="/chat" className="hover:text-white transition-colors">Start Chat</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Community</h4>
              <ul className="space-y-3 text-gray-300">
                <li>Filipino College Students</li>
                <li>University Communities</li>
                <li>Academic Support</li>
                <li>Cultural Connections</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 ChatKOOL. Free random chat with strangers online platform for Filipino college students nationwide. 
              Safe anonymous stranger chat, online chat Philippines - Built with ❤️ for the Filipino student community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}