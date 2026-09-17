function Navbar({ user, onHome, onSearch, onAdd, onManage, onLogin, onLogout }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome} type="button" aria-label="parkIN home">
        <span className="brand-mark">P</span><span>parkIN</span>
      </button>
      <nav className="topnav" aria-label="Parking navigation">
        <button className="nav-button" onClick={onSearch} type="button"><span>⌕</span> Find parking</button>
        <button className="nav-button nav-button-primary" onClick={onAdd} type="button"><span>＋</span> Add parking</button>
        {user ? <>
          <button className="nav-button nav-button-manage" onClick={onManage} type="button">{user.username}</button>
          <button className="nav-button" onClick={onLogout} type="button">Log out</button>
        </> : <button className="nav-button" onClick={onLogin} type="button">Log in</button>}
      </nav>
    </header>
  )
}

export default Navbar
