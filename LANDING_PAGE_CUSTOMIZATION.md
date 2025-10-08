# 🎨 Landing Page Customization Guide

Quick reference for customizing your landing page.

---

## 🎯 Common Customizations

### 1. Change Hero Headline

**File:** `src/components/Landing.jsx`

**Find (around line 50):**
```jsx
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-['Quicksand']">
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
    Where Animals Talk
  </span>
  <br />
  <span className="text-gray-800">and Kids Learn!</span>
</h1>
```

**Replace with your text:**
```jsx
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-['Quicksand']">
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
    Your Custom Headline
  </span>
  <br />
  <span className="text-gray-800">Your Subheadline!</span>
</h1>
```

---

### 2. Change Hero Description

**Find (around line 60):**
```jsx
<p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-['Nunito']">
  A magical language learning adventure where children explore, interact with talking animals, and learn new languages naturally through play.
</p>
```

**Replace with:**
```jsx
<p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-['Nunito']">
  Your custom description here. Keep it concise and compelling!
</p>
```

---

### 3. Change CTA Button Text

**Find (around line 69):**
```jsx
<motion.button
  className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-300 transition-all duration-300"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  🎮 Play Demo
</motion.button>
```

**Customize:**
```jsx
<motion.button
  className="px-10 py-5 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-blue-300 transition-all duration-300"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  🚀 Try It Free
</motion.button>
```

**Color Options:**
- Purple to Pink: `from-purple-500 to-pink-500`
- Blue to Green: `from-blue-500 to-green-500`
- Orange to Red: `from-orange-500 to-red-500`
- Teal to Blue: `from-teal-500 to-blue-500`

---

### 4. Replace Emoji Logo with Image

**Find (around line 42):**
```jsx
<motion.div
  className="inline-block text-8xl"
  animate={{ rotate: [0, 10, -10, 0] }}
  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
>
  🐮🐴🐷
</motion.div>
```

**Replace with:**
```jsx
<motion.img
  src="/logo.svg"
  alt="My Talking Animals"
  className="w-32 h-32 mx-auto"
  animate={{ rotate: [0, 10, -10, 0] }}
  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
/>
```

---

### 5. Add Demo Video

**Find (around line 108):**
```jsx
{/* You can replace this with an actual video or animated GIF */}
{/* <video autoPlay loop muted playsInline className="w-full h-full object-cover">
  <source src="/demo.mp4" type="video/mp4" />
</video> */}
```

**Uncomment and use:**
```jsx
<video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-2xl">
  <source src="/demo.mp4" type="video/mp4" />
  Your browser does not support video.
</video>
```

---

### 6. Change "How It Works" Steps

**Find the three step cards (around lines 150-220):**

**Step 1:**
```jsx
<h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Quicksand']">
  Choose Your Animal
</h3>
<p className="text-gray-600 text-center text-lg leading-relaxed">
  Explore colorful farms, forests, and mountains...
</p>
```

**Customize each step:**
- Change the emoji (🐮, 🗣️, ⭐)
- Change the background gradient colors
- Update heading and description text

**Example:**
```jsx
<div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg">
  🎯
</div>
<h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Quicksand']">
  Your Custom Step
</h3>
<p className="text-gray-600 text-center text-lg leading-relaxed">
  Your custom description for this step.
</p>
```

---

### 7. Change Background Gradient

**Hero Section Background (line 27):**
```jsx
<div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
```

**Options:**
```jsx
// Soft pastels (current)
from-orange-50 via-blue-50 to-green-50

// Cool blues
from-blue-50 via-cyan-50 to-teal-50

// Warm sunset
from-orange-50 via-pink-50 to-purple-50

// Fresh spring
from-green-50 via-emerald-50 to-teal-50

// Royal
from-purple-50 via-pink-50 to-rose-50
```

---

### 8. Update Email Form

**Find (around line 290):**
```jsx
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  required
  className="flex-1 px-6 py-4 rounded-full text-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all"
/>
```

**Change placeholder:**
```jsx
placeholder="your@email.com"
```

**Change button text (line 300):**
```jsx
<motion.button type="submit" ...>
  Get Started 🚀
</motion.button>
```

---

### 9. Change Footer Content

**Find (around line 330):**
```jsx
<h3 className="text-2xl font-bold mb-2 font-['Quicksand']">My Talking Animals</h3>
<p className="text-gray-400">Making language learning fun for kids everywhere</p>
```

**Customize:**
```jsx
<h3 className="text-2xl font-bold mb-2 font-['Quicksand']">Your App Name</h3>
<p className="text-gray-400">Your tagline or mission statement</p>
```

**Add working links (line 338):**
```jsx
<a href="/about" className="text-gray-300 hover:text-white transition-colors">
  About
</a>
<a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
  Privacy
</a>
<a href="mailto:contact@yourdomain.com" className="text-gray-300 hover:text-white transition-colors">
  Contact
</a>
```

---

### 10. Modify Animations

**Disable an animation:**
```jsx
// Before
<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
>

// After (no animation)
<div>
```

**Slow down animations:**
```jsx
// Find transition prop
transition={{ duration: 0.6 }}

// Change to
transition={{ duration: 1.2 }}
```

**Remove all animations (disable Framer Motion):**
Replace all `<motion.div>` with `<div>` and remove animation props.

---

## 🎨 Color Themes

### Preset Color Schemes

**Option 1: Ocean Breeze**
```jsx
// Hero background
bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50

// CTA button
bg-gradient-to-r from-blue-500 to-cyan-500

// Card borders
border-blue-100, border-cyan-100, border-teal-100
```

**Option 2: Sunset Dreams**
```jsx
// Hero background
bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50

// CTA button
bg-gradient-to-r from-orange-500 to-pink-500

// Card borders
border-orange-100, border-pink-100, border-purple-100
```

**Option 3: Forest Fresh**
```jsx
// Hero background
bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50

// CTA button
bg-gradient-to-r from-green-500 to-emerald-500

// Card borders
border-green-100, border-emerald-100, border-teal-100
```

---

## 🔤 Typography Customization

### Change Font Families

**Available fonts:**
- `font-['Quicksand']` - Rounded, playful
- `font-['Nunito']` - Friendly, readable
- `font-['Poppins']` - Modern, clean

**Apply to elements:**
```jsx
// Headings
className="... font-['Quicksand']"

// Body text
className="... font-['Nunito']"

// Buttons/CTAs
className="... font-['Poppins']"
```

### Add New Fonts

**1. Update `src/index.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap');
```

**2. Update `tailwind.config.js`:**
```js
fontFamily: {
  'yourfont': ['YourFont', 'sans-serif'],
}
```

**3. Use in component:**
```jsx
className="font-['YourFont']"
```

---

## 📐 Layout Adjustments

### Change Section Spacing

**Find sections (they all have):**
```jsx
className="py-24 px-4 sm:px-6 lg:px-8"
```

**Options:**
```jsx
// More spacing
py-32 px-8

// Less spacing
py-16 px-4

// Asymmetric
pt-32 pb-16
```

### Change Max Width

**Find containers:**
```jsx
className="max-w-7xl mx-auto"
```

**Options:**
```jsx
max-w-4xl   // Narrow (768px)
max-w-5xl   // Medium (896px)
max-w-6xl   // Wide (1152px)
max-w-7xl   // Extra wide (1280px) - current
```

---

## 🎭 Add New Sections

### Add Testimonials Section

**Insert after Preview section (around line 260):**

```jsx
{/* Testimonials Section */}
<section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
      What Parents Say
    </h2>
    
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <p className="text-gray-600 mb-4">
          "My kids love learning with the talking animals!"
        </p>
        <p className="font-bold text-gray-900">- Sarah M.</p>
      </div>
      
      {/* Add more testimonial cards */}
    </div>
  </div>
</section>
```

### Add FAQ Section

```jsx
{/* FAQ Section */}
<section className="py-24 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
      Frequently Asked Questions
    </h2>
    
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="font-bold text-xl mb-2">Question here?</h3>
        <p className="text-gray-600">Answer here.</p>
      </div>
      
      {/* Add more FAQ items */}
    </div>
  </div>
</section>
```

---

## 🔗 Quick Reference

### Tailwind Classes Reference

**Gradients:**
- `bg-gradient-to-r` (left to right)
- `bg-gradient-to-br` (diagonal)
- `from-{color}-{shade} to-{color}-{shade}`

**Spacing:**
- `p-{size}` (padding all sides)
- `px-{size}` (horizontal), `py-{size}` (vertical)
- `m-{size}` (margin)

**Text:**
- `text-{size}` (xs, sm, base, lg, xl, 2xl, etc.)
- `text-{color}-{shade}`
- `font-bold`, `font-semibold`

**Responsive:**
- `sm:` (640px+)
- `md:` (768px+)
- `lg:` (1024px+)

**Interactive:**
- `hover:` (hover state)
- `focus:` (focus state)
- `active:` (active state)

---

## 💡 Pro Tips

1. **Preview Changes**: Use browser DevTools to test changes before editing code
2. **Color Picker**: Use https://tailwindcss.com/docs/customizing-colors
3. **Gradient Generator**: Use https://hypercolor.dev/
4. **Font Pairing**: Use https://fontpair.co/
5. **Backup First**: Copy `Landing.jsx` before major changes

---

## 🆘 Need Help?

### Common Issues

**Styles not updating?**
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Restart dev server (`npm start`)

**Animation not working?**
- Check console for errors
- Verify Framer Motion is installed

**Layout broken?**
- Check for typos in class names
- Ensure all `<div>` tags are properly closed

---

**Happy customizing!** 🎨

For more details, see `LANDING_PAGE_README.md`

