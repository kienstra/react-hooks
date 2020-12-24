// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(initialName) {
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') || initialName
  )

  React.useEffect( function() {
    window.localStorage.setItem('name', name)
  }, [name] )

  return { name, setName }
}

export default useLocalStorageState
