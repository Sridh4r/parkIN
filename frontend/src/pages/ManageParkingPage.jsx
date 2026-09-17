function ManageParkingPage({ myParking, form, isEditing, isSubmitting, isDeleting, onChange, onBack, onEdit, onSubmit, onCancel, onDelete }) {
  return (
    <section className="form-view view-enter">
      <button className="back-button" onClick={onBack} type="button">← Back</button>
      {isEditing ? <>
        <div className="section-heading"><p className="eyebrow">EDIT YOUR LISTING</p><h2>Keep it<br /><em>up to date.</em></h2><p>Update the details drivers see.</p></div>
        <form className="parking-form" onSubmit={onSubmit}>
          <label>Spot name<input name="name" value={form.name} onChange={onChange} required /></label>
          <label>Street address<input name="address" value={form.address} onChange={onChange} required /></label>
          <label>City<input name="city" value={form.city} onChange={onChange} required /></label>
          <div className="form-actions"><button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Saving...' : 'Save changes'} <span>↗</span></button><button className="text-button" onClick={onCancel} type="button">Cancel</button></div>
        </form>
      </> : <>
        <div className="section-heading"><p className="eyebrow">YOUR LISTING</p><h2>Manage your<br /><em>parking spot.</em></h2><p>This is the spot you most recently published on this device.</p></div>
        <article className="manage-card"><span className="available-label"><span /> Live listing</span><h3>{myParking?.name}</h3><p>{myParking?.address}</p><small>{myParking?.city}</small><div className="manage-actions"><button className="primary-button" onClick={onEdit} type="button">Edit parking <span>↗</span></button><button className="delete-button" disabled={isDeleting} onClick={onDelete} type="button">{isDeleting ? 'Deleting...' : 'Delete parking'}</button></div></article>
      </>}
    </section>
  )
}

export default ManageParkingPage
