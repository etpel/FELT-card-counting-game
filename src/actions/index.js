import { makeShoe, rand } from '../util'

export const NEW_GAME = 'NEW_GAME'
export const DEAL_CARDS = 'DEAL_CARDS'
export const TOGGLE_COUNT = 'TOGGLE_COUNT'

// NEW
export const DEAL_INITIAL = 'DEAL_INITIAL'
export const PLAYER_CHOICE = 'PLAYER_CHOICE'

export const newGame = () => ({
  type: NEW_GAME,
  shoe: makeShoe(8),
  rand: rand(),
})

export const deal = () => ({
  type: DEAL_CARDS,
  rand: rand(),
})

export const toggleCount = () => ({
  type: TOGGLE_COUNT,
})

// NEW
export const dealInitial = () => ({
  type: DEAL_INITIAL
})

// NEW
export const playerChoice = (choice) => ({
  type: PLAYER_CHOICE,
  choice, // 'split', 'hit', or 'double'
})
