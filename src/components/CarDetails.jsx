import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../client';

export default function CarDetails() {
  const { id } = useParams()
  const [car, setCar] = useState(null)

  useEffect(() => {
    fetchCar()
  }, [])

  const fetchCar = async () => {
    const { data } = await supabase.from('f1cars').select('*').eq('id', id).single()
    setCar(data)
  }

  if (!car) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{car.name}</h1>
      <p><strong>Team:</strong> {car.team}</p>
      <p><strong>Engine:</strong> {car.engine}</p>
      <p><strong>Top Speed:</strong> {car.top_speed} km/h</p>
      <div className="mt-4">
        <Link to={`/edit/${car.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit Car</Link>
      </div>
    </div>
  )
}
