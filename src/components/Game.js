import React from 'react'
import Footer from './Footer'
import Header from './Header'
import { strategy, getCardValue, getHandValue } from '../util'


function getActionColor(action) {
  switch (action) {
    case 'SP':     // "Split"
      return '#cceeff'   // a light blue
    case 'H':      // "Hit"
      return '#ccffcc'   // a light green
    case 'D':      // "Double"
      return '#ffe0b3'   // a light orange
    case 'S':      // "Stand"
      return '#dddddd'   // a light gray
    default:
      return '#ffffff'   // white (or no color) for '-'
  }
}

// For the one highlighted cell
const HIGHLIGHT_STYLE = {
  backgroundColor: 'yellow',
  fontWeight: 'bold',
}

// Columns: dealer upcard from A..10
const dealerLabels = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10']

/**
 * figureOutTableType(dealerUpCard, playerHand)
 * returns:
 * {
 *   tableName: 'pairSplitting' | 'softTotals' | 'hardTotals',
 *   rowKey: string (for the row),
 *   colIndex: number (0..9),
 *   recommended: string (e.g. 'H','S','D','SP') or boolean for splitting
 * }
 */
function figureOutTableType(dealerUpCard, playerHand) {
  if (!dealerUpCard || playerHand.length < 2) {
    return null
  }

  // Convert dealer’s upcard to a 0..9 index in dealerLabels
  // dealerLabels = ['A','2','3','4','5','6','7','8','9','10']
  const dealerVal = getCardValue(dealerUpCard)
  //  A => 11 in getCardValue, we treat that as 1 => index 0
  let dealerIndex = (dealerVal === 11) ? 0 : (dealerVal - 1)
  if (dealerIndex < 0 || dealerIndex > 9) {
    dealerIndex = 9 // fallback if something is off
  }

  // Check if the player's 2 cards are a pair
  const firstVal = playerHand[0].slice(1)
  const secondVal = playerHand[1].slice(1)
  const isPair = (firstVal === secondVal)

  // Evaluate total
  const [isSoft, total] = getHandValue(playerHand)

  // “Recommended” can be 'H','S','D','SP','split', or boolean from your logic
  // but let's replicate enough to know which table we're in
  if (isPair) {
    // If it’s a pair, “tableName” is pairSplitting
    // rowKey is the “value” of that pair (1 for Ace, numeric otherwise)
    // For example, pair of 8 => rowKey is '8'
    let pairVal = getCardValue(playerHand[0]) // same for both
    if (pairVal === 11) pairVal = 1
    const rowKey = String(pairVal) // e.g. '1','2','8','10'
    // The recommended is from strategy.pairSplitting[rowKey][dealerIndex]
    let recommended = strategy.pairSplitting[rowKey] 
      ? strategy.pairSplitting[rowKey][dealerIndex]
      : false

    return {
      tableName: 'pairSplitting',
      rowKey,
      colIndex: dealerIndex,
      recommended, // true/false
    }
  }
  else if (isSoft) {
    // Soft totals => “softTotals”
    // rowKey is (total - 11).  E.g. A+6 => total=17 => rowKey=6
    // But if total=18 => rowKey=7, etc.
    const rowKey = String(total - 11) // e.g. '6','7','8', ...
    // recommended => strategy.softTotals[rowKey][dealerIndex]
    let recommended = strategy.softTotals[rowKey]
      ? strategy.softTotals[rowKey][dealerIndex]
      : 'H' // fallback

    return {
      tableName: 'softTotals',
      rowKey,
      colIndex: dealerIndex,
      recommended,
    }
  }
  else {
    // Hard totals => “hardTotals”
    const rowKey = String(total) // e.g. '14','10','20', ...
    let recommended = strategy.hardTotals[rowKey]
      ? strategy.hardTotals[rowKey][dealerIndex]
      : 'H'

    return {
      tableName: 'hardTotals',
      rowKey,
      colIndex: dealerIndex,
      recommended,
    }
  }
}

/**
 * StrategyTable: 
 * Renders Pair Splitting, Soft Totals, Hard Totals
 * and highlights the cell for the current player's hand + dealer upcard.
 *
 * We'll pass in dealerUpCard, playerHand from props, 
 * so we can figure out which cell to highlight.
 */
const StrategyTable = ({ dealerUpCard, playerHand }) => {
  const coords = figureOutTableType(dealerUpCard, playerHand)

  const isHighlightCell = (table, rowKey, colIdx) => {
    if (!coords) return false
    if (coords.tableName !== table) return false
    if (coords.rowKey !== rowKey) return false
    if (coords.colIndex !== colIdx) return false
    return true
  }

  const renderPairSplitting = () => {
    const pairKeys = Object.keys(strategy.pairSplitting)
    return (
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <h4>Pair Splitting</h4>
        <table className='table-light border-collapse'>
          <thead>
            <tr>
              <th>Player Pair</th>
              {dealerLabels.map(label => <th key={label}>{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {pairKeys.map(pairVal => {
              const rowData = strategy.pairSplitting[pairVal]
              return (
                <tr key={pairVal}>
                  <td>{pairVal === '1' ? 'A' : pairVal}</td>
                  {rowData.map((canSplit, i) => {
                    // "SP" if true, otherwise "-"
                    const action = canSplit ? 'SP' : '-'
                    const baseColor = getActionColor(action)
                    const highlight = isHighlightCell('pairSplitting', pairVal, i)
                      ? HIGHLIGHT_STYLE
                      : {}
                    // Merge them
                    const cellStyle = {
                      backgroundColor: baseColor,
                      ...highlight,
                    }
                    return (
                      <td key={i} style={cellStyle}>
                        {action}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const renderSoftTotals = () => {
    const softKeys = Object.keys(strategy.softTotals)
      .map(x => parseInt(x, 10))
      .sort((a, b) => b - a)
    return (
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <h4>Soft Totals</h4>
        <table className='table-light border-collapse'>
          <thead>
            <tr>
              <th>Soft Total</th>
              {dealerLabels.map(label => <th key={label}>{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {softKeys.map(sk => {
              const rowData = strategy.softTotals[sk]
              return (
                <tr key={sk}>
                  <td>{`A + ${sk}`}</td>
                  {rowData.map((action, i) => {
                    // action could be 'H','S','D'...
                    const baseColor = getActionColor(action)
                    const highlight = isHighlightCell('softTotals', String(sk), i)
                      ? HIGHLIGHT_STYLE
                      : {}
                    const cellStyle = {
                      backgroundColor: baseColor,
                      ...highlight,
                    }
                    return (
                      <td key={i} style={cellStyle}>
                        {action}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const renderHardTotals = () => {
    const hardKeys = Object.keys(strategy.hardTotals)
      .map(x => parseInt(x, 10))
      .sort((a, b) => b - a)
    return (
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <h4>Hard Totals</h4>
        <table className='table-light border-collapse'>
          <thead>
            <tr>
              <th>Hard Total</th>
              {dealerLabels.map(label => <th key={label}>{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {hardKeys.map(hk => {
              const rowData = strategy.hardTotals[hk]
              return (
                <tr key={hk}>
                  <td>{hk}</td>
                  {rowData.map((action, i) => {
                    const baseColor = getActionColor(action)
                    const highlight = isHighlightCell('hardTotals', String(hk), i)
                      ? HIGHLIGHT_STYLE
                      : {}
                    const cellStyle = {
                      backgroundColor: baseColor,
                      ...highlight,
                    }
                    return (
                      <td key={i} style={cellStyle}>
                        {action}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className='mt3 p2 border border-silver'>
      {renderPairSplitting()}
      {renderSoftTotals()}
      {renderHardTotals()}
    </div>
  )
}


// ----- CLASS COMPONENT (for React 15.x) -----

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showTable: false,
    }
  }

  toggleTable = () => {
    this.setState(prev => ({ showTable: !prev.showTable }))
  }

  renderCard(card) {
    return (
      <img
        key={card}
        alt={card}
        className='mr1'
        src={`${process.env.PUBLIC_URL}/img/cards/${card}.svg`}
        style={{ width: 80, height: 111 }}
      />
    )
  }

  render() {
    const { game, actions } = this.props
    const {
      shoe,
      idx,
      count,
      is_visible,
      dealerUpCard,
      playerHand,
      userResult,
    } = game

    const { showTable } = this.state

    return (
      <div className='mx-auto' style={{ maxWidth: 700 }}>
        <Header />

        {/* A row for dealing actions */}
        <div className='mb3 flex flex-wrap'>
          <button
            className='btn btn-primary bg-black mr2 mb2'
            onClick={actions.newGame}
          >
            Reset (New Game)
          </button>
          <button
            className='btn btn-primary bg-purple mr2 mb2'
            onClick={actions.dealInitial}
          >
            Deal Initial
          </button>
          <button
            className='btn btn-primary bg-black mb2'
            onClick={actions.deal}
          >
            More cards →
          </button>
        </div>

        {/* Dealer & Player Hands */}
        <div className='mb3'>
          <h3>Dealer's Upcard</h3>
          {dealerUpCard && this.renderCard(dealerUpCard)}

          <h3 className='mt3'>Player's Hand</h3>
          {playerHand.map(c => this.renderCard(c))}
        </div>

        {/* Show any user feedback (Correct! / Wrong! etc.) */}
        {userResult && (
          <p className="mt2 mb3 bold">
            {userResult}
          </p>
        )}

        {/* Player move buttons */}
        <div className='mb3'>
          <button
            className='btn btn-primary bg-blue mr2 mb2'
            onClick={() => actions.playerChoice('split')}
          >
            Split
          </button>
          <button
            className='btn btn-primary bg-green mr2 mb2'
            onClick={() => actions.playerChoice('hit')}
          >
            Hit
          </button>
          <button
            className='btn btn-primary bg-orange mr2 mb2'
            onClick={() => actions.playerChoice('double')}
          >
            Double
          </button>
          <button
            className='btn btn-primary bg-gray mb2'
            onClick={() => actions.playerChoice('stand')}
          >
            Stand
          </button>
        </div>

        {/* Toggle running count & display */}
        <div className='mb3'>
          <button
            className='btn btn-primary bg-red'
            onClick={actions.toggleCount}
            style={{ width: 210 }}
          >
            {is_visible ? 'Hide' : 'Show'} running count
          </button>
          {is_visible && (
            <span className='ml2 h3 bold align-middle'>{count}</span>
          )}
        </div>

        <p className='h5'>
          Cards seen: {idx} ({shoe.length - idx} remaining)
        </p>

        {/* Show/Hide Strategy Table Button */}
        <div className='mb3'>
          {showTable ? (
            <button
              className='btn btn-primary bg-darken-2'
              onClick={this.toggleTable}
            >
              Hide Strategy Table
            </button>
          ) : (
            <button
              className='btn btn-primary bg-navy white'
              onClick={this.toggleTable}
            >
              Show Strategy Table
            </button>
          )}
        </div>

        {/* If showTable is true, render StrategyTable
            passing dealerUpCard & playerHand so we can highlight the recommended cell */}
        {showTable && (
          <StrategyTable
            dealerUpCard={dealerUpCard}
            playerHand={playerHand}
          />
        )}

        <Footer />
      </div>
    )
  }
}

export default Game
