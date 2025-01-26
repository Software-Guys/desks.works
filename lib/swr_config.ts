// lib/swr-config.tsx
import { SWRConfig } from 'swr'

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  if (!response.ok) {
    throw new Error('An error occurred while fetching the data')
  }
  return response.json()
}

export function SWRProvider({ children }) {
  return (
    <SWRConfig value={{ 
      fetcher,
      onError: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('token')
        }
      }
    }}>
      {children}
    </SWRConfig>
  )
}
