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
    <div className='mx-auto' style={{ maxWidth: 700 }}>
      {/* Updated header describing FELT */}
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

      {/* Toggle count & display */}
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

      {/* Footer & stats */}
      <p className='h5'>
        Cards seen: {idx} ({shoe.length - idx} remaining)
      </p>

      <Footer />
    </div>
  )
}

export default Game
