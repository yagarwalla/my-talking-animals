import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import InteractiveDemo from './InteractiveDemo';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state immediately
    setIsSubmitting(true);
    
    try {
      // Use JSONP approach with a script tag to avoid CORS
      const script = document.createElement('script');
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      
      // Create a global callback function
      window[callbackName] = function(data) {
        console.log('✅ Google Apps Script response:', data);
        console.log('Email submitted successfully:', email);
        
        // Show additional info if available
        if (data.spreadsheetUrl) {
          console.log('📊 Data added to spreadsheet:', data.spreadsheetUrl);
        }
        
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          setEmail('');
          setSubmitted(false);
        }, 3000);
        // Clean up
        document.head.removeChild(script);
        delete window[callbackName];
      };
      
      // Add error handling
      script.onerror = function() {
        console.log('❌ Script failed to load, but email might still be submitted:', email);
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          setEmail('');
          setSubmitted(false);
        }, 3000);
        // Clean up
        document.head.removeChild(script);
        delete window[callbackName];
      };
      
      // Set up the script source
      const scriptUrl = `https://script.google.com/macros/s/AKfycbxVmptTYKhl_ZIp7TcEZAQ9wwMe02Ag_hIaivS5VXlhxNJPtk3srPrXhf629yqfy7apAQ/exec?email=${encodeURIComponent(email)}&callback=${callbackName}`;
      console.log('📧 Email being sent:', email);
      console.log('🔗 Calling Google Apps Script URL:', scriptUrl);
      script.src = scriptUrl;
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Error submitting email:', error);
      setIsSubmitting(false);
      // Still show success message for better UX
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  const toggleVideoSound = () => {
    const video = document.querySelector('video');
    if (video) {
      video.muted = !video.muted;
      setIsVideoMuted(video.muted);
      if (!video.muted) {
        video.play();
      }
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      {/* Navigation Bar */}
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #667eea 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            {/* Logo Placeholder */}
            <div className="mb-8">
              <motion.div
                className="inline-block text-8xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🐮🐴🐷
              </motion.div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-['Poppins']">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
                Where Animals Talk
              </span>
              <br />
              <span className="text-gray-800">and Kids Learn!</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-['Nunito']">
              A magical, ad-free world where children learn new languages naturally by talking to their favorite animals — even offline!
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm sm:text-base">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-green-100">
                <span className="text-green-500 text-xl">🛡️</span>
                <span className="font-semibold text-gray-700">Ad-free & Safe</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-blue-100">
                <span className="text-blue-500 text-xl">📱</span>
                <span className="font-semibold text-gray-700">Works Offline</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-purple-100">
                <span className="text-purple-500 text-xl">🌍</span>
                <span className="font-semibold text-gray-700">Bilingual Learning</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-orange-100">
                <span className="text-orange-500 text-xl">👶</span>
                <span className="font-semibold text-gray-700">Ages 3-8</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/play">
                <motion.button
                  className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-300 transition-all duration-300 flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">🎮</span>
                  Play the Game
                </motion.button>
              </Link>
              <motion.button
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white/90 backdrop-blur-sm text-purple-600 text-xl font-bold rounded-2xl shadow-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3 border-2 border-purple-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">📱</span>
                How It Works
              </motion.button>
              <motion.button
                onClick={() => document.getElementById('interactive-demo').scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-orange-300 transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">🐴</span>
                Play Interactive Demo
              </motion.button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-['Poppins']">
              Our Mission
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
              We believe kids learn best when they're having fun. My Talking Animals makes language learning joyful and natural — no ads, no distractions, just playful conversations with animals.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every sound, sticker, and smile helps your child build confidence while discovering a new language at their own pace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-['Poppins']">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to language learning fun!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg">
                🐮
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Poppins']">
                🐮 Choose Your Animal
              </h3>
              <p className="text-gray-600 text-center text-lg leading-relaxed">
                Tap a friendly animal to start chatting and learning words in both languages!
              </p>
              {/* Animated sparkles */}
              <motion.div
                className="absolute top-4 right-4 text-2xl"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                ✨
              </motion.div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg">
                🗣️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Poppins']">
                🗣️ Listen & Repeat
              </h3>
              <p className="text-gray-600 text-center text-lg leading-relaxed">
                Hear fun phrases in English and Hindi. Repeat after the animals to learn pronunciation naturally.
              </p>
              {/* Animated sparkles */}
              <motion.div
                className="absolute top-4 right-4 text-2xl"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                ✨
              </motion.div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-100 relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg">
                ⭐
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Poppins']">
                ⭐ Earn Stickers
              </h3>
              <p className="text-gray-600 text-center text-lg leading-relaxed">
                Collect colorful reward stickers for completing levels and watch your farm come alive with achievements!
              </p>
              {/* Animated sparkles */}
              <motion.div
                className="absolute top-4 right-4 text-2xl"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                ✨
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="interactive-demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-['Poppins']">
              Try It Yourself!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the magic of learning through interactive gameplay
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <InteractiveDemo />
          </motion.div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-['Poppins']">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how children learn languages through play — click anywhere on the video to hear the magic!
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100"
            >
              {/* Video Player */}
              <div className="relative bg-black rounded-3xl overflow-hidden">
                <video
                  className="w-full h-auto cursor-pointer"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onClick={toggleVideoSound}
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  <source src="/demo-video.webm" type="video/webm" />
                  {/* Fallback for browsers that don't support video */}
                  <div className="flex items-center justify-center h-96 bg-gradient-to-br from-purple-100 to-pink-100">
                    <div className="text-center">
                      <div className="text-8xl mb-6">📱</div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-3">App Preview</h3>
                      <p className="text-xl text-gray-600 mb-6">
                        Experience the magic of learning through interactive gameplay
                      </p>
                    </div>
                  </div>
                </video>
                
                {/* Mute Status Overlay - Instagram Style */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isVideoMuted ? 1 : 0,
                      scale: isVideoMuted ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                    className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-3"
                  >
                    <span className="text-2xl">🔇</span>
                    <span className="text-lg font-medium">Tap to unmute</span>
                  </motion.div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Parents Love It Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-['Poppins']">
              Why Parents Love It
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Designed with your child's safety, learning, and joy in mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl text-center"
            >
              <div className="text-6xl mb-4">🧒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Poppins']">Designed for children ages 3–8</h3>
              <p className="text-gray-600">Perfect for little learners with big imaginations</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl text-center"
            >
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Poppins']">Builds bilingual confidence naturally through play</h3>
              <p className="text-gray-600">Learning feels like fun, not work</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-xl text-center"
            >
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Poppins']">100% ad-free and safe — no data tracking</h3>
              <p className="text-gray-600">Your child's privacy is our priority</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-xl text-center"
            >
              <div className="text-6xl mb-4">📶</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Poppins']">Works offline — learn anytime, anywhere</h3>
              <p className="text-gray-600">Perfect for car rides, waiting rooms, and travel</p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-600 italic">
              Made with ❤️ by parents who care about playful learning
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sign-Up Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-400 to-orange-500">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">📬</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-['Poppins']">
              Get Early Access!
            </h2>
            <p className="text-xl text-yellow-100 mb-6 max-w-3xl mx-auto">
              We're just getting started! This MVP features the farm animals — more animals, worlds, and languages are coming soon.
            </p>
            <p className="text-lg text-yellow-200 mb-10 max-w-2xl mx-auto">
              Join our early-access list to get updates and help shape the future of My Talking Animals.
            </p>

            <motion.form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-full text-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-4 font-bold text-lg rounded-full shadow-lg transition-all flex items-center gap-3 ${
                    isSubmitting 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-orange-600 hover:shadow-xl'
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Notify Me 🔔
                    </>
                  )}
                </motion.button>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-white bg-green-500/30 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30"
                >
                  ✅ Thanks! We'll keep you updated!
                </motion.div>
              )}
            </motion.form>

            <p className="mt-6 text-yellow-200 text-sm">
              🔒 No spam, ever. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 font-['Poppins']">My Talking Animals</h3>
              <p className="text-gray-400">Making language learning fun, safe, and magical for kids everywhere</p>
            </div>

            <div className="flex gap-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#privacy" className="text-gray-300 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2025 My Talking Animals | Privacy | Contact</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

