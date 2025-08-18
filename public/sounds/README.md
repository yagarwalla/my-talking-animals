# Animal Sound Files

**Note: This directory is no longer used. Animal sounds are now loaded from the `farm.json` configuration.**

## Current Sound Structure

Animal sounds are now loaded from the paths defined in `public/config/farm.json`:

- **Cow**: `animals/cow/moo.mp3`
- **Pig**: `animals/pig/oink.mp3`  
- **Goat**: `animals/goat/baa.mp3`
- **Sheep**: `animals/sheep/baa.mp3`
- **Hen**: `animals/hen/cluck.mp3`
- **Horse**: `animals/horse/neigh.mp3`

## File Requirements

- **Format**: MP3
- **Location**: Place in the respective animal folders under `/public/animals/<animal_name>/`
- **Size**: Keep files small (under 1MB each) for fast loading
- **Naming**: Use the exact filenames specified in `farm.json`

## Example

When you click on a "Cow" animal card, the system will look for `/public/animals/cow/moo.mp3` as defined in the `farm.json` configuration.

## Getting Sound Files

You can find free animal sound effects from:
- FreeSound.org
- Zapsplat.com
- SoundBible.com

Or record your own animal sounds!
