import Header from '../Header'

const NotFound = () => (
  <>
    <Header />
    <div className="jobs-main-background">
      <div className="failure-Jobs-View">
        <img
          className="failure-jobs-image"
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          alt="not found"
        />
        <h1 className="failure-view-heading ">Page Not Found</h1>
        <p className="failure-view-subheading ">
          we're sorry, the page you requested could not be found
        </p>
      </div>
    </div>
  </>
)
export default NotFound
