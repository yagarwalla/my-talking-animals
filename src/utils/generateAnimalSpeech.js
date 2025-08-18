const generateAnimalVoice = (animalName, languageCode, azureKey, gptEndpoint, ttsEndpoint) => {
  const voices = {
    en: {
      cow: "alloy",
      goat: "echo", 
      hen: "fable",
      sheep: "onyx",
      pig: "nova",
      horse: "shimmer"
    },
    hi: {
      cow: "coral",
      goat: "verse", 
      hen: "ballad",
      sheep: "ash",
      pig: "sage", 
      horse: "aster"
    }
  };

  const getVoice = (animal, lang) => {
    return voices[lang]?.[animal] || voices.en?.cow || "alloy";
  };

  const generateText = async () => {
    const prompt = `Generate a friendly, cheerful introduction for a ${animalName} speaking to a toddler in two languages.

The response should include:
1. 1-2 sentences about the animal in ${languageCode === 'en' ? 'English' : 'Hindi'} (primary language)
2. Introduce the animal's name in ${languageCode === 'en' ? 'Hindi' : 'English'} (secondary language)
3. Encourage the user to repeat the word in the secondary language

Format: "Hi there, I am a cow, I like eating grass. I am called gaye in Hindi. मुझे हिंदी में गाय कहते हैं. Can you say gaye in Hindi?"

Tone: cheerful and warm.
Output only the complete response.`;

    const response = await fetch(`${gptEndpoint}/chat/completions?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'api-key': azureKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  };

  const generateAudio = async (text) => {
    const voice = getVoice(animalName, languageCode);
    
    console.log('🔊 TTS Request Details:', {
      endpoint: `${ttsEndpoint}/audio/speech?api-version=2025-03-01-preview`,
      voice: voice,
      text: text,
      headers: {
        'api-key': azureKey ? '***' : 'MISSING',
        'Content-Type': 'application/json'
      }
    });
    
    try {
      const response = await fetch(`${ttsEndpoint}/audio/speech?api-version=2025-03-01-preview`, {
        method: 'POST',
        headers: {
          'api-key': azureKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: text,
          model: "gpt-4o-mini-tts",
          voice: voice,
          output_format: 'mp3',
          rate: 1.0,
          pitch: 1.0
        })
      });
      
      console.log('🔊 TTS Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔊 TTS API Error:', errorText);
        throw new Error(`TTS API failed: ${response.status} ${response.statusText}`);
      }
      
      const audioBlob = await response.blob();
      console.log('🔊 TTS Audio Blob:', audioBlob.size, 'bytes');
      
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('🔊 TTS Generation Error:', error);
      throw error;
    }
  };

  return new Promise(async (resolve, reject) => {
    try {
      const text = await generateText();
      const audioUrl = await generateAudio(text);
      
      resolve({
        text: text,
        audioUrl: audioUrl
      });
    } catch (error) {
      reject(error);
    }
  });
};

export { generateAnimalVoice };
