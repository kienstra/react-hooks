// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (! pokemonName) {
      return;
    }

    setState({pokemon: null, status: 'pending'})
    fetchPokemon(pokemonName)
      .then(
        pokemon => {
          setState({pokemon, status: 'resolved'})
        },
        error => {
          setState({error, status: 'rejected'})
        }
      )
  }, [pokemonName] )

  if (state.status === 'idle') {
    return 'Submit a pokemon'
  }

  if ('rejected' === state.status && state.error ) {
    throw new Error( state.error.message )
  }

  if ('pending' === state.status) {
    return <div>Searching...</div>;
  }

  return state.pokemon
    ? <PokemonDataView pokemon={state.pokemon} />
    : <PokemonInfoFallback name={pokemonName} />
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
