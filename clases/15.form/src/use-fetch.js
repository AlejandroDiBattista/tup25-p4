import { useQuery } from '@tanstack/react-query'

function useFetch(url) {
  const { data = [], isPending: loading } = useQuery({
    queryKey: ['fetch', url],
    queryFn: async ({ signal }) => {
      const res = await fetch(url, { signal })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      return res.json()
    },
    enabled: Boolean(url),
    staleTime: 30_000,
  })

  return { data, loading }
}

export default useFetch;