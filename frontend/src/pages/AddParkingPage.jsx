function AddParkingPage({ form, onChange, onBack, onSubmit, isSubmitting }) {
  return (
    <section className="form-view view-enter">
      <button className="back-button" onClick={onBack} type="button">← Back</button>
      <div className="section-heading"><p className="eyebrow">SHARE YOUR SPACE</p><h2>Put your parking<br /><em>on the map.</em></h2><p>Give drivers the details they need to find you.</p></div>
      <form className="parking-form" onSubmit={onSubmit}>
        <label>Spot name<input name="name" value={form.name} onChange={onChange} placeholder="e.g. Green house driveway" required /></label>
        <label>Street address<input name="address" value={form.address} onChange={onChange} placeholder="e.g. 14 Park Avenue" required /></label>
        <label>City<input name="city" value={form.city} onChange={onChange} placeholder="e.g. Bengaluru" required /></label>
        <button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Publishing...' : 'Publish parking spot'} <span>↗</span></button>
      </form>
    </section>
  )
}

export default AddParkingPage
