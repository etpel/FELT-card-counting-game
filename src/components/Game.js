import React from 'react'
import Footer from './Footer'
import Header from './Header'

const Game = ({ game, actions }) => {
  const {
    shoe, idx, rand, count, is_visible,
    playerHand, dealerUpCard, recommendedAction, userResult,
  } = game

  // For the old random dealing
  const idxEnd = idx + rand
  const cards = shoe.slice(idx, idxEnd)
  const isOver = idxEnd >= shoe.length

  // --- RENDER INITIAL HANDS IF THEY EXIST ---
  const renderHand = (hand) => {
    return hand.map((c, i) => (
      <img
        key={i}
        alt={c}
        className='mr1'
        src={`${process.env.PUBLIC_URL}/img/cards/${c}.svg`}
        style={{ width: 80, height: 111 }}
      />
    ))
  }

  return (
    <div className='p3 mx-auto' style={{ maxWidth: 600 }}>
      <Header />

      {/* Show the three newly dealt cards if any */}
      <h2>Dealer's Upcard:</h2>
      {dealerUpCard && renderHand([dealerUpCard])}

      <h2>Player's Hand:</h2>
      {playerHand && renderHand(playerHand)}

      {/* Show the user result after choice */}
      {userResult && (
        <p className="mt2 mb2 bold">
          {userResult}
        </p>
      )}

      {/* NEW: Buttons for user actions (split, hit, double) */}
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

      {/* Buttons to start over, or deal initial, or old functionality */}
      <div className='mb2'>
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
          disabled={isOver}
          onClick={actions.deal}
        >
          More cards →
        </button>
      </div>

      {/* Original Count Visibility */}
      <div className='mb2'>
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

      {/* Show old or leftover stuff if you want */}
      <div className='mb3'>
        {cards.map((c, i) => (
          <img
            key={i}
            alt={c}
            className='mr1'
            src={`${process.env.PUBLIC_URL}/img/cards/${c}.svg`}
            style={{ width: 80, height: 111 }}
          />
        ))}
      </div>

      <p className='h5'>
        {isOver
          ? `Nice! You just went through ${shoe.length} cards 🎉`
          : `Cards seen: ${idxEnd} (${shoe.length - idxEnd} remaining)`
        }
      </p>

      <Footer />
    </div>
  )
}

export default Game
