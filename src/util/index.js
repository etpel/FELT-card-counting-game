/* File: ./src/util/index.js */
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
  'C2','C3','C4','C5','C6','C7','C8','C9','C10','CJ','CQ','CK','CA',
  'D2','D3','D4','D5','D6','D7','D8','D9','D10','DJ','DQ','DK','DA',
  'H2','H3','H4','H5','H6','H7','H8','H9','H10','HJ','HQ','HK','HA',
  'S2','S3','S4','S5','S6','S7','S8','S9','S10','SJ','SQ','SK','SA',
])

export const makeShoe = (n = 6) => (
  [].concat(...[...Array(n)].map(_ => shuffle(deck())))
)

export const hiLo = card => {
  const val = card.slice(1)
  if (['3','4','5','6'].includes(val)) return 2
  if (['2','7'].includes(val)) return 1
  if (['10','J','Q','K','A'].includes(val)) return -2
  return 0
}

export const cardPretty = card => {
  return `${card.slice(1)}${SUITS[card[0]]}`
}

export const getCount = (init, cards) => {
  return cards.map(hiLo).reduce(add, init)
}

export const getCardValue = card => {
  const val = card.slice(1)
  if(['10','J','Q','K'].includes(val)) return 10
  if(['A'].includes(val)) return 11
  return Number(val)
}

export const getHandValue = cards => {
  let value = 0
  let isSoft = false
  cards.forEach(card => {
    const cardValue = getCardValue(card)
    value += cardValue
    if (cardValue === 11) {
      isSoft = true
    }
  })
  return [isSoft, value]
}


/**
 * strategy.pairSplitting[row] is an array of length 10, for dealer upcards 2..10, A.
 * row = numeric “pair rank” (1 for Ace, 10 for Ten, 9, 8, etc.)
 *   e.g. row=1 => A–A, row=10 => T–T, row=9 => 9–9, etc.
 * For each cell in the array:
 *   - boolean => true => "split", false => "don’t split"
 *   - OR array => [threshold, [actionIfFalse, actionIfTrue]]
 *       (If TC >= threshold => actionIfTrue; else => actionIfFalse)
 */

const pairSplitting = {
  1:  [true, true, true, true, true, true, true, true, true, true], 
       // A–A => always split vs any upcard
  10: [false, false, false, false, false, false, false, false, false, false], 
       // T–T => never split
  9:  [
    false,    // vs 2 => do not split
    [4, ['SP','S']], // vs 3 => if TC >= 4 => "S", else "SP" (example deviation)
    'SP',     // vs 4 => always split
    'SP',     // vs 5 => always split
    'SP',     // vs 6 => always split
    'SP',     // vs 7 => always split
    false,    // vs 8 => do not split
    'SP',     // vs 9 => always split
    'SP',     // vs 10 => always split
    false     // vs A => do not split
  ],
  8:  [true, true, true, true, true, true, true, true, true, true], 
       // 8–8 => always split
  7:  [
    true,  // vs 2 => split
    true,  // vs 3 => split
    true,  // vs 4 => split
    true,  // vs 5 => split
    true,  // vs 6 => split
    true,  // vs 7 => split
    false, // vs 8 => do not split
    false, // vs 9 => do not split
    false, // vs 10 => do not split
    false  // vs A  => do not split
  ],
  6:  [
    true,  // vs 2 => split
    true,  // vs 3 => split
    true,  // vs 4 => split
    true,  // vs 5 => split
    true,  // vs 6 => split
    true,  // vs 7 => split (some might differ, adjust as needed)
    false, // vs 8
    false, // vs 9
    false, // vs 10
    false  // vs A
  ],
  5:  [false, false, false, false, false, false, false, false, false, false], 
       // 5–5 => never split (some people treat 5–5 as 10)
  4:  [false, false, false, false, true, true, false, false, false, false],
       // 4–4 => example: split only vs 5 or 6
  3:  [
    true,  // vs 2 => split
    true,  // vs 3 => split
    true,  // vs 4 => split
    true,  // vs 5 => split
    true,  // vs 6 => split
    true,  // vs 7 => split
    true,  // vs 8 => split
    false, // vs 9
    false, // vs 10
    false  // vs A
  ],
  2:  [
    true,  // vs 2 => split
    true,  // vs 3 => split
    true,  // vs 4 => split
    true,  // vs 5 => split
    true,  // vs 6 => split
    true,  // vs 7 => split
    true,  // vs 8 => split
    false, // vs 9
    false, // vs 10
    false  // vs A
  ]
}

/**
 * strategy.softTotals[row] => row is the second card’s value if one card is an Ace
 *   e.g. row=10 => A+10, row=9 => A+9, etc. 
 *   Each row is an array of length 10 for dealer upcards 2..10, A.
 * Possible cell values:
 *   - string => "H","S","D", etc.
 *   - array => [threshold, [actionIfFalse, actionIfTrue]]
 */
const softTotals = {
  10: ["S","S","S","S","S","S","S","S","S","S"],  // A+10 => always stand
  9:  ["S","S","S","S","S","S","S","S","S","S"],  // A+9 => always stand
  8:  ["S","S","S",
    [1,["H","D"]],
    [1,["H","D"]],
    [0,["H","D"]],
    "S","S","S","S"],  // A+8 => normally stand, double vs 6
  7:  [
    "H",       // vs 2
    [0,["H","D"]],       // vs 3
    "D", // vs 4 => if TC >=2 => "D", else "H" (example deviation)
    "D",       // vs 5
    "D",       // vs 6
    "S",       // vs 7
    "S",       // vs 8
    "H",       // vs 9
    "H",       // vs 10
    "H"        // vs A
  ],
  6:  ["H","H","D","D","D","D","H","H","H","H"],
  5:  ["H","H","H","D","D","D","H","H","H","H"],
  4:  ["H","H","H","D","D","D","H","H","H","H"],
  3:  ["H","H","H","H","D","D","H","H","H","H"],
  2:  ["H","H","H","H","D","D","H","H","H","H"],
  1:  ["H","H","H","H","D","D","H","H","H","H"] // A+1 => same as A+2 except 1 can’t exist physically
}

/**
 * strategy.hardTotals[row] => row is the sum of your cards (2..21)
 *   Each row array has 10 columns => dealer upcards 2..10, A
 *   - "H" => hit
 *   - "S" => stand
 *   - "D" => double
 *   - array => [threshold, [actionIfFalse, actionIfTrue]]
 */
const hardTotals = {
  21: ["S","S","S","S","S","S","S","S","S","S"], // 21 => always stand
  20: ["S","S","S","S","S","S","S","S","S","S"],
  19: ["S","S","S","S","S","S","S","S","S","S"],
  18: ["S","S","S","S","S","S","S","S","S","S"],
  17: ["S","S","S","S","S","S","S","S","S","S"],
  16: [
    [3,["H","S"]], 
    "S","S","S","S","S",
    [4,["H","S"]], 
    [3,["H","S"]], 
    [2,["H","S"]], 
    [0,["H","S"]], 
  ],
  15: [
    [3,["H","S"]], 
    "S","S","S","S","S",
    [5,["H","S"]], 
    [5,["H","S"]],
    [3,["H","S"]], 
    [1,["H","S"]]
  ],
  14: ["H",
    [-1,["H","S"]], 
    "S","S","S","S","H","H","H","H"],
  13: ["H",
    [0,["H","S"]], 
    [-1,["H","S"]], 
    [-1,["H","S"]], 
    "S","S","H","H","H","H"],
  12: ["H",
    [1,["H","S"]], 
    [1,["H","S"]], 
    [0,["H","S"]], 
    [-1,["H","S"]], 
    [-1,["H","S"]], 
    "H","H","H","H"],
  11: [
    [0,["H","D"]], // vs A => if TC>=1 => double, else hit
    "D","D","D","D","D","D","D","D",[-2,["H","D"]], // vs A => if TC>=1 => double, else hit
  ],
  10: [
    [2,["H","D"]], // vs A => if TC>=1 => double, else hit
    "D","D","D","D","D",
    "D","D",
    [-1,["H","D"]], // vs A => if TC>=1 => double, else hit
    [2,["H","D"]], // vs A => if TC>=1 => double, else hit
  ],
  9:  [
    [0,["H","D"]],
    [0,["H","D"]],
    [-1,["H","D"]],
    "D","D",
    [2,["H","D"]],
    "H","H","H","H"
  ],
  8:  [
    "H","H",
    [3,["H","D"]],
    [2,["H","D"]],
    [1,["H","D"]],
    "H","H","H","H","H"
  ],
  7:  [
    "H","H","H","H","H","H","H","H","H","H"
  ],
  6:  [
    "H","H","H","H","H","H","H","H","H","H"
  ],
  5:  [
    "H","H","H","H","H","H","H","H","H","H"
  ],
  4:  [
    "H","H","H","H","H","H","H","H","H","H"
  ],
  3:  [
    "H","H","H","H","H","H","H","H","H","H"
  ],
  2:  [
    "H","H","H","H","H","H","H","H","H","H"
  ]
}

/* 
   Export the complete strategy object so you can import it in your Game.js
   or wherever you handle the logic. 
*/
export const strategy = {
  pairSplitting,
  softTotals,
  hardTotals
}

/* File: ./src/util/index.js */


/**
 * Get recommended action from the strategy tables, based on the player's hand & dealer upcard,
 * plus the current trueCount (for deviations).
 */
export function getStrategyAction(dealerUpCard, playerHand, trueCount = 0) {
  if (!dealerUpCard || playerHand.length < 2) {
    return 'H' // fallback
  }

  // 1) Identify the dealer's upcard index: 2..10,A => columns 0..9
  //    If dealerUpCard is 'C2' => upcardVal=2 => colIndex=0
  //    If 'CA' => upcardVal=11 => colIndex=9
  const upVal = getCardValue(dealerUpCard)
  // upVal=11 => Ace => colIndex=9, else => colIndex= upVal-2
  let colIndex
  if (upVal === 11) {
    colIndex = 9
  } else {
    // e.g. upVal=2 => colIndex=0, upVal=3 =>1, ..., upVal=10 =>8
    colIndex = upVal - 2
    if (colIndex < 0) colIndex = 0
    if (colIndex > 9) colIndex = 9
  }

  // 2) Check if pair
  const [first, second] = playerHand
  const firstVal = getCardValue(first)
  const secondVal = getCardValue(second)
  if (firstVal === secondVal) {
    // For pair splitting, the row key in strategy is the rank: A=>1, T=>10, etc.
    let rowKey = firstVal === 11 ? 1 : firstVal
    const rowData = strategy.pairSplitting[rowKey]
    if (!rowData) return 'H' // fallback
    // interpret the cell
    const cell = rowData[colIndex]
    return interpretDeviationCell(cell, trueCount)
  }

  // 3) If not pair, check if soft or hard
  const [isSoft, total] = getHandValue(playerHand)
  if (isSoft) {
    // rowKey => total-11. e.g. A+6 => total=17 => row=6
    const rowKey = (total - 11)
    const rowData = strategy.softTotals[rowKey]
    if (!rowData) return 'H'
    const cell = rowData[colIndex]
    return interpretDeviationCell(cell, trueCount)
  } else {
    // Hard total
    const rowKey = total
    const rowData = strategy.hardTotals[rowKey]
    if (!rowData) return 'H'
    const cell = rowData[colIndex]
    return interpretDeviationCell(cell, trueCount)
  }
}

/**
 * interpretDeviationCell: 
 * 1) if boolean => pair splitting (true => 'SP', false => '-')
 * 2) if string => "H","S","D","SP"
 * 3) if array => [thresholdValue, [actionIfFalse, actionIfTrue]]
 *    => if (TC >= thresholdValue) => actionIfTrue
 *       else => actionIfFalse
 */
export function interpretDeviationCell(cell, trueCount) {
  if (typeof cell === 'boolean') {
    return cell ? 'SP' : '-'
  }
  if (typeof cell === 'string') {
    return cell
  }
  if (Array.isArray(cell) && cell.length === 2) {
    const [thresholdValue, [actionIfFalse, actionIfTrue]] = cell
    if (trueCount >= thresholdValue) {
      return actionIfTrue
    } else {
      return actionIfFalse
    }
  }
  return ''
}

/**
 * getCellStyle: pick a background color based on final action
 */
export function getCellStyle(finalAction) {
  switch (finalAction) {
    case 'H':  return { backgroundColor: '#ccffcc' } // light green for Hit
    case 'S':  return { backgroundColor: '#dddddd' } // gray for Stand
    case 'D':  return { backgroundColor: '#ffe0b3' } // light orange for Double
    case 'SP': return { backgroundColor: '#cceeff' } // light blue for Split
    case '-':  return { backgroundColor: '#ffffff' } // white for "don't split"
    default:   return {}
  }
}
