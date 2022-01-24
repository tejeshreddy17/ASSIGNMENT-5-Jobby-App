import {Link} from 'react-router-dom'

import './index.css'

import Header from '../Header'

const Home = props => {
  console.log(props)

  return (
    <>
      <Header />
      <div className="home-background">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary Information, company
          reviews.Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="find-jobs-button">
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home
