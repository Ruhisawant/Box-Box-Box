import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Funnel, ArrowDownUp, UsersRound } from 'lucide-react'
import { supabase } from '../supabase'
import SummaryCard from '../components/SummaryCard'
import './TeamGallery.css'

function TeamGallery() {
  const [members, setMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [sortOrder, setSortOrder] = useState('newest')

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
        if (error) throw error
        setMembers(data || [])
      } catch (error) {
        console.error('Error fetching team members:', error.message)
      }
    }
    fetchTeamMembers()
  }, [])

  const filteredMembers = members
    .filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedRole === 'All' || member.role === selectedRole)
    )
    .sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    )

  return (
    <div className='main-content'>
      <div className='gallery-header-content'>
        <div className='gallery-header-text'>
          <h2>Your Team</h2>
          <p>Manage your team members and their roles</p>
        </div>
        <Link to='/create' className='btn primary'>
          <Plus className='icon' /> Add Team Member
        </Link>
      </div>

      <div className='container'>
        <div className='filters-section'>
          <div className='filter-group input-wrapper'>
            <Search className='filter-icon' size={18} />
            <input
              type='text'
              placeholder='Search by name...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='filter-input'
            />
          </div>

          <div className='filter-group input-wrapper'>
            <Funnel className='filter-icon' size={18} />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className='filter-select'
            >
              <option value='All'>All Roles</option>
              <option value='Driver'>Driver</option>
              <option value='Engineer'>Engineer</option>
              <option value='Mechanic'>Mechanic</option>
              <option value='Strategist'>Strategist</option>
              <option value='Team Principal'>Team Principal</option>
              <option value='Technical Director'>Technical Director</option>
            </select>
          </div>

          <div className='filter-group input-wrapper'>
            <ArrowDownUp className='filter-icon' size={18} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className='filter-select'
            >
              <option value='newest'>Newest First</option>
              <option value='oldest'>Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className='container'>
          <UsersRound size={48} />
          <p>No team members yet</p>
          <Link to='/create' className='btn'>
            <Plus className='icon' /> Add Your First Team Member
          </Link>
        </div>
      ) : (
        <div className='members-section'>
          {filteredMembers.map((member) => (
            <SummaryCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamGallery