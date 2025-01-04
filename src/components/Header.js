import React from 'react'


const Header = () => (
  <header className='mb3 h5'>
    <div>♥️♠️♦️♣️️</div>
    <h1 className='m0 h2'>Hi-Lo Practice</h1>
    <p className='m0'>
      Hi-Lo is a simple card counting system used in blackjack.
      It assigns a count for every card that's played:
      <table id="counting">
        <thead>
            <tr>
                <th style='color:#ff5d5d'>A</th>
                <th style='color:#ff5d5d'>2</th>
                <th style='color:#ff5d5d'>3</th>
                <th style='color:#ff5d5d'>4</th>
                <th style='color:#ff5d5d'>5</th>
                <th style='color:#ff5d5d'>6</th>
                <th style='color:#ff5d5d'>7</th>
                <th style='color:#ff5d5d'>8</th>
                <th style='color:#ff5d5d'>9</th>
                <th style='color:#ff5d5d'>T</th>
                <th style='color:#ff5d5d'>J</th>
                <th style='color:#ff5d5d'>Q</th>
                <th style='color:#ff5d5d'>K</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>0</td>
                <td style='color:#bb86fc'>1</td>
                <td style='color:#bb86fc'>1</td>
                <td style='color:#ff5d5d'>2</td>
                <td style='color:#ff5d5d'>2</td>
                <td style='color:#bb86fc'>1</td>
                <td style='color:#bb86fc'>1</td>
                <td>0</td>
                <td>0</td>
                <td style='color:#ff5d5d'>-2</td>
                <td style='color:#ff5d5d'>-2</td>
                <td style='color:#ff5d5d'>-2</td>
                <td style='color:#ff5d5d'>-2</td>
            </tr>
        </tbody>
    </table>
    </p>
  </header>
)

export default Header
