import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../client';

export default function EditCar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState({
    name: '',
    team: '',
    engine: '',
    top_speed: ''
  })

  useEffect(() => {
    fetchCar()
  }, [])

  const fetchCar = async () => {
    const { data } = await supabase.from('f1cars').select('*').eq('id', id).single()
    setCar(data)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    await supabase.from('f1cars').update({
      name: car.name,
      team: car.team,
      engine: car.engine,
      top_speed: car.top_speed
    }).eq('id', id)
    navigate('/')
  }

  const handleDelete = async () => {
    await supabase.from('f1cars').delete().eq('id', id)
    navigate('/')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit F1 Car</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input type="text" value={car.name} onChange={e => setCar({ ...car, name: e.target.value })} className="border p-2 w-full" />
        <input type="text" value={car.team} onChange={e => setCar({ ...car, team: e.target.value })} className="border p-2 w-full" />
        <input type="text" value={car.engine} onChange={e => setCar({ ...car, engine: e.target.value })} className="border p-2 w-full" />
        <input type="number" value={car.top_speed} onChange={e => setCar({ ...car, top_speed: e.target.value })} className="border p-2 w-full" />
        <div className="space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </form>
    </div>
  )
}
