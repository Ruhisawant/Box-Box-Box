import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../client';

function Home() {
  const [cars, setCars] = useState([])

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    const { data } = await supabase
      .from('f1cars')
      .select('*')
      .order('created_at', { ascending: false })
    setCars(data)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your F1 Team</h1>
      <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">Add New Car</Link>
      <ul className="mt-4 space-y-4">
        {cars.map(car => (
          <li key={car.id} className="border p-4 rounded shadow">
            <Link to={`/car/${car.id}`}>
              <h2 className="text-xl font-semibold">{car.name} - {car.team}</h2>
              <p>Top Speed: {car.top_speed} km/h</p>
            </Link>
            <Link to={`/edit/${car.id}`} className="text-blue-500 underline">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


export default Home