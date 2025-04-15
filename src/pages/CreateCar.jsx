import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../client';

export default function CreateCar() {
  const [name, setName] = useState('')
  const [team, setTeam] = useState('')
  const [engine, setEngine] = useState('')
  const [topSpeed, setTopSpeed] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
		e.preventDefault();
	
		const { error } = await supabase.from('f1cars').insert([
			{
				name,
				team,
				engine,
				top_speed: parseFloat(topSpeed),
			},
		]);
	
		if (error) {
			console.error("Insert failed:", error.message);
		} else {
			navigate('/');
		}
	};
	

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add a New F1 Car</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Car Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full" />
        <input type="text" placeholder="Team" value={team} onChange={e => setTeam(e.target.value)} className="border p-2 w-full" />
        <input type="text" placeholder="Engine Type" value={engine} onChange={e => setEngine(e.target.value)} className="border p-2 w-full" />
        <input type="number" placeholder="Top Speed" value={topSpeed} onChange={e => setTopSpeed(e.target.value)} className="border p-2 w-full" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add Car</button>
      </form>
    </div>
  )
}
