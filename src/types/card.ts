export type CardRank = 'Common' | 'Rare' | 'Epic' | 'Legendary'
export type CardCategory = 'Task' | 'Battle' | 'Store' | 'Trade' | 'Starter' | 'Featured'

export interface Card {
  id: string
  name: string
  classId: string  // Changed from class to classId to match our lookup system
  skills: string[]
  starRank: number
  cardRank: CardRank
  category: CardCategory
  imageUrl: string
  power?: number
  defense?: number
  speed?: number
  price?: number
  quantity?: number
  description?: string
}
