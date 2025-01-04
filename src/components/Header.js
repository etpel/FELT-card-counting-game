import React from 'react'


const Header = () => (
  <header className='mb3 h5'>
    <div>♥️♠️♦️♣️️</div>
    <h1 className='m0 h2'>Hi-Lo Practice</h1>
    <p className='m0'>
      Hi-Lo is a simple card counting system used in blackjack.
      It assigns a count for every card that's played:

      A Q K J = -2

      2, 7 = 1

      3, 4, 5, 6 = 2
    </p>
  </header>
)

export default Header
