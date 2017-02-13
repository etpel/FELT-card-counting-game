export const deck = () => ([
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'CJ', 'CQ', 'CK', 'CA',
  'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DJ', 'DQ', 'DK', 'DA',
  'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'HJ', 'HQ', 'HK', 'HA',
  'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'SJ', 'SQ', 'SK', 'SA',
])

export const rand = () => ~~(Math.random() * 100)

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

export const makeShoe = (n = 6) => (
  [].concat(...[...Array(n)].map(_ => shuffle(deck())))
)
