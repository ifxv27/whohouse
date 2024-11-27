import fs from 'fs';
import path from 'path';

export const getPublicImages = () => {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  try {
    const files = fs.readdirSync(imagesDir);
    return files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
  } catch (error) {
    console.error('Error reading images directory:', error);
    return [];
  }
};
