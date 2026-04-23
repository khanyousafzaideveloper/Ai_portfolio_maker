import { useState, useEffect } from "react"

export function usePortfolios(email: string) {
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPortfolios = async () => {
    if (!email) return

    setLoading(true)
    try {
      const response = await fetch(`/api/save-portfolio?email=${email}`)
      if (!response.ok) throw new Error("Failed to fetch portfolios")

      const data = await response.json()
      setPortfolios(data.data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching portfolios")
      setPortfolios([])
    } finally {
      setLoading(false)
    }
  }

  const deletePortfolio = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete portfolio")

      setPortfolios((prev) => prev.filter((p) => p.id !== id))
      return true
    } catch (err) {
      console.error("Delete error:", err)
      return false
    }
  }

  useEffect(() => {
    fetchPortfolios()
  }, [email])

  return { portfolios, loading, error, fetchPortfolios, deletePortfolio }
}
