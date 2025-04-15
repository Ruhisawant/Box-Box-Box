import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../client'
import './CarDetails.css'

function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchCar()
  }, [id])

  const fetchCar = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('f1cars')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        setError('Car not found')
        return
      }
      
      setCar(data)
    } catch (err) {
      setError('Failed to load car')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return
    }
    
    try {
      setDeleteLoading(true)
      const { error } = await supabase
        .from('f1cars')
        .delete()
        .eq('id', id)
      
      if (error) {
        setError(`Delete failed: ${error.message}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return <div className="car-details-loading">Loading car details...</div>
  }

  if (error) {
    return (
      <div className="car-details-container">
        <div className="car-details-error">
          {error}
        </div>
        <Link to="/" className="car-details-home-link">
          Return to Home
        </Link>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="car-details-not-found">
        <p>Car not found</p>
        <Link to="/" className="car-details-home-link">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="car-details-container">
      <div className="car-details-card">
        <h1 className="car-details-title">{car.name}</h1>
        
        <div className="car-details-info">
          <div className="car-details-property">
            <span className="car-details-label">Team:</span> 
            <span className="car-details-value">{car.team}</span>
          </div>
          <div className="car-details-property">
            <span className="car-details-label">Engine:</span> 
            <span className="car-details-value">{car.engine}</span>
          </div>
          <div className="car-details-property">
            <span className="car-details-label">Top Speed:</span> 
            <span className="car-details-value">{car.top_speed} km/h</span>
          </div>
        </div>
        
        <div className="car-details-actions">
          <Link 
            to={`/edit/${car.id}`} 
            className="car-details-edit-button"
          >
            Edit Car
          </Link>
          <button 
            onClick={handleDelete}
            disabled={deleteLoading}
            className="car-details-delete-button"
          >
            {deleteLoading ? 'Deleting...' : 'Delete Car'}
          </button>
        </div>
        
        <div className="car-details-navigation">
          <Link to="/" className="car-details-back-link">
            &larr; Back to All Cars
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CarDetails