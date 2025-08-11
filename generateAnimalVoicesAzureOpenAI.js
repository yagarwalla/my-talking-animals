// generateAnimalVoicesAzureOpenAI.js
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

// Azure OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.AZURE_SPEECH_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT.replace('/audio/speech?api-version=2025-03-01-preview', ''),
  defaultQuery: { 'api-version': '2025-03-01-preview' },
  defaultHeaders: { 'api-key': process.env.AZURE_SPEECH_KEY }
});

// 6 animals with unique voices & personality-based lines
const animals = [
  {
    name: "cow",
    voice: "alloy", // calm, warm
    lines: {
      en: "Hi, I'm Coco the Cow! I love eating green grass and giving fresh milk.",
      hi: "नमस्ते, मैं कूकू गाय हूँ! मुझे हरी घास खाना और ताज़ा दूध देना बहुत पसंद है।",
    },
  },
  {
    name: "pig",
    voice: "echo", // playful, bouncy
    lines: {
      en: "Oink oink! I'm Percy the Pig! I love rolling in the mud.",
      hi: "ऑइंक ऑइंक! मैं पर्सी सूअर हूँ! मुझे कीचड़ में लोटना बहुत पसंद है।",
    },
  },
  {
    name: "hen",
    voice: "fable", // chirpy, energetic
    lines: {
      en: "Cluck cluck! I'm Henny the Hen! I love pecking seeds in the yard.",
      hi: "क्लक क्लक! मैं हेनी मुर्गी हूँ! मुझे आँगन में दाने चुगना बहुत पसंद है।",
    },
  },
  {
    name: "sheep",
    voice: "onyx", // soft, gentle
    lines: {
      en: "Hello, I'm Shelly the Sheep! I love grazing under the sunshine.",
      hi: "नमस्ते, मैं शेली भेड़ हूँ! मुझे धूप में चरना बहुत पसंद है।",
    },
  },
  {
    name: "goat",
    voice: "nova", // lively, cheeky
    lines: {
      en: "Maa-maa! I'm Gogo the Goat! I love climbing on rocks.",
      hi: "मा-मा! मैं गोगो बकरी हूँ! मुझे चट्टानों पर चढ़ना बहुत पसंद है।",
    },
  },
  {
    name: "horse",
    voice: "shimmer", // strong, friendly
    lines: {
      en: "Neigh! I'm Harry the Horse! I love running across the fields.",
      hi: "हीही! मैं हैरी घोड़ा हूँ! मुझे खेतों में दौड़ना बहुत पसंद है।",
    },
  },
];

// Output directory - directly in animal folders
const outputDir = path.join("public", "animals");

async function generateAnimalVoice(animal, lang, text) {
  try {
    const folder = path.join(outputDir, animal.name);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    console.log(`🎙️ Generating ${lang.toUpperCase()} voice for ${animal.name}...`);

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: animal.voice,
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = path.join(folder, `voice_${lang}.mp3`);
    fs.writeFileSync(filename, buffer);
    
    console.log(`✅ Saved: ${filename}`);
    
  } catch (error) {
    console.error(`❌ Error for ${animal.name} (${lang}):`, error);
    
    // More detailed error information
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    } else if (error.request) {
      console.error(`   Request error:`, error.request);
    } else {
      console.error(`   Error message:`, error.message);
    }
  }
}

async function main() {
  console.log("🎙️ Starting animal voice generation with Azure OpenAI TTS...");
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`🌐 Azure OpenAI Endpoint: ${process.env.AZURE_OPENAI_ENDPOINT}`);
  
  // Check if Azure credentials are set
  if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
    console.error("❌ Missing Azure OpenAI credentials!");
    console.error("Please set AZURE_SPEECH_KEY and AZURE_OPENAI_ENDPOINT in your .env file");
    console.error("Copy .env.example to .env and fill in your actual values");
    return;
  }
  
  console.log(`🔑 API Key: ${process.env.AZURE_SPEECH_KEY.substring(0, 8)}...`);
  
  for (const animal of animals) {
    console.log(`\n🐾 Generating voices for ${animal.name}...`);
    for (const [lang, line] of Object.entries(animal.lines)) {
      console.log(`  ${lang.toUpperCase()}: "${line}"`);
      await generateAnimalVoice(animal, lang, line);
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log("\n🎉 Voice generation complete!");
  console.log("📂 Check the public/animals/ directory for generated files.");
  console.log("💡 Files are saved as MP3 format, ready to use!");
}

main();
