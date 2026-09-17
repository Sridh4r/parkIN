function AuthPage({ authMode, authForm, setAuthForm, onBack, onSubmit, onSwitch }) {
  return (
    <section className="auth-panel view-enter">
      <button className="back-button" onClick={onBack} type="button">← Back</button>
      <p className="eyebrow">{authMode === 'register' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</p>
      <h2>{authMode === 'register' ? <>Join <em>parkIN.</em></> : <>Log in to<br /><em>parkIN.</em></>}</h2>
      <form className="parking-form" onSubmit={onSubmit}>
        <label>Username<input value={authForm.username} onChange={(event) => setAuthForm({ ...authForm, username: event.target.value })} required /></label>
        <label>Password<input type="password" minLength="6" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} required /></label>
        <button className="primary-button" type="submit">{authMode === 'register' ? 'Create account' : 'Log in'} <span>↗</span></button>
      </form>
      <button className="auth-switch" onClick={onSwitch} type="button">{authMode === 'register' ? 'Already have an account? Log in' : 'New here? Create an account'}</button>
    </section>
  )
}

export default AuthPage
