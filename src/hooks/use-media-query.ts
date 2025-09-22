'use client'

import { useState, useCallback } from 'react'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === 'undefined'

export function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = useCallback(
    (query: string): boolean => {
      if (IS_SERVER) {
        return defaultValue
      }
      return window.matchMedia(query).matches
    },
    [defaultValue],
  )

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  // Memoize the change handler to prevent unnecessary re-renders
  const handleChange = useCallback(() => {
    setMatches(getMatches(query))
  }, [query, getMatches])

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)

    // Set initial value
    setMatches(matchMedia.matches)

    // Use modern API with fallback for older browsers
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleChange)
    } else {
      // Fallback for Safari < 14
      matchMedia.addListener(handleChange)
    }

    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener('change', handleChange)
      } else {
        // Fallback for Safari < 14
        matchMedia.removeListener(handleChange)
      }
    }
  }, [query, handleChange])

  return matches
}

export type { UseMediaQueryOptions }
