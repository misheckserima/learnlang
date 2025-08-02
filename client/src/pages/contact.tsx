import { AuthHeader } from "@/components/auth-header";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Users } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <AuthHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
                    placeholder="Tell us more about your question or how we can help..."
                  ></textarea>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                      <p className="text-gray-600 dark:text-gray-300">support@learnalanguage.com</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Live Chat</h4>
                      <p className="text-gray-600 dark:text-gray-300">Available 24/7</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get instant help with our chatbot</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Community</h4>
                      <p className="text-gray-600 dark:text-gray-300">Join our forum</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Connect with other learners</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">How much does it cost?</h4>
                    <p className="text-gray-600 dark:text-gray-300">We offer free and premium plans starting at $9.99/month with advanced features and unlimited practice.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Can I switch languages?</h4>
                    <p className="text-gray-600 dark:text-gray-300">Yes, you can learn multiple languages with one account and switch between them anytime.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Is there a mobile app?</h4>
                    <p className="text-gray-600 dark:text-gray-300">Yes, our mobile apps are available on iOS and Android app stores for learning on the go.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Do you offer certificates?</h4>
                    <p className="text-gray-600 dark:text-gray-300">Yes, we provide completion certificates that you can share on LinkedIn and with employers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Global Presence
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We're here to support learners worldwide with local offices and native-speaking teams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🇺🇸</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">New York, USA</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Headquarters</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                123 Learning Street<br />
                New York, NY 10001<br />
                +1 (555) 123-4567
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🇬🇧</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">London, UK</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">European Office</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                456 Education Lane<br />
                London EC1A 1BB<br />
                +44 20 7123 4567
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🇯🇵</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tokyo, Japan</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Asia Pacific Office</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                789 Language Building<br />
                Tokyo 100-0001<br />
                +81 3-1234-5678
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}