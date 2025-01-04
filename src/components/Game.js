/* File: ./src/components/Game.js */
import React from 'react'
import Footer from './Footer'
import Header from './Header'

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
    <div className='p3 mx-auto' style={{ maxWidth: 600 }}>
      <Header />

      {/* Dealer's Upcard */}
      <h2>Dealer's Upcard:</h2>
      {dealerUpCard && renderCard(dealerUpCard)}

      {/* Player's Hand */}
      <h2>Player's Hand:</h2>
      {playerHand.map(renderCard)}

      {/* Result of "split/hit/double/stand"? */}
      {userResult && (
        <p className="mt2 mb2 bold">
          {userResult}
        </p>
      )}

      {/* Top row: New Game, Deal Initial, More Cards */}
      <div className='mb3'>
        <button
          className='btn btn-primary bg-black mr2'
          onClick={actions.newGame}
        >
          Reset (New Game)
        </button>
        <button
          className='btn btn-primary bg-purple mr2'
          onClick={actions.dealInitial}
        >
          Deal Initial (2 Player, 1 Dealer)
        </button>
        <button
          className='btn btn-primary bg-black'
          onClick={actions.deal}
        >
          More cards →
        </button>
      </div>

      {/* Toggle running count */}
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

      {/* Bottom row: Split, Hit, Double, Stand */}
      <div className='mb3'>
        <button
          className='btn btn-primary bg-blue mr2'
          onClick={() => actions.playerChoice('split')}
        >
          Split
        </button>
        <button
          className='btn btn-primary bg-green mr2'
          onClick={() => actions.playerChoice('hit')}
        >
          Hit
        </button>
        <button
          className='btn btn-primary bg-orange mr2'
          onClick={() => actions.playerChoice('double')}
        >
          Double
        </button>
        {/* NEW Stand button */}
        <button
          className='btn btn-primary bg-gray'
          onClick={() => actions.playerChoice('stand')}
        >
          Stand
        </button>
      </div>

      <p className='h5'>
        Cards seen: {idx} ({shoe.length - idx} remaining)
      </p>

      <Footer />
    </div>
  )
}

export default Game
