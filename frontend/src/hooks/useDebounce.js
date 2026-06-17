import { useState, useEffect } from 'react'

const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    // Update debounced value after the specified delay
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    
    // Cancel the timeout if value changes (also on delay change or unmount)
    // This prevents the debounced value from updating if value changes within the delay period.
    return () => clearTimeout(timer)
  }, [value, delay]) // Only re-call effect if value or delay changes
  
  return debouncedValue
}

export default useDebounce