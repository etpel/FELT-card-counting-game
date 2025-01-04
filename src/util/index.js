const SUITS = { H: '♥', D: '♦', C: '♣', S: '♠' }

export const randBetween = (min, max) => (
  Math.floor(Math.random() * (max - min + 1) + min)
)

export const rand = () => randBetween(2, 4)

export const shuffle = arr => {
  let counter = arr.length

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter)

    counter--

    let temp = arr[counter]
    arr[counter] = arr[index]
    arr[index] = temp
  }

  return arr
}

export const add = (a, b) => a + b

export const deck = () => ([
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'CJ', 'CQ', 'CK', 'CA',
  'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DJ', 'DQ', 'DK', 'DA',
  'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'HJ', 'HQ', 'HK', 'HA',
  'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'SJ', 'SQ', 'SK', 'SA',
])



export const makeShoe = (n = 6) => (
  [].concat(...[...Array(n)].map(_ => shuffle(deck())))
)

export const hiLo = card => {
  const val = card.slice(1)
  if (['3', '4', '5', '6'].includes(val)) return 2
  if (['2', '7'].includes(val)) return 1
  if (['10', 'J', 'Q', 'K', 'A'].includes(val)) return -2
  return 0
}

export const cardPretty = card => `${card.slice(1)}${SUITS[card[0]]}`

export const getCount = (init, cards) => cards.map(hiLo).reduce(add, init)

export const strategy = {
  // Contains the optimal pair splitting strategy given the rank of the player's pair and the
  // dealer's upcard according to Basic Strategy principles. 
      //     A       2      3      4      5      6      7      8      9      10  
  "pairSplitting": {
      1:  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true],
      10: [false, false, false, false, false, false, false, false, false, false],
      9:  [false, true,  true,  true,  true,  true,  false, true,  true,  false],
      8:  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true],
      7:  [false, true,  true,  true,  true,  true,  true,  false, false, false],
      6:  [false, true, true,  true,  true,  true,  false, false, false, false],
      5:  [false, false, false, false, false, false, false, false, false, false],
      4:  [false, false, false, false, true, true, false, false, false, false],
      3:  [false, true, true, true,  true,  true,  true,  false, false, false],
      2:  [false, true, true, true,  true,  true,  true,  false, false, false]
  },

  // Contains the optimal hit/stand/double strategy given that the player has one ace and another card
  // of a certain value and the dealer's upcard according to Basic Strategy principles. 
      //    A    2    3    4    5    6    7    8    9    10
  "softTotals": {
      10: ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
      9:  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
      8:  ["S", "S", "S", "S", "S", "D", "S", "S", "S", "S"],
      7:  ["H", "H", "D", "D", "D", "D", "S", "S", "H", "H"],
      6:  ["H", "H", "D", "D", "D", "D", "H", "H", "H", "H"],
      5:  ["H", "H", "H", "D", "D", "D", "H", "H", "H", "H"],
      4:  ["H", "H", "H", "D", "D", "D", "H", "H", "H", "H"],
      3:  ["H", "H", "H", "H", "D", "D", "H", "H", "H", "H"],
      2:  ["H", "H", "H", "H", "D", "D", "H", "H", "H", "H"],
      1:  ["H", "H", "H", "H", "D", "D", "H", "H", "H", "H"]
  },

  // Contains the optimal hit/stand/double strategy for the player's cards against the dealer's upcard
  // according to Basic Strategy principles.
      //     A    2    3    4    5    6    7    8    9    10
  "hardTotals": {
      17: ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
      16: ["H", "S", "S", "S", "S", "S", "H", "H", "H", "H"],
      15: ["H", "S", "S", "S", "S", "S", "H", "H", "H", "H"],
      14: ["H", "S", "S", "S", "S", "S", "H", "H", "H", "H"],
      13: ["H", "S", "S", "S", "S", "S", "H", "H", "H", "H"],
      12: ["H", "H", "H", "S", "S", "S", "H", "H", "H", "H"],
      11: ["D", "D", "D", "D", "D", "D", "D", "D", "D", "D"],
      10: ["H", "D", "D", "D", "D", "D", "D", "D", "D", "H"],
      9:  ["H", "H", "D", "D", "D", "D", "H", "H", "H", "H"],
      8:  ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  }
}

export const getCardValue = card => {
  const val = card.slice(1)
  if(['10', 'J', 'Q', 'K'].includes(val)) return 10
  if(['A'].includes(val)) return 11
  return Number(val)
}

export const getHandValue = cards =>{
  let value = 0
  let isSoft = false
  cards.forEach(card => {
    const cardValue = getCardValue(card)
    value += cardValue
    isSoft = isSoft || (cardValue === 11)
  });
  return [isSoft, value]
}

export const getStrategyAction = (dealerUpCard, HandCards) =>{
  let dealerUpCardValue = getCardValue(dealerUpCard)
  dealerUpCardValue = dealerUpCardValue === 11 ? 1: dealerUpCardValue
  if(HandCards[0] === HandCards[1])
  {
    let CardValue = getCardValue(HandCards[0])
    CardValue = CardValue === 11? 1: CardValue
    return strategy['pairSplitting'][CardValue][dealerUpCardValue]
  }
  let HandCardsValue = getHandValue(HandCards)
  if(HandCardsValue[0]){
    HandCardsValue[1] -= 11
    return strategy['softTotals'][HandCardsValue[1]][dealerUpCardValue]
  } else{
    return strategy['hardTotals'][HandCardsValue[1]][dealerUpCardValue]
  }
}
