# Environment Setup for Animal Speech Generation

To use the animal speech generation feature, you need to set up the following environment variables in a `.env` file in your project root:

## Required Environment Variables

Create a `.env` file in your project root with:

```bash
REACT_APP_AZURE_AI_FOUNDRY_KEY=your_azure_ai_foundry_key_here
REACT_APP_GPT_ENDPOINT=your_gpt_endpoint_url_here
REACT_APP_TTS_ENDPOINT=your_tts_endpoint_url_here
```

## How to Get These Keys

### 1. Azure AI Foundry Key
- Go to Azure Portal
- Navigate to your Azure AI Foundry resource
- Go to "Keys and Endpoint"
- Copy one of the keys

### 2. GPT Endpoint
- Copy the GPT endpoint URL from your Azure AI Foundry resource
- Example: `https://yasho-ma9rnyw8-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini`

### 3. TTS Endpoint
- Copy the TTS endpoint URL from your Azure AI Foundry resource
- Example: `https://yasho-ma9rnyw8-eastus2.cognitiveservices.azure.com/openai/deployments/tts`

## Important Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- **Restart your development server** after adding the `.env` file
- **Environment variables must start with `REACT_APP_`** in Create React App
- **The `.env` file should be in your project root** (same level as `package.json`)

## Testing

Once set up, you can test the animal speech generation by:
1. Clicking on an animal in the AnimalCard component
2. The animal sound will play immediately from the path defined in `farm.json`
3. GPT will generate a friendly line
4. TTS will convert it to speech and play it

## Sound File Structure

Animal sounds are loaded from the paths defined in `public/config/farm.json`:
- **Cow**: `animals/cow/moo.mp3`
- **Pig**: `animals/pig/oink.mp3`
- **Goat**: `animals/goat/baa.mp3`
- **Sheep**: `animals/sheep/baa.mp3`
- **Hen**: `animals/hen/cluck.mp3`
- **Horse**: `animals/horse/neigh.mp3`

Make sure these sound files exist in their respective animal folders.
