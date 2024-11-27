import { useStore } from '../store/gameStore';

// Helper function to save image to public directory
const saveImage = async (file, category, filename) => {
  // For now, we'll store images in the public directory
  const path = `/images/${category}/${filename}`;
  
  // If it's a URL, we'll just return the URL
  if (typeof file === 'string' && file.startsWith('http')) {
    return file;
  }

  // If it's a file, we need to save it
  // For now, we'll just return the URL since we can't directly save files in the browser
  // In a real app, this would upload to a server
  return URL.createObjectURL(file);
};

export const addCard = async (cardData) => {
  const { addCard } = useStore.getState();
  
  try {
    const imageUrl = await saveImage(
      cardData.image,
      cardData.category,
      `${cardData.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
    );

    const newCard = {
      id: Date.now(), // Simple ID generation
      ...cardData,
      image: imageUrl,
      createdAt: new Date().toISOString()
    };

    addCard(newCard);
    return newCard;
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
};

export const updateStartingCharacter = async (characterId, imageData) => {
  const { updateCharacterImage } = useStore.getState();
  
  try {
    let imageUrl;
    if (typeof imageData === 'string' && imageData.startsWith('http')) {
      imageUrl = imageData;
    } else {
      imageUrl = URL.createObjectURL(imageData);
    }

    updateCharacterImage(characterId, imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error updating character:', error);
    throw error;
  }
};

export const getCardsByCategory = (category) => {
  const { cards } = useStore.getState();
  return cards.filter(card => card.category === category);
};

export const getStartingCharacters = () => {
  const { startingCharacters } = useStore.getState();
  return startingCharacters;
};
