import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {HiOutlineExternalLink} from 'react-icons/hi'

import {AiFillStar} from 'react-icons/ai'

import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'

import SimilarJobs from '../SimilarJob'

import './index.css'

// https://apis.ccbp.in/jobs/:id

const loadingStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
  noJobsView: 'noJobsView',
}

class JobItem extends Component {
  state = {
    loadingStatusconstants: loadingStatus.initial,
    jobDetailsobject: {lifeAtCompany: {}, skills: []},
    similarJobs: [],
  }

  componentDidMount() {
    this.gettingJobItem()
  }

  gettingJobItem = async () => {
    this.setState({loadingStatusconstants: loadingStatus.loading})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const jobDetails = data.job_details

      const formatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: {
          lifeAtCompanyDescription: jobDetails.life_at_company.description,
          lifeAtCompanyImageUrl: jobDetails.life_at_company.image_url,
        },
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
        title: jobDetails.title,
      }
      const similarJobs = data.similar_jobs
      const formattedSimilarJobs = similarJobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        rating: eachData.rating,
        title: eachData.title,
      }))
      this.setState({
        jobDetailsobject: formatedJobDetails,
        similarJobs: formattedSimilarJobs,
        loadingStatusconstants: loadingStatus.success,
      })
    } else {
      this.setState({loadingStatusconstants: loadingStatus.failure})
    }
  }

  renderingSkills = () => {
    const {jobDetailsobject} = this.state
    const {skills} = jobDetailsobject
    return skills.map(eachSkill => (
      <div key={eachSkill.name} className="each-skill-container">
        <img
          className="skill-logo"
          alt={eachSkill.name}
          src={eachSkill.imageUrl}
        />
        <p className="job-item-description">{eachSkill.name}</p>
      </div>
    ))
  }

  renderingJobs = () => {
    const {jobDetailsobject, similarJobs} = this.state
    console.log('rendering at rendering')
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetailsobject
    const {lifeAtCompanyDescription, lifeAtCompanyImageUrl} = lifeAtCompany

    return (
      <>
        <div className="job-item-background">
          <div className="job-item-logo-container">
            <img
              className="job-item-logo-style"
              alt="job details company logo"
              src={companyLogoUrl}
            />
            <div className="job-item-title-container">
              <h1 className="job-item-title">{title}</h1>
              <div className="job-item-rating-container">
                <AiFillStar className="job-item-rating-icon" />
                <p className="job-item-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-location-container">
            <div className="job-item-location-type-container">
              <div className="job-item-location-icon-container">
                <MdLocationOn className="job-item-icon" />
                <p className="job-item-style-1">{location}</p>
              </div>
              <div className="job-item-location-icon-container">
                <BsFillBriefcaseFill className="job-item-icon-1" />
                <p className="job-item-style-1">{employmentType}</p>
              </div>
            </div>

            <p className="job-item-style-2">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="job-item-description-container">
            <p className="job-item-description-heading">Description</p>
            <a className="website-element" href={companyWebsiteUrl}>
              Visit
              <HiOutlineExternalLink className="website-redirect-icon" />
            </a>
          </div>
          <p className="job-item-description">{jobDescription}</p>
          <h1 className="job-item-description-heading">Skills</h1>
          <ul className="skill-container">{this.renderingSkills()}</ul>

          <h1 className="job-item-description-heading">Life at Company</h1>
          <p>{lifeAtCompanyDescription}</p>
          <img alt="life at company" src={lifeAtCompanyImageUrl} />
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-job-container">
          {similarJobs.map(eachJob => (
            <SimilarJobs SimilarJob={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </>
    )
  }

  renderingSimilarJobs = similarJob => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      rating,
      title,
    } = similarJob
    // console.log(similarJob)
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
          <h1 className="job-card-description-heading">Description</h1>
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

  renderingLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  failureJobsView = () => (
    <div className="failure-Jobs-View">
      <img
        className="failure-jobs-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-heading ">Oops! Something went Wrong</h1>
      <p className="failure-view-subheading ">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        onClick={this.gettingJobItem}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderingjobpageAlongWithLoader = () => {
    const {loadingStatusconstants} = this.state
    switch (loadingStatusconstants) {
      case 'SUCCESS':
        return this.renderingJobs()
      case 'LOADING':
        return this.renderingLoader()
      case 'FAILURE':
        return this.failureJobsView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobsList-main-background">
          {this.renderingjobpageAlongWithLoader()}
        </div>
      </>
    )
  }
}

export default JobItem
