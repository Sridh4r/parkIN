import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AddParkingPage from './pages/AddParkingPage'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ManageParkingPage from './pages/ManageParkingPage'
import SearchPage from './pages/SearchPage'

function App() {
  const [mode, setMode] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', city: '' })
  const [parkings, setParkings] = useState([])
  const [myParking, setMyParking] = useState(() => {
    try { return JSON.parse(localStorage.getItem('parkIN-my-parking')) } catch { return null }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [authForm, setAuthForm] = useState({ username: '', password: '' })

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((response) => response.json())
      .then((result) => {
        setUser(result.user)
        const storedParking = JSON.parse(localStorage.getItem('parkIN-my-parking') || 'null')
        if (!result.user || storedParking?.ownerUsername !== result.user.username) setMyParking(null)
      })
      .catch(() => setUser(null))
  }, [])

  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const showHome = () => { setAuthMode(null); setMode('home') }
  const openAddParking = () => user ? setMode('add') : setAuthMode('login')

  const searchParkings = async () => {
    setMode('search'); setIsLoading(true)
    try {
      const response = await fetch('/api/searchpark')
      if (!response.ok) throw new Error('Could not load parking spots')
      const result = await response.json(); setParkings(result.data || [])
    } catch (error) { toast.error(error.message) } finally { setIsLoading(false) }
  }

  const addParking = async (event) => {
    event.preventDefault(); setIsSubmitting(true)
    try {
      const response = await fetch('/api/addpark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form), credentials: 'include' })
      const result = await response.json()
      if (!response.ok || result.sucess === false) throw new Error(result.message || 'Could not add parking')
      const ownedParking = { ...result.data, ownerUsername: user.username }
      setMyParking(ownedParking); localStorage.setItem('parkIN-my-parking', JSON.stringify(ownedParking)); setForm({ name: '', address: '', city: '' }); setIsEditing(false); setMode('manage'); toast.success('Your parking spot is now live')
    } catch (error) { toast.error(error.message) } finally { setIsSubmitting(false) }
  }

  const chooseParking = async (id) => {
    try {
      const response = await fetch(`/api/addpark/${id}`, { method: 'DELETE', credentials: 'include' }); const result = await response.json()
      if (!response.ok || result.success === false) throw new Error(result.message || 'Could not reserve parking')
      setParkings(parkings.filter((parking) => parking._id !== id)); toast.success('Parking selected. It has been removed from availability.')
    } catch (error) { toast.error(error.message) }
  }

  const openEditParking = () => { setForm({ name: myParking.name, address: myParking.address, city: myParking.city }); setIsEditing(true); setMode('manage') }

  const editParking = async (event) => {
    event.preventDefault(); if (!myParking) return; setIsSubmitting(true)
    try {
      const response = await fetch(`/api/addpark/${myParking._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form), credentials: 'include' }); const result = await response.json()
      if (!response.ok || result.success === false) throw new Error(result.message || 'Could not update parking')
      const updatedParking = { ...myParking, ...form, ownerUsername: user.username }; setMyParking(updatedParking); localStorage.setItem('parkIN-my-parking', JSON.stringify(updatedParking)); setIsEditing(false); toast.success('Parking details updated')
    } catch (error) { toast.error(error.message) } finally { setIsSubmitting(false) }
  }

  const deleteMyParking = async () => {
    if (!myParking || !window.confirm('Delete your parking spot?')) return; setIsDeleting(true)
    try {
      const response = await fetch(`/api/addpark/${myParking._id}`, { method: 'DELETE', credentials: 'include' }); const result = await response.json()
      if (!response.ok || result.success === false) throw new Error(result.message || 'Could not delete parking')
      setMyParking(null); localStorage.removeItem('parkIN-my-parking'); setMode('home'); toast.success('Your parking spot was deleted')
    } catch (error) { toast.error(error.message) } finally { setIsDeleting(false) }
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`/api/auth/${authMode === 'register' ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm), credentials: 'include' }); const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Authentication failed')
      setUser(result.user); setAuthForm({ username: '', password: '' }); setAuthMode(null); toast.success(authMode === 'register' ? 'Account created' : 'Welcome back')
    } catch (error) { toast.error(error.message) }
  }

  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); setUser(null); setMyParking(null); localStorage.removeItem('parkIN-my-parking'); setMode('home') }
  const page = authMode ? <AuthPage authMode={authMode} authForm={authForm} setAuthForm={setAuthForm} onBack={() => setAuthMode(null)} onSubmit={submitAuth} onSwitch={() => setAuthMode(authMode === 'register' ? 'login' : 'register')} />
    : mode === 'add' ? <AddParkingPage form={form} onChange={updateForm} onBack={showHome} onSubmit={addParking} isSubmitting={isSubmitting} />
      : mode === 'manage' ? <ManageParkingPage myParking={myParking} form={form} isEditing={isEditing} isSubmitting={isSubmitting} isDeleting={isDeleting} onChange={updateForm} onBack={showHome} onEdit={openEditParking} onSubmit={editParking} onCancel={() => setIsEditing(false)} onDelete={deleteMyParking} />
        : mode === 'search' ? <SearchPage parkings={parkings} isLoading={isLoading} onBack={showHome} onAdd={openAddParking} onChoose={chooseParking} />
          : <HomePage onSearch={searchParkings} onAdd={openAddParking} />

  return <main className="app-shell"><Navbar user={user} onHome={showHome} onSearch={searchParkings} onAdd={openAddParking} onManage={() => { setIsEditing(false); setMode('manage') }} onLogin={() => setAuthMode('login')} onLogout={logout} />{page}<Footer /></main>
}

export default App
