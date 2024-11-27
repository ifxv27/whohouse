import { useCallback } from 'react'
import { Card } from '../types/card'
import { useStore } from '../store/gameStore'

export function useCards() {
  const { 
    cards, 
    addCard: addToStore, 
    updateCard: updateInStore, 
    deleteCard: deleteFromStore,
    classes 
  } = useStore()

  const getClassName = useCallback((classId: string) => {
    console.log('Class ID:', classId);
    console.log('Available Classes:', classes);
    const classItem = classes.find(c => c.id === classId);
    console.log('Found Class:', classItem);
    return classItem?.name || 'Unknown Class';
  }, [classes]);

  const addCard = useCallback((card: Omit<Card, 'id'>) => {
    const newCard = { 
      ...card, 
      id: Date.now().toString(),
    }
    addToStore(newCard)
  }, [addToStore])

  const updateCard = useCallback((updatedCard: Card) => {
    updateInStore(updatedCard)
  }, [updateInStore])

  const deleteCard = useCallback((id: string) => {
    deleteFromStore(id)
  }, [deleteFromStore])

  const getCardsByCategory = useCallback((category: string) => {
    return cards.filter(card => card.category === category)
  }, [cards])

  return { 
    cards, 
    addCard, 
    updateCard, 
    deleteCard, 
    getCardsByCategory,
    getClassName 
  }
}
