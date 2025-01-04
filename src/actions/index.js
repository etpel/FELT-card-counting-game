/* File: ./src/actions/index.js */
import { makeShoe } from '../util'

export const NEW_GAME = 'NEW_GAME'
export const DEAL_INITIAL = 'DEAL_INITIAL'
export const TOGGLE_COUNT = 'TOGGLE_COUNT'
export const PLAYER_CHOICE = 'PLAYER_CHOICE'

export const newGame = () => ({
  type: NEW_GAME,
  shoe: makeShoe(8),
})

export const dealInitial = () => ({
  type: DEAL_INITIAL
})

export const toggleCount = () => ({
  type: TOGGLE_COUNT,
})

export const playerChoice = (choice) => ({
  type: PLAYER_CHOICE,
  choice, // 'split', 'hit', or 'double'
})
