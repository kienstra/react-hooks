// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(keyName, initialValue) {
  const [storedValue, setStoredValue] = React.useState(
    () => {
      try {
        return JSON.parse(window.localStorage.getItem(keyName)) || initialValue
      } catch (error) {
        return window.localStorage.getItem(keyName) || initialValue
      }
    }
  )

  React.useEffect( function() {
    window.localStorage.setItem(keyName, JSON.stringify(storedValue))
  }, [keyName, storedValue] )

  return { name: storedValue, setName: setStoredValue }
}

export default useLocalStorageState
