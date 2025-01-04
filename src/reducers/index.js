import {
  NEW_GAME,
  DEAL_INITIAL,
  DEAL_CARDS,
  TOGGLE_COUNT,
  PLAYER_CHOICE,
} from '../actions'

import { getCount, getStrategyAction } from '../util'

const init = {
  shoe: [],
  idx: 0,
  count: 0,           // running count
  is_visible: false,

  dealerUpCard: null, // will store 1 card
  playerHand: [],     // will store 2 cards
  recommendedAction: null,
  userResult: null,
}

const start = (state, action) => {
  const { shoe } = action
  // Reset state, shuffle shoe is already in action.shoe
  return {
    ...init,
    shoe,
  }
}

// Deal exactly 3 cards: 1 dealer, 2 player
const dealInitialCards = (state) => {
  const { shoe, idx, count } = state
  const dealerUpCard = shoe[idx]
  const playerHand = [shoe[idx + 1], shoe[idx + 2]]
  const newIdx = idx + 3

  // Cards that were just dealt:
  const allDealt = [dealerUpCard, ...playerHand]

  // Update running count based on these 3 cards
  const newCount = getCount(count, allDealt)

  // Optionally, figure out recommended action
  const recommendedAction = getStrategyAction(dealerUpCard, playerHand)

  return {
    ...state,
    idx: newIdx,
    dealerUpCard,
    playerHand,
    recommendedAction,
    userResult: null,
    count: newCount, // updated
  }
}

// Deal “numCards” more from the shoe
const dealMoreCards = (state, numCards) => {
  const { shoe, idx, count } = state
  const cards = shoe.slice(idx, idx + numCards)
  const newIdx = idx + numCards

  // Update the running count with newly dealt cards
  const newCount = getCount(count, cards)

  return {
    ...state,
    idx: newIdx,
    count: newCount,
  }
}

// Compare user’s “split/hit/double” with recommendedAction
const checkPlayerChoice = (state, choice) => {
  let rec = state.recommendedAction
  if (!rec) {
    return {
      ...state,
      userResult: 'No hand dealt yet!',
    }
  }

  // If rec is boolean, interpret it as 'split' vs. 'no split'
  let recString = ''
  // excerpt from checkPlayerChoice in src/reducers/index.js
  switch (rec) {
    case 'SP':
      recString = 'split'
      break
    case 'H':
      recString = 'hit'
      break
    case 'S':
      recString = 'stand'   // so if recommended = 'S', we expect userChoice = 'stand'
      break
    case 'D':
      recString = 'double'
      break
    default:
      recString = 'hit'
  }


  const isCorrect = (recString === choice)

  return {
    ...state,
    userResult: isCorrect
      ? 'Correct!'
      : `Wrong! The correct move is ${recString.toUpperCase()}.`,
  }
}

const game = (state = init, action) => {
  switch (action.type) {
    case NEW_GAME:
      return start(state, action)

    case DEAL_INITIAL:
      return dealInitialCards(state)

    case DEAL_CARDS:
      // deal a certain number of extra cards (1, 2, etc.)
      return dealMoreCards(state, action.numCards)

    case TOGGLE_COUNT:
      return {
        ...state,
        is_visible: !state.is_visible,
      }

    case PLAYER_CHOICE:
      return checkPlayerChoice(state, action.choice)

    default:
      return state
  }
}

export default game
