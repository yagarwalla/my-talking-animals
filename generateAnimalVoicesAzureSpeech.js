// generateAnimalVoicesAzureSpeech.js
// Standalone script to generate MP3 files for all animals using Azure Speech Services
// Based on the phrases provided in phrases.py

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

dotenv.config();

// Azure Speech Services configuration
const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY,
    process.env.AZURE_SPEECH_REGION
);

// Voice mapping for each animal with unique characteristics
// Using Azure Speech Services Indian neural voices
const voiceMapping = {
    "cow": { 
        "voice_en": "en-IN-NeerjaNeural", 
        "voice_hi": "hi-IN-SwaraNeural", 
        "pitch": "+3%",
        "rate": "slow"
    },
    "goat": { 
        "voice_en": "en-IN-PrabhatNeural", 
        "voice_hi": "hi-IN-MadhurNeural", 
        "pitch": "+6%",
        "rate": "slow"
    },
    "sheep": { 
        "voice_en": "en-IN-NeerjaNeural", 
        "voice_hi": "hi-IN-SwaraNeural", 
        "pitch": "+2%",
        "rate": "slow"
    },
    "pig": { 
        "voice_en": "en-IN-PrabhatNeural", 
        "voice_hi": "hi-IN-MadhurNeural", 
        "pitch": "-3%",
        "rate": "slow"
    },
    "hen": { 
        "voice_en": "en-IN-NeerjaNeural", 
        "voice_hi": "hi-IN-SwaraNeural", 
        "pitch": "+5%",
        "rate": "slow"
    },
    "horse": { 
        "voice_en": "en-IN-PrabhatNeural", 
        "voice_hi": "hi-IN-MadhurNeural", 
        "pitch": "-4%",
        "rate": "slow"
    }
};

// Animal phrases from phrases.py - converted to JavaScript format
const animals = {
    "cow": {
        "level1": {
            "en-hi": "Hi, I am a cow. I am called गाय in Hindi. Can you say गाय?",
            "hi-en": "नमस्ते, मैं गाय हूँ। अंग्रेज़ी में मुझे 'cow' कहा जाता है। क्या आप 'cow' बोल सकते हो?"
        },
        "level2": {
            "en-hi": "I love eating green grass. In Hindi, grass is called घास. Can you say घास?",
            "hi-en": "मुझे हरी घास खाना बहुत पसंद है। अंग्रेज़ी में इसे 'grass' कहते हैं। क्या आप 'grass' बोल सकते हो?"
        },
        "level3": {
            "en-hi": "I live on farms and give us milk. In Hindi, milk is called दूध. Can you say दूध?",
            "hi-en": "मैं खेतों में रहती हूँ और हमें दूध देती हूँ। अंग्रेज़ी में दूध को 'milk' कहते हैं। क्या आप 'milk' बोल सकते हो?"
        },
        "level4": {
            "en-hi": "Did you know? Cows are gentle animals that help farmers. In Hindi, farmer is किसान. Can you say किसान?",
            "hi-en": "क्या आप जानते हैं? गायें किसानों की मदद करती हैं। अंग्रेज़ी में किसान को 'farmer' कहते हैं। क्या आप 'farmer' बोल सकते हो?"
        },
        "level5": {
            "en-hi": "Did you know? Cows can walk upstairs but not downstairs. In Hindi, stairs are called सीढ़ियाँ. Can you say सीढ़ियाँ?",
            "hi-en": "क्या आप जानते हैं? गाय ऊपर सीढ़ियाँ चढ़ सकती है लेकिन नीचे नहीं उतर सकती। अंग्रेज़ी में सीढ़ियाँ को 'stairs' कहते हैं। क्या आप 'stairs' बोल सकते हो?"
        }
    },
    "goat": {
        "level1": {
            "en-hi": "Hi, I am a goat. I am called बकरी in Hindi. Can you say बकरी?",
            "hi-en": "नमस्ते, मैं बकरी हूँ। अंग्रेज़ी में मुझे 'goat' कहा जाता है। क्या आप 'goat' बोल सकते हो?"
        },
        "level2": {
            "en-hi": "I love to eat leaves. In Hindi, leaves are called पत्ते. Can you say पत्ते?",
            "hi-en": "मुझे पत्ते खाना बहुत पसंद है। अंग्रेज़ी में पत्ते को 'leaves' कहते हैं। क्या आप 'leaves' बोल सकते हो?"
        },
        "level3": {
            "en-hi": "I live on farms and give us milk too. In Hindi, milk is called दूध. Can you say दूध?",
            "hi-en": "मैं भी खेतों में रहती हूँ और दूध देती हूँ। अंग्रेज़ी में दूध को 'milk' कहते हैं। क्या आप 'milk' बोल सकते हो?"
        },
        "level4": {
            "en-hi": "Fun fact! Goats are great climbers. In Hindi, climber is called पर्वतारोही. Can you say पर्वतारोही?",
            "hi-en": "मज़ेदार तथ्य! बकरियाँ बहुत अच्छी चढ़ाई करती हैं। अंग्रेज़ी में पर्वतारोही को 'climber' कहते हैं। क्या आप 'climber' बोल सकते हो?"
        },
        "level5": {
            "en-hi": "Fun fact! Goats have rectangular pupils in their eyes. In Hindi, eyes are called आँखें. Can you say आँखें?",
            "hi-en": "मज़ेदार तथ्य! बकरियों की आँखों की पुतलियाँ आयताकार होती हैं। अंग्रेज़ी में आँखें को 'eyes' कहते हैं। क्या आप 'eyes' बोल सकते हो?"
        }
    },
    "sheep": {
        "level1": {
            "en-hi": "Hi, I am a sheep. I am called भेड़ in Hindi. Can you say भेड़?",
            "hi-en": "नमस्ते, मैं भेड़ हूँ। अंग्रेज़ी में मुझे 'sheep' कहा जाता है। क्या आप 'sheep' बोल सकते हो?"
        },
        "level2": {
            "en-hi": "I love eating grass. In Hindi, grass is called घास. Can you say घास?",
            "hi-en": "मुझे घास खाना बहुत पसंद है। अंग्रेज़ी में घास को 'grass' कहते हैं। क्या आप 'grass' बोल सकते हो?"
        },
        "level3": {
            "en-hi": "People use my wool to make warm clothes. In Hindi, wool is called ऊन. Can you say ऊन?",
            "hi-en": "मेरी ऊन से कपड़े बनाए जाते हैं। अंग्रेज़ी में ऊन को 'wool' कहते हैं। क्या आप 'wool' बोल सकते हो?"
        },
        "level4": {
            "en-hi": "Fun fact! Sheep can recognize faces. In Hindi, face is called चेहरा. Can you say चेहरा?",
            "hi-en": "मज़ेदार तथ्य! भेड़ चेहरों को पहचान सकती हैं। अंग्रेज़ी में चेहरा को 'face' कहते हैं। क्या आप 'face' बोल सकते हो?"
        },
        "level5": {
            "en-hi": "Sheep can remember other sheep and people for years. In Hindi, years are called साल. Can you say साल?",
            "hi-en": "भेड़ कई सालों तक दूसरे भेड़ों और लोगों को याद रख सकती हैं। अंग्रेज़ी में साल को 'years' कहते हैं। क्या आप 'years' बोल सकते हो?"
        }
    },
    "pig": {
        "level1": {
            "en-hi": "Hi, I am a pig. I am called सूअर in Hindi. Can you say सूअर?",
            "hi-en": "नमस्ते, मैं सूअर हूँ। अंग्रेज़ी में मुझे 'pig' कहा जाता है। क्या आप 'pig' बोल सकते हो?"
        },
        "level2": {
            "en-hi": "I like to eat vegetables. In Hindi, vegetables are called सब्ज़ी. Can you say सब्ज़ी?",
            "hi-en": "मुझे सब्ज़ियाँ खाना बहुत पसंद है। अंग्रेज़ी में सब्ज़ी को 'vegetables' कहते हैं। क्या आप 'vegetables' बोल सकते हो?"
        },
        "level3": {
            "en-hi": "I love to play in the mud. In Hindi, mud is called कीचड़. Can you say कीचड़?",
            "hi-en": "मुझे कीचड़ में खेलना बहुत पसंद है। अंग्रेज़ी में कीचड़ को 'mud' कहते हैं। क्या आप 'mud' बोल सकते हो?"
        },
        "level4": {
            "en-hi": "Fun fact! Pigs are very smart. In Hindi, smart is called बुद्धिमान. Can you say बुद्धिमान?",
            "hi-en": "मज़ेदार तथ्य! सूअर बहुत बुद्धिमान होते हैं। अंग्रेज़ी में बुद्धिमान को 'smart' कहते हैं। क्या आप 'smart' बोल सकते हो?"
        },
        "level5": {
            "en-hi": "Pigs love playing games and can even learn tricks. In Hindi, games are called खेल. Can you say खेल?",
            "hi-en": "सूअर खेलना बहुत पसंद करते हैं और ट्रिक्स भी सीख सकते हैं। अंग्रेज़ी में खेल को 'games' कहते हैं। क्या आप 'games' बोल सकते हो?"
        }
    },
    "hen": {
        "level1": {
            "en-hi": "Hi, I am a hen. I am called मुर्गी in Hindi. Can you say मुर्गी?",
            "hi-en": "नमस्ते, मैं मुर्गी हूँ। अंग्रेज़ी में मुझे 'hen' कहा जाता है। क्या आप 'hen' बोल सकते हो?"
        },
        "level2": {
            "en-hi": "I eat grains. In Hindi, grains are called अनाज. Can you say अनाज?",
            "hi-en": "मैं अनाज खाती हूँ। अंग्रेज़ी में अनाज को 'grains' कहते हैं। क्या आप 'grains' बोल सकते हो?"
        },
        "level3": {
            "en-hi": "I lay eggs. In Hindi, eggs are called अंडा. Can you say अंडा?",
            "hi-en": "मैं अंडे देती हूँ। अंग्रेज़ी में अंडे को 'egg' कहते हैं। क्या आप 'egg' बोल सकते हो?"
        },
        "level4": {
            "en-hi": "Fun fact! Hens can remember over 100 faces. In Hindi, remember is called याद रखना. Can you say याद रखना?",
            "hi-en": "मज़ेदार तथ्य! मुर्गियाँ 100 से अधिक चेहरों को याद रख सकती हैं। अंग्रेज़ी में याद रखना को 'remember' कहते हैं। क्या आप 'remember' बोल सकते हो?"
        },
        "level5": {
            "en-hi": "Did you know? Hens talk to their chicks even before they hatch. In Hindi, egg is called अंडा. Can you say अंडा?",
            "hi-en": "क्या आप जानते हैं? मुर्गियाँ अंडे से बाहर आने से पहले ही अपने बच्चों से बात करती हैं। अंग्रेज़ी में अंडा को 'egg' कहते हैं। क्या आप 'egg' बोल सकते हो?"
        }
    },
    "horse": {
        "level1": {
            "en-hi": "Hi, I am a horse. I am called घोड़ा in Hindi. Can you say घोड़ा?",
            "hi-en": "नमस्ते, मैं घोड़ा हूँ। अंग्रेज़ी में मुझे 'horse' कहा जाता है। क्या आप 'horse' बोल सकते हो?"
        },
        "level2": {
            "en-hi": "I love to eat hay. In Hindi, hay is called चारा. Can you say चारा?",
            "hi-en": "मुझे चारा खाना बहुत पसंद है। अंग्रेज़ी में चारा को 'hay' कहते हैं। क्या आप 'hay' बोल सकते हो?"
        },
        "level3": {
            "en-hi": "I am strong and help people travel. In Hindi, travel is called यात्रा. Can you say यात्रा?",
            "hi-en": "मैं मजबूत हूँ और यात्रा में मदद करता हूँ। अंग्रेज़ी में यात्रा को 'travel' कहते हैं। क्या आप 'travel' बोल सकते हो?"
        },
        "level4": {
            "en-hi": "Fun fact! Horses can sleep standing up. In Hindi, standing is called खड़े होकर. Can you say खड़े होकर?",
            "hi-en": "मज़ेदार तथ्य! घोड़े खड़े होकर सो सकते हैं। अंग्रेज़ी में खड़े होकर को 'standing' कहते हैं। क्या आप 'standing' बोल सकते हो?"
        },
        "level5": {
            "en-hi": "Fun fact! Horses can run shortly after they are born. In Hindi, run is called दौड़ना. Can you say दौड़ना?",
            "hi-en": "मज़ेदार तथ्य! घोड़े जन्म के थोड़ी देर बाद ही दौड़ सकते हैं। अंग्रेज़ी में दौड़ना को 'run' कहते हैं। क्या आप 'run' बोल सकते हो?"
        }
    }
};

// Output directory - directly in animal folders
const outputDir = path.join("public", "animals");

// Statistics tracking
let stats = {
    total: 0,
    success: 0,
    failed: 0,
    replaced: 0
};

async function generateAnimalVoice(animalName, level, languageDirection, text) {
    return new Promise((resolve) => {
        try {
            const animal = animals[animalName];
            if (!animal) {
                console.error(`❌ Animal ${animalName} not found in configuration`);
                resolve(false);
                return;
            }

            const voiceConfig = voiceMapping[animalName];
            if (!voiceConfig) {
                console.error(`❌ Voice configuration not found for ${animalName}`);
                resolve(false);
                return;
            }

            const folder = path.join(outputDir, animalName);
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            // Create filename following the existing pattern: {animal}_level{number}_{language_direction}.mp3
            // Convert hyphens to underscores to match farm.json configuration
            const formattedLanguageDirection = languageDirection.replace('-', '_');
            const filename = path.join(folder, `${animalName}_${level}_${formattedLanguageDirection}.mp3`);
            
            // Check if file already exists and show replacement message
            if (fs.existsSync(filename)) {
                console.log(`🔄 Replacing existing file: ${filename}`);
                stats.replaced++;
            }

            // Determine voice and language for SSML
            // Use Hindi voice for en-hi content since it handles mixed languages better
            const isEnglishFirst = languageDirection === 'en-hi';
            const voice = isEnglishFirst ? voiceConfig.voice_hi : voiceConfig.voice_hi; // Use Hindi voice for both
            const language = isEnglishFirst ? 'hi-IN' : 'hi-IN'; // Use Hindi language for both
            
            // Create SSML with proper pronunciation for mixed language content
            let processedText = text;
            
            // For en-hi files, emphasize Hindi words with proper pronunciation
            if (languageDirection === 'en-hi') {
                // Find Hindi words (Devanagari script) and wrap them with emphasis
                processedText = processedText.replace(/([ऀ-ॿ]+)/g, (match) => {
                    return `<emphasis level="strong">${match}</emphasis>`;
                });
            }
            
            // For hi-en files, emphasize English words in quotes
            if (languageDirection === 'hi-en') {
                // Find English words in single quotes and add emphasis
                processedText = processedText.replace(/'([a-zA-Z\s]+)'/g, (match, word) => {
                    return `<emphasis level="strong">'${word}'</emphasis>`;
                });
            }

            const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${language}">
  <voice name="${voice}">
    <mstts:express-as style="friendly">
      <prosody rate="${voiceConfig.rate}" pitch="${voiceConfig.pitch}">
        ${processedText}
      </prosody>
    </mstts:express-as>
  </voice>
</speak>`;

            console.log(`🎙️ Generating ${languageDirection.toUpperCase()} voice for ${animalName} ${level}...`);
            console.log(`   Voice: ${voice}`);
            console.log(`   Pitch: ${voiceConfig.pitch}, Rate: ${voiceConfig.rate}`);
            console.log(`   Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

            // Configure speech synthesis
            speechConfig.speechSynthesisVoiceName = voice;
            speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

            const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
            const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

            synthesizer.speakSsmlAsync(
                ssml,
                (result) => {
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        console.log(`✅ Saved: ${filename}`);
                        stats.success++;
                        resolve(true);
                    } else if (result.reason === sdk.ResultReason.Canceled) {
                        const cancellation = sdk.CancellationDetails.fromResult(result);
                        console.error(`❌ Error for ${animalName} ${level} (${languageDirection}): ${cancellation.reason}`);
                        if (cancellation.reason === sdk.CancellationReason.Error) {
                            console.error(`   Error details: ${cancellation.errorDetails}`);
                        }
                        stats.failed++;
                        resolve(false);
                    }
                    synthesizer.close();
                },
                (error) => {
                    console.error(`❌ Error for ${animalName} ${level} (${languageDirection}):`, error);
                    stats.failed++;
                    synthesizer.close();
                    resolve(false);
                }
            );
            
        } catch (error) {
            console.error(`❌ Error for ${animalName} ${level} (${languageDirection}):`, error.message);
            stats.failed++;
            resolve(false);
        }
    });
}

async function main() {
    console.log("🎙️ Starting animal voice generation with Azure Speech Services...");
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`🌐 Azure Speech Endpoint: ${process.env.AZURE_SPEECH_ENDPOINT}`);
    console.log(`🌍 Azure Speech Region: ${process.env.AZURE_SPEECH_REGION}`);
    
    // Check if Azure credentials are set
    if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
        console.error("❌ Missing Azure Speech Services credentials!");
        console.error("Please set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in your .env file");
        console.error("Example .env file:");
        console.error("AZURE_SPEECH_KEY=your_azure_speech_key");
        console.error("AZURE_SPEECH_REGION=your_azure_region");
        console.error("AZURE_SPEECH_ENDPOINT=https://your-resource.cognitiveservices.azure.com/");
        return;
    }
    
    console.log(`🔑 API Key: ${process.env.AZURE_SPEECH_KEY.substring(0, 8)}...`);
    
    // Calculate total files to generate
    for (const animalName of Object.keys(animals)) {
        const animal = animals[animalName];
        for (const level of Object.keys(animal)) {
            stats.total += 2; // en-hi and hi-en for each level
        }
    }
    
    console.log(`📊 Total files to generate: ${stats.total}`);
    console.log(`📊 Animals: ${Object.keys(animals).length}`);
    console.log(`📊 Levels per animal: 5`);
    console.log(`📊 Languages per level: 2 (en-hi, hi-en)`);
    console.log(`🎙️ Voice Mapping:`);
    for (const [animal, config] of Object.entries(voiceMapping)) {
        console.log(`   ${animal}: EN=${config.voice_en}, HI=${config.voice_hi}, Pitch=${config.pitch}`);
    }
    
    let currentFile = 0;
    
    for (const animalName of Object.keys(animals)) {
        const animal = animals[animalName];
        const voiceConfig = voiceMapping[animalName];
        console.log(`\n🐾 Generating voices for ${animalName} (EN: ${voiceConfig.voice_en}, HI: ${voiceConfig.voice_hi}, Pitch: ${voiceConfig.pitch})...`);
        
        for (const level of Object.keys(animal)) {
            const levelData = animal[level];
            
            for (const [languageDirection, text] of Object.entries(levelData)) {
                currentFile++;
                console.log(`\n[${currentFile}/${stats.total}] Processing ${animalName} ${level} ${languageDirection}`);
                
                await generateAnimalVoice(animalName, level, languageDirection, text);
                
                // Add a small delay between requests to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    
    console.log("\n🎉 Voice generation complete!");
    console.log("📊 Final Statistics:");
    console.log(`   ✅ Success: ${stats.success}`);
    console.log(`   ❌ Failed: ${stats.failed}`);
    console.log(`   🔄 Replaced: ${stats.replaced}`);
    console.log(`   📁 Total: ${stats.total}`);
    console.log(`📂 Check the public/animals/ directory for generated files.`);
    console.log("💡 Files are saved as MP3 format, ready to use!");
    
    if (stats.failed > 0) {
        console.log("\n⚠️  Some files failed to generate. Check the error messages above.");
        console.log("💡 You can run the script again to retry failed generations.");
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

main();
