/* File: ./src/components/Game.js */
import React from 'react'
import Footer from './Footer'
import Header from './Header'
import { strategy, interpretDeviationCell, getCellStyle } from '../util'

/**
 * We assume you have both Running Count (RC) and True Count (TC) in your Redux state.
 * For example, game.count = RC, game.trueCount = TC.
 *
 * This helper re-renders the 3 sub-tables: pairSplitting, softTotals, hardTotals.
 * Each table has 10 columns (2..10, plus A).
 * The row data is read from the "strategy" object in ../util.
 * We interpret each cell with interpretDeviationCell(..., trueCount).
 * Then color it with getCellStyle(...).
 */

class StrategyTable extends React.Component {
  renderSubtable(tableData, rowKeys, tableTitle, renderRowLabel) {
    // We'll use columns [2,3,4,5,6,7,8,9,10,'A'] => 10 columns
    // In the strategy object, each row is an array of length 10
    const dealerLabels = ['2','3','4','5','6','7','8','9','10','A']
    const { trueCount } = this.props

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h3>{tableTitle}</h3>
        <table style={{ borderCollapse:'collapse', border:'1px solid #ccc' }}>
          <thead>
            <tr>
              <th style={{ padding:'4px', border:'1px solid #ccc' }}></th>
              {dealerLabels.map((lbl, idx) => (
                <th key={idx} style={{ padding:'4px', border:'1px solid #ccc' }}>{lbl}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map(rk => {
              const rowData = tableData[rk]
              return (
                <tr key={rk}>
                  <td style={{ padding:'4px', border:'1px solid #ccc', fontWeight:'bold' }}>
                    {renderRowLabel(rk)}
                  </td>
                  {rowData.map((cell, colIndex) => {
                    const finalAction = interpretDeviationCell(cell, trueCount)
                    let value = typeof cell !== 'object'? cell: cell[0]
                    const styleObj = {
                      ...getCellStyle(finalAction),
                      border: '1px solid #ccc',
                      padding:'4px'
                    }
                    return (
                      <td key={colIndex} style={styleObj}>
                        {value}
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

  render() {
    const { trueCount } = this.props

    // We'll get the row keys for each sub-object:
    // For pairSplitting, keys might be 1,10,9, etc.
    const pairKeys = Object.keys(strategy.pairSplitting).map(n=>parseInt(n,10)).sort((a,b)=>a-b)
    // For softTotals/hardTotals, they might be numeric 10,9,8, etc.
    const softKeys = Object.keys(strategy.softTotals).map(n=>parseInt(n,10)).sort((a,b)=>b-a)
    const hardKeys = Object.keys(strategy.hardTotals).map(n=>parseInt(n,10)).sort((a,b)=>b-a)

    // Now build each table
    const pairSplittingTable = this.renderSubtable(
      strategy.pairSplitting,
      pairKeys,
      'Pair Splitting',
      rk => (rk===1 ? 'AA' : (rk===10 ? 'TT' : String(rk)))
    )

    const softTotalsTable = this.renderSubtable(
      strategy.softTotals,
      softKeys,
      'Soft Totals',
      rk => `A + ${rk}`
    )

    const hardTotalsTable = this.renderSubtable(
      strategy.hardTotals,
      hardKeys,
      'Hard Totals',
      rk => rk
    )

    return (
      <div>
        <h2>Strategy Deviation Table</h2>
        <p>True Count = {trueCount.toFixed(1)}</p>
        {pairSplittingTable}
        {softTotalsTable}
        {hardTotalsTable}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showStrategy: false
    }
  }

  toggleStrategy = () => {
    this.setState(prev => ({ showStrategy: !prev.showStrategy }))
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
      count,       // Running Count (RC)
      trueCount,   // True Count (TC)
      is_visible,
      dealerUpCard,
      playerHand,
      userResult,
    } = game

    const { showStrategy } = this.state

    return (
      <div className='mx-auto' style={{ maxWidth: 700 }}>
        <Header />

        <div className='mb3 flex flex-wrap'>
          <button
            className='btn btn-primary bg-black mr2 mb2'
            onClick={actions.newGame}
          >
            Reset (New Game)
          </button>
          
        </div>

        <div className='mb3'>
          <h3>Dealer's Upcard</h3>
          {dealerUpCard && this.renderCard(dealerUpCard)}
          <h3 className='mt3'>Player's Hand</h3>
          {playerHand.map(c => this.renderCard(c))}
        </div>

        {userResult && (
          <p className='mt2 mb3 bold'>
            {userResult}
          </p>
        )}

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
            className='btn btn-primary bg-purple mr2 mb2'
            onClick={actions.dealInitial}
          >
            Deal Cards
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
            <span className='ml2 h3 bold align-middle'>
              RC: {count} | TC: {trueCount.toFixed(1)}
            </span>          
          )}
        </div>

        <p className='h5'>
          Cards seen: {idx} ({shoe.length - idx} remaining)
        </p>

        <div className='mb3'>
          {showStrategy ? (
            <button
              className='btn btn-primary bg-darken-2'
              onClick={this.toggleStrategy}
            >
              Hide Strategy Table
            </button>
          ) : (
            <button
              className='btn btn-primary bg-navy white'
              onClick={this.toggleStrategy}
            >
              Show Strategy Table
            </button>
          )}
        </div>

        {showStrategy && (
          <StrategyTable trueCount={trueCount} />
        )}

        <Footer />
      </div>
    )
  }
}

export default Game
