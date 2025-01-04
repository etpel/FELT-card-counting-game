/* File: ./src/reducers/index.js */
import {
  NEW_GAME,
  DEAL_CARDS,
  TOGGLE_COUNT,
  DEAL_INITIAL,   // NEW
  PLAYER_CHOICE,  // NEW
} from '../actions'

import { getCount, getStrategyAction } from '../util'

const init = {
  shoe: [],
  idx: 0,
  rand: 0,
  count: 0,
  is_visible: false,

  // NEW: We'll store player's cards, dealer's upcard, recommended action, and result
  playerHand: [],
  dealerUpCard: null,
  recommendedAction: null,
  userResult: null, 
}

const start = (state, action) => {
  const { shoe, rand } = action
  return {
    ...init,
    shoe,
    rand,
    count: getCount(0, shoe.slice(0, rand)), 
  }
}

const deal = (state, action) => {
  const { rand } = action
  const idx = state.idx + state.rand
  const cards = state.shoe.slice(idx, idx + rand)

  return {
    ...state,
    idx,
    rand,
    count: getCount(state.count, cards),
  }
}

// NEW: function to deal initial hands: 2 for player, 1 for dealer
const dealInitialCards = (state) => {
  const { shoe, idx } = state
  // Deal 2 to player and 1 to dealer
  const playerHand = [shoe[idx], shoe[idx + 1]]
  const dealerUpCard = shoe[idx + 2]
  const newIdx = idx + 3

  // Determine the recommended action from your getStrategyAction function
  const recommendedAction = getStrategyAction(dealerUpCard, playerHand)

  return {
    ...state,
    idx: newIdx,
    playerHand,
    dealerUpCard,
    recommendedAction,
    userResult: null, // reset
  }
}

// NEW: function to check player's choice vs recommended action
const checkPlayerChoice = (state, choice) => {
  // recommendedAction might be "S", "H", "D", or boolean for split
  // We unify "split" => "SP" or something similar
  // For this example, let's just do a simple check:
  let rec = state.recommendedAction

  // If the recommendedAction is a boolean (for splitting pairs),
  // we map that to "split" or "hit" to compare:
  let recString = ''
  if (typeof rec === 'boolean') {
    recString = rec ? 'split' : 'no_split'
  } else {
    // rec might be 'S', 'H', 'D', etc.
    // Let's map them:
    switch (rec) {
      case 'S':
        recString = 'stand'
        break
      case 'H':
        recString = 'hit'
        break
      case 'D':
        recString = 'double'
        break
      case 'SP':
        recString = 'split'
        break
      default:
        recString = 'hit'
    }
  }

  // Compare the user's choice to the recommended choice
  const isCorrect = (recString === choice)

  return {
    ...state,
    userResult: isCorrect ? 'Correct!' : `Wrong! The correct move is ${recString.toUpperCase()}.`
  }
}

// Our main reducer
const game = (state = init, action) => {
  switch (action.type) {
    case NEW_GAME:
      return start(state, action)

    case DEAL_CARDS:
      return deal(state, action)

    case TOGGLE_COUNT:
      return {
        ...state,
        is_visible: !state.is_visible,
      }

    // NEW
    case DEAL_INITIAL:
      return dealInitialCards(state)

    // NEW
    case PLAYER_CHOICE:
      return checkPlayerChoice(state, action.choice)

    default:
      return state
  }
}

export default game
