import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show a success message
    // Later, you can integrate with a real email service
    console.log('Email submitted:', email);
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
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

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-['Quicksand']">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
                Where Animals Talk
              </span>
              <br />
              <span className="text-gray-800">and Kids Learn!</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-['Nunito']">
              A magical language learning adventure where children explore, interact with talking animals, and learn new languages naturally through play.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/play">
                <motion.button
                  className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-300 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎮 Play Demo
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Video/GIF Placeholder */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-2 border-4 border-white">
                {/* Placeholder for demo video or screenshot */}
                <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🎬</div>
                    <p className="text-2xl font-semibold text-gray-700">Interactive Demo Coming Soon</p>
                    <p className="text-gray-500 mt-2">Watch the magic happen!</p>
                  </div>
                  {/* You can replace this with an actual video or animated GIF */}
                  {/* <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/demo.mp4" type="video/mp4" />
                  </video> */}
                </div>
              </div>
              {/* Decorative elements */}
              <motion.div
                className="absolute -top-6 -left-6 text-6xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-6 text-6xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                🌟
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-['Quicksand']">
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
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-orange-100"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg">
                🐮
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Quicksand']">
                Choose Your Animal
              </h3>
              <p className="text-gray-600 text-center text-lg leading-relaxed">
                Explore colorful farms, forests, and mountains. Click on your favorite animals to start the conversation!
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-100"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg">
                🗣️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Quicksand']">
                Talk & Listen
              </h3>
              <p className="text-gray-600 text-center text-lg leading-relaxed">
                Animals speak in your favorite language! Listen, repeat, and learn naturally through interactive conversations.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-100"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg">
                ⭐
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Quicksand']">
                Collect Stickers
              </h3>
              <p className="text-gray-600 text-center text-lg leading-relaxed">
                Earn fun stickers as you progress! Build your collection and unlock new areas as you master each level.
              </p>
            </motion.div>
          </div>
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
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-['Quicksand']">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how children learn languages through play
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
              {/* App Screenshot Placeholder */}
              <div className="aspect-video flex items-center justify-center p-12 bg-white/30 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-8xl mb-6">📱</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3">App Preview</h3>
                  <p className="text-xl text-gray-600 mb-6">
                    Experience the magic of learning through interactive gameplay
                  </p>
                  <Link to="/play">
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-full shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try It Now →
                    </motion.button>
                  </Link>
                </div>
                {/* You can replace this with an actual screenshot */}
                {/* <img src="/app-screenshot.png" alt="App Preview" className="w-full h-full object-cover" /> */}
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute top-10 left-10 text-5xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                🎨
              </motion.div>
              <motion.div
                className="absolute bottom-10 right-10 text-5xl"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                🎵
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sign-Up Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-['Quicksand']">
              Get Early Access to the Full Version!
            </h2>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
              Be the first to know when we launch new languages, animals, and adventures. Join our community today!
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
                  className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Notify Me 🔔
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

            <p className="mt-6 text-purple-200 text-sm">
              🔒 We respect your privacy. No spam, ever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 font-['Quicksand']">My Talking Animals</h3>
              <p className="text-gray-400">Making language learning fun for kids everywhere</p>
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
            <p>© 2025 My Talking Animals. All rights reserved. Made with ❤️ for curious minds.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

