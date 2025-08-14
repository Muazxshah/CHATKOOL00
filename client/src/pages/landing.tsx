import { useState } from "react";
import { Button } from "@/components/ui/button";
import RegistrationModal from "@/components/registration-modal";
import { University, MessageCircle, Shield, Book, Hash, Search, Settings, Send } from "lucide-react";

export default function Landing() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-inter bg-bg-light min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="https://www.chatkool.com/static/media/mainlogo.680cdbd559a984017e33.png" 
                alt="ChatKOOL Logo" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-dark-text">ChatKOOL</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-neutral-gray hover:text-primary-blue transition-colors"
                data-testid="nav-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('community')}
                className="text-neutral-gray hover:text-primary-blue transition-colors"
                data-testid="nav-community"
              >
                Community
              </button>
              <button 
                onClick={() => scrollToSection('support')}
                className="text-neutral-gray hover:text-primary-blue transition-colors"
                data-testid="nav-support"
              >
                Support
              </button>
              <Button 
                onClick={() => setIsRegistrationOpen(true)}
                className="bg-primary-blue text-white hover:bg-blue-600"
                data-testid="button-join-nav"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-blue to-accent-purple py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
                Connect with Filipino 
                <span className="text-secondary-green"> College Students</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100" data-testid="text-hero-description">
                ChatKOOL is a special place just for college and university students in the Philippines. 
                Connect, share experiences, and build friendships in our student community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setIsRegistrationOpen(true)}
                  className="bg-secondary-green text-white hover:bg-green-600 px-8 py-3 font-semibold"
                  data-testid="button-start-chatting"
                >
                  Start Chatting
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => scrollToSection('features')}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-blue px-8 py-3 font-semibold"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="College students chatting together" 
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4" data-testid="text-features-title">
              Why Choose ChatKOOL?
            </h2>
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto" data-testid="text-features-description">
              Built specifically for Filipino college students with features that matter to your academic journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-bg-light rounded-2xl p-8 text-center hover:shadow-lg transition-shadow" data-testid="card-university-communities">
              <div className="bg-primary-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <University className="text-white text-2xl" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-4">University Communities</h3>
              <p className="text-neutral-gray">Connect with students from your university and discover new perspectives from other schools across the Philippines.</p>
            </div>

            <div className="bg-bg-light rounded-2xl p-8 text-center hover:shadow-lg transition-shadow" data-testid="card-realtime-chat">
              <div className="bg-secondary-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="text-white text-2xl" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-4">Real-time Chat</h3>
              <p className="text-neutral-gray">Engage in meaningful conversations with instant messaging, study groups, and topic-based chat rooms.</p>
            </div>

            <div className="bg-bg-light rounded-2xl p-8 text-center hover:shadow-lg transition-shadow" data-testid="card-safe-environment">
              <div className="bg-accent-purple rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white text-2xl" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-4">Safe Environment</h3>
              <p className="text-neutral-gray">Age-verified community with strong moderation to ensure a safe and respectful environment for all students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Preview Section */}
      <section className="py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4" data-testid="text-chat-preview-title">
              Experience the Chat Interface
            </h2>
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto" data-testid="text-chat-preview-description">
              Clean, intuitive design that makes connecting with fellow students effortless.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto" data-testid="chat-preview-mockup">
            <div className="flex h-96 md:h-[500px]">
              {/* Sidebar */}
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-4">
                <div className="mb-6">
                  <h3 className="font-semibold text-dark-text mb-3">University Rooms</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-primary-blue text-white rounded-lg">
                      <Hash size={14} />
                      <span className="text-sm font-medium">UP Diliman</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <Hash className="text-neutral-gray" size={14} />
                      <span className="text-sm text-neutral-gray">Ateneo</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <Hash className="text-neutral-gray" size={14} />
                      <span className="text-sm text-neutral-gray">UST</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-dark-text mb-3">Study Groups</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <Book className="text-secondary-green" size={14} />
                      <span className="text-sm text-neutral-gray">Math Help</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <Book className="text-secondary-green" size={14} />
                      <span className="text-sm text-neutral-gray">CS Students</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-dark-text"># UP Diliman</h3>
                      <p className="text-sm text-neutral-gray">248 members online</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-neutral-gray hover:text-dark-text">
                        <Search size={16} />
                      </button>
                      <button className="text-neutral-gray hover:text-dark-text">
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">JD</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-dark-text text-sm">Juan Dela Cruz</span>
                        <span className="text-xs text-neutral-gray">Today at 2:30 PM</span>
                      </div>
                      <p className="text-sm text-neutral-gray">Hey everyone! Anyone here taking MATH 17 this semester?</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-secondary-green rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">MS</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-dark-text text-sm">Maria Santos</span>
                        <span className="text-xs text-neutral-gray">Today at 2:32 PM</span>
                      </div>
                      <p className="text-sm text-neutral-gray">Yes! I'm in Sir Rodriguez's class. The midterm exam is coming up next week 😅</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">AR</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-dark-text text-sm">Anna Reyes</span>
                        <span className="text-xs text-neutral-gray">Today at 2:35 PM</span>
                      </div>
                      <p className="text-sm text-neutral-gray">Anyone want to form a study group? We could meet at the lib this weekend.</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="text" 
                      placeholder="Message #UP Diliman" 
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      disabled
                      data-testid="input-message-preview"
                    />
                    <button className="bg-primary-blue text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4" data-testid="text-community-title">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto" data-testid="text-community-description">
              Connect with thousands of Filipino college students from universities nationwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="Students in university library" 
                className="rounded-xl shadow-lg w-full h-48 object-cover mb-4"
                data-testid="img-study-groups"
              />
              <h3 className="font-semibold text-dark-text">Study Groups</h3>
              <p className="text-sm text-neutral-gray">Find study partners and academic support</p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="University campus scene" 
                className="rounded-xl shadow-lg w-full h-48 object-cover mb-4"
                data-testid="img-campus-life"
              />
              <h3 className="font-semibold text-dark-text">Campus Life</h3>
              <p className="text-sm text-neutral-gray">Share experiences and campus stories</p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="Students collaborating online" 
                className="rounded-xl shadow-lg w-full h-48 object-cover mb-4"
                data-testid="img-online-community"
              />
              <h3 className="font-semibold text-dark-text">Online Community</h3>
              <p className="text-sm text-neutral-gray">Connect beyond physical boundaries</p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="College students celebrating" 
                className="rounded-xl shadow-lg w-full h-48 object-cover mb-4"
                data-testid="img-friendships"
              />
              <h3 className="font-semibold text-dark-text">Friendships</h3>
              <p className="text-sm text-neutral-gray">Build lasting connections and memories</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-blue to-accent-purple rounded-2xl p-8 text-center text-white" data-testid="cta-section">
            <h3 className="text-2xl font-bold mb-4">Ready to Join ChatKOOL?</h3>
            <p className="text-blue-100 mb-6">Start connecting with fellow Filipino college students today.</p>
            <Button 
              onClick={() => setIsRegistrationOpen(true)}
              className="bg-white text-primary-blue hover:bg-gray-100 px-8 py-3 font-semibold"
              data-testid="button-get-started"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="support" className="bg-dark-text text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="https://www.chatkool.com/static/media/mainlogo.680cdbd559a984017e33.png" 
                  alt="ChatKOOL Logo" 
                  className="h-8 w-auto"
                />
                <h3 className="text-xl font-bold">ChatKOOL</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                A special place for college and university students in the Philippines to connect, 
                share experiences, and build meaningful friendships.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li>University Rooms</li>
                <li>Study Groups</li>
                <li>Real-time Chat</li>
                <li>Safe Environment</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Help Center</li>
                <li>Community Guidelines</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 ChatKOOL. All rights reserved. Made for Filipino college students.
            </p>
          </div>
        </div>
      </footer>

      <RegistrationModal 
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
    </div>
  );
}
