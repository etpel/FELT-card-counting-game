import React from 'react'

const Header = () => (
  <header className='mb3 p2 border-bottom border-silver'>
    {/* Title and Suit Icons */}
    <div className='flex items-center mb2'>
      <div style={{ fontSize: '2rem', marginRight: 10 }}>♠ ♥ ♦ ♣</div>
      <h1 className='m0 h1'>FELT Card Counting Trainer</h1>
    </div>

    {/* Intro Paragraph */}
    <p className='m0'>
      This application helps you practice the <strong>FELT</strong> counting system
      for Blackjack. FELT assigns different values to each card, enabling you to track
      when the odds shift in your favor. We’ve also integrated a strategy table so you
      can see (and practice) the recommended move — <em>Split, Hit, Double, Stand</em> —
      for various player hands and dealer upcards.
    </p>

    {/* Example breakdown of FELT (You can customize) */}
    <p className='m0 mt2'>
      <strong>FELT count example</strong>: 
      <br/>• <strong>2 and 7</strong> = +1
      <br/>• <strong>3–6</strong> = +2 
      <br/>• <strong>8–9</strong> = 0 
      <br/>• <strong>10, J, Q, K, A</strong> = −2
    </p>

    <p className='m0 mt2'>
      Click <strong>Deal Initial</strong> to receive two cards and the dealer’s upcard,
      then choose the move that matches the Basic Strategy. Keep an eye on the
      <strong> running count</strong> to track your advantage as the shoe is dealt.
    </p>
  </header>
)

export default Header
