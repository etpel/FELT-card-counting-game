/* File: ./src/components/Game.js */
import React, { useState } from 'react'
import Footer from './Footer'
import Header from './Header'

// Import the strategy object from your util/index.js
import { strategy } from '../util'

// Utility to map dealer upcard indexes (0..9) to display labels (A..10)
const dealerLabels = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10']

/** 
 * A sub-component that renders the entire strategy object
 * as three separate tables: Pair Splitting, Soft Totals, Hard Totals.
 */
const StrategyTable = () => {

  // 1) Render Pair Splitting table
  //    Each row is a pair value (1,10,9,8...), each column is dealer upcard A..10
  const renderPairSplittingTable = () => {
    // Sort the keys to have them in ascending or logical order if you like:
    // For demonstration, we’ll just use Object.keys() as is.
    const rows = Object.keys(strategy.pairSplitting)

    return (
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <h4>Pair Splitting</h4>
        <table className='table-light border-collapse'>
          <thead>
            <tr>
              <th>Player Pair</th>
              {dealerLabels.map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((pairValue) => {
              const rowData = strategy.pairSplitting[pairValue]
              return (
                <tr key={pairValue}>
                  <td>{pairValue === '1' ? 'A' : pairValue}</td>
                  {rowData.map((canSplit, i) => (
                    <td key={i}>
                      {canSplit ? 'SP' : '-'}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // 2) Render Soft Totals table
  //    Key is e.g. 10,9,8,... each value is an array of 10 actions (vs A..10)
  const renderSoftTotalsTable = () => {
    const rows = Object.keys(strategy.softTotals).sort((a, b) => Number(b) - Number(a))
    // Sort descending so that 10 is first row, then 9, etc.

    return (
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <h4>Soft Totals</h4>
        <table className='table-light border-collapse'>
          <thead>
            <tr>
              <th>Soft Total</th>
              {dealerLabels.map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((softVal) => {
              const rowData = strategy.softTotals[softVal]
              return (
                <tr key={softVal}>
                  <td>A + {softVal}</td>
                  {rowData.map((action, i) => (
                    <td key={i}>{action}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // 3) Render Hard Totals table
  //    Key is e.g. 21,20,19,18,... each value is an array of 10 actions
  const renderHardTotalsTable = () => {
    const rows = Object.keys(strategy.hardTotals).sort((a, b) => Number(b) - Number(a))
    // Sort descending so highest total is first row (21 down to 2)

    return (
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <h4>Hard Totals</h4>
        <table className='table-light border-collapse'>
          <thead>
            <tr>
              <th>Hard Total</th>
              {dealerLabels.map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((hardVal) => {
              const rowData = strategy.hardTotals[hardVal]
              return (
                <tr key={hardVal}>
                  <td>{hardVal}</td>
                  {rowData.map((action, i) => (
                    <td key={i}>{action}</td>
                  ))}
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
      {renderPairSplittingTable()}
      {renderSoftTotalsTable()}
      {renderHardTotalsTable()}
    </div>
  )
}

const Game = ({ game, actions }) => {
  const {
    shoe,
    idx,
    count,
    is_visible,
    dealerUpCard,
    playerHand,
    userResult,
  } = game

  // Local state to show/hide the strategy table
  const [showTable, setShowTable] = useState(false)

  // Helper to render a single card as an <img>
  const renderCard = (card) => (
    <img
      key={card}
      alt={card}
      className='mr1'
      src={`${process.env.PUBLIC_URL}/img/cards/${card}.svg`}
      style={{ width: 80, height: 111 }}
    />
  )

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
      </div>

      {/* Dealer & Player Hands */}
      <div className='mb3'>
        <h3>Dealer's Upcard</h3>
        {dealerUpCard && renderCard(dealerUpCard)}

        <h3 className='mt3'>Player's Hand</h3>
        {playerHand.map(renderCard)}
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
      <div className='mb3'>
      <button
          className='btn btn-primary bg-purple mr2 mb2'
          onClick={actions.dealInitial}
        >
          Deal Initial
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
        {!showTable ? (
          <button
            className='btn btn-primary bg-navy white'
            onClick={() => setShowTable(true)}
          >
            Show Strategy Table
          </button>
        ) : (
          <button
            className='btn btn-primary bg-darken-2'
            onClick={() => setShowTable(false)}
          >
            Hide Strategy Table
          </button>
        )}
      </div>

      {/* If showTable is true, render the dynamic StrategyTable */}
      {showTable && <StrategyTable />}

      <Footer />
    </div>
  )
}

export default Game
