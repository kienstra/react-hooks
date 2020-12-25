// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function useLocalStorageState(initialBoard) {
  const storageKey = 'tictac';
  const [state, setState] = React.useState(() => {
    const fromStorage = window.localStorage.getItem(storageKey)
    return fromStorage
      ? JSON.parse(fromStorage)
      : {
          positions: [initialBoard],
          currentPosition: 0,
      };
  })

  const previousStorageKey = React.useRef();
  React.useEffect( () => {
    if (previousStorageKey.current !== storageKey) {
      window.localStorage.removeItem(previousStorageKey.current)
    }

    previousStorageKey.current = storageKey
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, storageKey])

  return {state, setState};
}

function Board({squares, addNewSquares}) {
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)

  /** @param int square The index of the square to select */
  function selectSquare(squareIndex) {
    if (winner || squares[squareIndex]) {
      return
    }

    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    const newSquares = [...squares]
    newSquares[squareIndex] = nextValue;
    addNewSquares(newSquares)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const getInitialSquares = () => Array(9).fill(null)
  const {state, setState} = useLocalStorageState(getInitialSquares())

  const addNewSquares = newSquares => {
    const newCurrentPosition = state.currentPosition + 1
    const newPositions = state.positions.slice(0, newCurrentPosition)

    setState({
      positions: [ ...newPositions, newSquares ],
      currentPosition: newPositions.length,
    })
  };

  const reset = initialSquares => {
    setState({
      positions: [ initialSquares ],
      currentPosition: 0,
    })
  };

  const squares = state.positions[state.currentPosition];
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)
  const handleRestart = () => reset(getInitialSquares());

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} addNewSquares={addNewSquares} />
        <button className="restart" onClick={handleRestart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {state.positions.map( ( position, index ) => {
            const isCurrent = index === state.currentPosition;
            return (
              <li key={index}>
                <button
                  disabled={isCurrent}
                  onClick={() => setState({
                    ...state,
                    currentPosition: index,
                  })}
                >
                  { 0 === index
                    ? 'Go to game start'
                    : `Go to move #${index}`
                  }
                  { isCurrent
                    ? ' (current)'
                    : null
                  }
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
