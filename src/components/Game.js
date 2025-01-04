import React from 'react'
import Footer from './Footer'
import Header from './Header'

const Game = ({ game, actions }) => {
  const {
    shoe,
    idx,
    count,
    is_visible,
    playerHand,
    dealerUpCard,
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

      {/* Show result if user clicked Split/Hit/Double */}
      {userResult && (
        <p className="mt2 mb2 bold">
          {userResult}
        </p>
      )}

      {/* Buttons to start new game or deal initial 3 cards */}
      <div className='mb3'>
        <button
          className='btn btn-primary bg-black mr2'
          onClick={actions.newGame}
        >
          Reset (New Game)
        </button>
        <button
          className='btn btn-primary bg-purple'
          onClick={actions.dealInitial}
        >
          Deal Initial (2 Player, 1 Dealer)
        </button>
      </div>

      {/* Toggle count */}
      <div className='mb3'>
        <button
          className='btn btn-primary bg-red'
          onClick={actions.toggleCount}
        >
          {is_visible ? 'Hide' : 'Show'} running count
        </button>
        {is_visible && (
          <span className='ml2 h3 bold align-middle'>{count}</span>
        )}
      </div>

      {/* Move the player actions to the bottom */}
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
          className='btn btn-primary bg-orange'
          onClick={() => actions.playerChoice('double')}
        >
          Double
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
