import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import './App.css'

function App() {
  const [mode, setMode] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', city: '' })
  const [parkings, setParkings] = useState([])
  const [myParking, setMyParking] = useState(() => {
    try { return JSON.parse(localStorage.getItem('parkIN-my-parking')) }
    catch { return null }
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

  const searchParkings = async () => {
    setMode('search')
    setIsLoading(true)
    try {
      const response = await fetch('/api/searchpark')
      if (!response.ok) throw new Error('Could not load parking spots')
      const result = await response.json()
      setParkings(result.data || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const addParking = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/addpark', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        credentials: 'include',
      })
      const result = await response.json()
      if (!response.ok || result.sucess === false) throw new Error(result.message || 'Could not add parking')
      const ownedParking = { ...result.data, ownerUsername: user.username }
      setMyParking(ownedParking)
      localStorage.setItem('parkIN-my-parking', JSON.stringify(ownedParking))
      toast.success('Your parking spot is now live')
      setForm({ name: '', address: '', city: '' })
      setIsEditing(false)
      setMode('manage')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const chooseParking = async (id) => {
    try {
      const response = await fetch(`/api/addpark/${id}`, { method: 'DELETE', credentials: 'include' })
      const result = await response.json()
      if (!response.ok || result.success === false) throw new Error(result.message || 'Could not reserve parking')
      setParkings(parkings.filter((parking) => parking._id !== id))
      toast.success('Parking selected. It has been removed from availability.')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const editParking = async (event) => {
    event.preventDefault()
    if (!myParking) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/addpark/${myParking._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        credentials: 'include',
      })
      const result = await response.json()
      if (!response.ok || result.success === false) throw new Error(result.message || 'Could not update parking')
      const updatedParking = { ...myParking, ...form, ownerUsername: user.username }
      setMyParking(updatedParking)
      localStorage.setItem('parkIN-my-parking', JSON.stringify(updatedParking))
      setIsEditing(false)
      toast.success('Parking details updated')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteMyParking = async () => {
    if (!myParking || !window.confirm('Delete your parking spot?')) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/addpark/${myParking._id}`, { method: 'DELETE', credentials: 'include' })
      const result = await response.json()
      if (!response.ok || result.success === false) throw new Error(result.message || 'Could not delete parking')
      setMyParking(null)
      localStorage.removeItem('parkIN-my-parking')
      setMode('home')
      toast.success('Your parking spot was deleted')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const openEditParking = () => {
    setForm({ name: myParking.name, address: myParking.address, city: myParking.city })
    setIsEditing(true)
    setMode('manage')
  }

  const openAddParking = () => {
    if (!user) {
      setAuthMode('login')
      return
    }
    setMode('add')
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`/api/auth/${authMode === 'register' ? 'register' : 'login'}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm), credentials: 'include',
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Authentication failed')
      setUser(result.user)
      setAuthForm({ username: '', password: '' })
      setAuthMode(null)
      toast.success(authMode === 'register' ? 'Account created' : 'Welcome back')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    setMyParking(null)
    localStorage.removeItem('parkIN-my-parking')
    setMode('home')
  }

  const showHome = () => setMode('home')

  return (
    <main className="app-shell">
      <header className="topbar"><button className="brand" onClick={showHome} type="button" aria-label="parkIN home"><span className="brand-mark">P</span><span>parkIN</span></button><nav className="topnav" aria-label="Parking navigation"><button className="nav-button" onClick={searchParkings} type="button"><span>⌕</span> Find parking</button><button className="nav-button nav-button-primary" onClick={openAddParking} type="button"><span>＋</span> Add parking</button>{user ? <><button className="nav-button nav-button-manage" onClick={() => { setIsEditing(false); setMode('manage') }} type="button">{user.username}</button><button className="nav-button" onClick={logout} type="button">Log out</button></> : <button className="nav-button" onClick={() => setAuthMode('login')} type="button">Log in</button>}</nav></header>
      {authMode && <section className="auth-panel view-enter"><button className="back-button" onClick={() => setAuthMode(null)} type="button">← Back</button><p className="eyebrow">{authMode === 'register' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</p><h2>{authMode === 'register' ? <>Join <em>parkIN.</em></> : <>Log in to<br /><em>parkIN.</em></>}</h2><form className="parking-form" onSubmit={submitAuth}><label>Username<input value={authForm.username} onChange={(event) => setAuthForm({ ...authForm, username: event.target.value })} required /></label><label>Password<input type="password" minLength="6" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} required /></label><button className="primary-button" type="submit">{authMode === 'register' ? 'Create account' : 'Log in'} <span>↗</span></button></form><button className="auth-switch" onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')} type="button">{authMode === 'register' ? 'Already have an account? Log in' : 'New here? Create an account'}</button></section>}
      {!authMode && mode !== 'search' && mode !== 'add' && mode !== 'manage' && <section className="welcome view-enter"><div className="welcome-copy"><p className="eyebrow">PARKING, WITHOUT THE CIRCLING</p><h1>Park closer<br /><em>to what matters.</em></h1><p className="intro">Find an open spot in the neighborhood or turn your unused driveway into someone else’s easy arrival.</p></div><div className="choice-grid"><button className="choice-card choice-search" onClick={searchParkings} type="button"><span className="choice-icon">⌕</span><span><strong>Find a parking spot</strong><small>See what’s available nearby</small></span><span className="arrow">↗</span></button><button className="choice-card choice-add" onClick={openAddParking} type="button"><span className="choice-icon">＋</span><span><strong>Add my parking</strong><small>Share your spot with drivers</small></span><span className="arrow">↗</span></button></div><div className="trust-row"><span>01</span><i /><span>Simple listings</span><i /><span>Instantly updated</span></div></section>}
      {mode === 'add' && <section className="form-view view-enter"><button className="back-button" onClick={showHome} type="button">← Back</button><div className="section-heading"><p className="eyebrow">SHARE YOUR SPACE</p><h2>Put your parking<br /><em>on the map.</em></h2><p>Give drivers the details they need to find you.</p></div><form className="parking-form" onSubmit={addParking}><label>Spot name<input name="name" value={form.name} onChange={updateForm} placeholder="e.g. Green house driveway" required /></label><label>Street address<input name="address" value={form.address} onChange={updateForm} placeholder="e.g. 14 Park Avenue" required /></label><label>City<input name="city" value={form.city} onChange={updateForm} placeholder="e.g. Bengaluru" required /></label><button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Publishing...' : 'Publish parking spot'} <span>↗</span></button></form></section>}
      {mode === 'manage' && <section className="form-view view-enter"><button className="back-button" onClick={showHome} type="button">← Back</button>{isEditing ? <><div className="section-heading"><p className="eyebrow">EDIT YOUR LISTING</p><h2>Keep it<br /><em>up to date.</em></h2><p>Update the details drivers see.</p></div><form className="parking-form" onSubmit={editParking}><label>Spot name<input name="name" value={form.name} onChange={updateForm} required /></label><label>Street address<input name="address" value={form.address} onChange={updateForm} required /></label><label>City<input name="city" value={form.city} onChange={updateForm} required /></label><div className="form-actions"><button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Saving...' : 'Save changes'} <span>↗</span></button><button className="text-button" onClick={() => setIsEditing(false)} type="button">Cancel</button></div></form></> : <><div className="section-heading"><p className="eyebrow">YOUR LISTING</p><h2>Manage your<br /><em>parking spot.</em></h2><p>This is the spot you most recently published on this device.</p></div><article className="manage-card"><span className="available-label"><span /> Live listing</span><h3>{myParking?.name}</h3><p>{myParking?.address}</p><small>{myParking?.city}</small><div className="manage-actions"><button className="primary-button" onClick={openEditParking} type="button">Edit parking <span>↗</span></button><button className="delete-button" disabled={isDeleting} onClick={deleteMyParking} type="button">{isDeleting ? 'Deleting...' : 'Delete parking'}</button></div></article></>}</section>}
      {mode === 'search' && <section className="search-view view-enter"><div className="search-heading"><div><button className="back-button" onClick={showHome} type="button">← Back</button><p className="eyebrow">AVAILABLE NOW</p><h2>Choose your<br /><em>parking spot.</em></h2></div><span className="result-count">{parkings.length} spots</span></div>{isLoading ? <div className="empty-state"><span className="loader" />Looking for open spots...</div> : parkings.length === 0 ? <div className="empty-state"><span className="empty-icon">○</span><strong>No open spots yet</strong><span>Be the first to add a parking spot in your city.</span><button className="secondary-button" onClick={() => setMode('add')} type="button">Add a spot</button></div> : <div className="results-layout"><div className="listing-list">{parkings.map((parking, index) => <article className="parking-card" key={parking._id}><div className="spot-number">0{index + 1}</div><div className="parking-details"><span className="available-label"><span /> Available</span><h3>{parking.name}</h3><p>{parking.address}</p><small>{parking.city}</small></div><button className="choose-button" onClick={() => chooseParking(parking._id)} type="button">Choose this parking <span>↗</span></button></article>)}</div><div className="map-panel"><div className="map-grid" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-pin pin-main">P</div>{parkings.slice(0, 3).map((parking, index) => <div className={`map-pin pin-${index}`} key={parking._id}>{index + 1}</div>)}<span className="map-label">YOUR AREA</span></div></div>}</section>}
      <footer><span>© 2026 parkIN</span><span>Make room for better arrivals.</span></footer>
    </main>
  )
}

export default App
