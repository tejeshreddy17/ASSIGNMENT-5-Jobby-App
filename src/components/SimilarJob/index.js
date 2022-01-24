import {Link} from 'react-router-dom'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {AiFillStar} from 'react-icons/ai'

import {MdLocationOn} from 'react-icons/md'

const SimilarJobs = props => {
  const {SimilarJob} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = SimilarJob
  return (
    <Link className="job-link" to={`/jobs/${id}`}>
      <div className="job-card-background">
        <div className="logo-container">
          <img
            className="job-card-logo-style"
            alt="company logo"
            src={companyLogoUrl}
          />
          <div className="job-card-title-container">
            <h1 className="job-card-title">{title}</h1>
            <div className="job-card-rating-container">
              <AiFillStar className="job-card-rating-icon" />
              <p className="job-card-rating">{rating}</p>
            </div>
          </div>
        </div>
        <p className="job-card-description-heading">Description</p>
        <p className="job-card-description">{jobDescription}</p>
        <div className="location-container">
          <div className="location-type-container">
            <div className="location-icon-container">
              <MdLocationOn />
              <p className="style-1">{location}</p>
            </div>
            <div className="location-icon-container">
              <BsFillBriefcaseFill />
              <p className="style-1">{employmentType}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SimilarJobs
