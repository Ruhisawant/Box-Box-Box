import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../client'
import './Home.css'

function Home() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('f1cars')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching cars:', error)
        setError('Failed to fetch cars')
        return
      }
      
      setCars(data || [])
    } catch (error) {
      console.error('Unexpected error:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Your F1 Team</h1>
        <Link to='/create' className="home-add-button">
          Add New Car
        </Link>
      </div>
      
      {error && (
        <div className="home-error-message">
          {error}
        </div>
      )}
      
      {loading ? (
        <p className="home-loading">Loading cars...</p>
      ) : cars.length === 0 ? (
        <div className="home-empty-state">
          <p className="home-empty-message">No cars added yet. Create your first F1 car!</p>
          <Link to="/create" className="home-create-button">
            Create Car
          </Link>
        </div>
      ) : (
        <ul className="car-grid">
          {cars.map(car => (
            <li key={car.id} className="car-card">
              <Link to={`/car/${car.id}`} className="car-link">
                <h2 className="car-name">{car.name}</h2>
                <p className="car-team">{car.team}</p>
                <div className="car-details">
                  <p className="car-speed">Top Speed: {car.top_speed} km/h</p>
                  <p className="car-engine">{car.engine}</p>
                </div>
              </Link>
              <div className="car-actions">
                <Link to={`/edit/${car.id}`} className="car-edit-link">
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home