function LoadingSpinner() {
  return (
    <div className="loading" role="status" aria-label="Loading">
      <div className="loading__spinner">
        <div className="loading__ring loading__ring--1" />
        <div className="loading__ring loading__ring--2" />
        <div className="loading__ring loading__ring--3" />
      </div>
      <p className="loading__text">Loading...</p>
    </div>
  )
}

export default LoadingSpinner
