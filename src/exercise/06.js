// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import ErrorBoundary from '../error-boundary';

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({status: 'idle'})

  React.useEffect(() => {
    if (! pokemonName) {
      return;
    }

    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(
        pokemon => {
          setState({pokemon, status: 'resolved'})
        }
      )
      .catch(
        error => {
          setState({error, status: 'rejected'})
        }
      )
  }, [pokemonName] )

  if (! pokemonName) {
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

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
      <div className="pokemon-info-app">
        <ErrorBoundary key="pokemonName">
          <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
          <hr />
          <div className="pokemon-info">
            <PokemonInfo pokemonName={pokemonName} />
          </div>
        </ErrorBoundary>
    </div>
  )
}

export default App
