import { makeShoe } from '../util'

export const NEW_GAME = 'NEW_GAME'
export const DEAL_INITIAL = 'DEAL_INITIAL'
export const DEAL_CARDS = 'DEAL_CARDS'
export const TOGGLE_COUNT = 'TOGGLE_COUNT'
export const PLAYER_CHOICE = 'PLAYER_CHOICE'

export const newGame = () => ({
  type: NEW_GAME,
  shoe: makeShoe(8), // 8-deck shoe, for example
})

export const dealInitial = () => ({
  type: DEAL_INITIAL,
})

// Decide how many extra cards to deal. Let’s pick 1:
export const deal = () => ({
  type: DEAL_CARDS,
  numCards: 1, 
})

export const toggleCount = () => ({
  type: TOGGLE_COUNT,
})

export const playerChoice = (choice) => ({
  type: PLAYER_CHOICE,
  choice, // 'split', 'hit', or 'double'
})
