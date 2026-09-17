function SearchPage({ parkings, isLoading, onBack, onAdd, onChoose }) {
  return (
    <section className="search-view view-enter">
      <div className="search-heading"><div><button className="back-button" onClick={onBack} type="button">← Back</button><p className="eyebrow">AVAILABLE NOW</p><h2>Choose your<br /><em>parking spot.</em></h2></div><span className="result-count">{parkings.length} spots</span></div>
      {isLoading ? <div className="empty-state"><span className="loader" />Looking for open spots...</div> : parkings.length === 0 ? <div className="empty-state"><span className="empty-icon">○</span><strong>No open spots yet</strong><span>Be the first to add a parking spot in your city.</span><button className="secondary-button" onClick={onAdd} type="button">Add a spot</button></div> : <div className="results-layout"><div className="listing-list">{parkings.map((parking, index) => <article className="parking-card" key={parking._id}><div className="spot-number">0{index + 1}</div><div className="parking-details"><span className="available-label"><span /> Available</span><h3>{parking.name}</h3><p>{parking.address}</p><small>{parking.city}</small></div><button className="choose-button" onClick={() => onChoose(parking._id)} type="button">Choose this parking <span>↗</span></button></article>)}</div><div className="map-panel"><div className="map-grid" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-pin pin-main">P</div>{parkings.slice(0, 3).map((parking, index) => <div className={`map-pin pin-${index}`} key={parking._id}>{index + 1}</div>)}<span className="map-label">YOUR AREA</span></div></div>}
    </section>
  )
}

export default SearchPage
