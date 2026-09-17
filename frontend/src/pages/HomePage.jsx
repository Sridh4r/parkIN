function HomePage({ onSearch, onAdd }) {
  return (
    <section className="welcome view-enter">
      <div className="welcome-copy">
        <p className="eyebrow">PARKING, WITHOUT THE CIRCLING</p>
        <h1>Park closer<br /><em>to what matters.</em></h1>
        <p className="intro">Find an open spot in the neighborhood or turn your unused driveway into someone else’s easy arrival.</p>
      </div>
      <div className="choice-grid">
        <button className="choice-card choice-search" onClick={onSearch} type="button"><span className="choice-icon">⌕</span><span><strong>Find a parking spot</strong><small>See what’s available nearby</small></span><span className="arrow">↗</span></button>
        <button className="choice-card choice-add" onClick={onAdd} type="button"><span className="choice-icon">＋</span><span><strong>Add my parking</strong><small>Share your spot with drivers</small></span><span className="arrow">↗</span></button>
      </div>
      <div className="trust-row"><span>01</span><i /><span>Simple listings</span><i /><span>Instantly updated</span></div>
    </section>
  )
}

export default HomePage
