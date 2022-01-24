import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'

import JobCard from '../JobCards'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const loadingStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
  noJobsView: 'noJobsView',
}

class Jobs extends Component {
  state = {
    profile: {},
    employmentType: [],
    salaryRange: '',
    jobDetails: {jobsList: []},
    searchInput: '',
    searchedString: '',
    loadingStatusconstants: loadingStatus.loading,
    loadingStatusProfileconstants: loadingStatus.loading,
  }

  componentDidMount() {
    this.gettingProfileDetails()
    this.gettingJobDetails()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSelectingEmploymentType = event => {
    if (event.target.checked) {
      const {employmentType} = this.state
      employmentType.push(event.target.value)
      this.setState({employmentType}, this.gettingJobDetails)
    } else {
      const {employmentType} = this.state
      const updatedEmploymentType = employmentType.filter(
        eachtype => eachtype !== event.target.value,
      )
      this.setState(
        {employmentType: updatedEmploymentType},
        this.gettingJobDetails,
      )
    }
  }

  onSelectingSalaryType = event => {
    this.setState({salaryRange: event.target.value}, this.gettingJobDetails)
  }

  onClickingSearchButton = () => {
    const {searchInput} = this.state
    this.setState({searchedString: searchInput}, this.gettingJobDetails)
  }

  gettingProfileDetails = async () => {
    this.setState({loadingStatusProfileconstants: loadingStatus.loading})

    const url = 'https://apis.ccbp.in/profile'
    const token = Cookies.get('loginToken')

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    const data = await response.json()
    if (response.ok === true) {
      const profileDetails = data.profile_details
      const formatedProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profile: formatedProfileDetails,
        loadingStatusProfileconstants: loadingStatus.success,
      })
    } else {
      this.setState({loadingStatusProfileconstants: loadingStatus.failure})
    }
  }

  gettingJobDetails = async () => {
    this.setState({loadingStatusconstants: loadingStatus.loading})
    const {employmentType, salaryRange, searchedString} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchedString}`
    const token = Cookies.get('loginToken')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    const data = await response.json()
    if (response.ok === true) {
      const formattedDetails = data.jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))
      const formattedJobDetails = {
        jobsList: formattedDetails,
        total: data.total,
      }
      this.setState({
        jobDetails: formattedJobDetails,
        loadingStatusconstants: loadingStatus.success,
      })
    } else {
      this.setState({loadingStatusconstants: loadingStatus.failure})
    }
  }

  renderingProfile = () => {
    const {profile} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return (
      <div className="profile-background">
        <img className="profile-pic" alt="profile" src={profileImageUrl} />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  loadingRender = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  finalRenderingProfile = () => {
    const {loadingStatusProfileconstants} = this.state
    switch (loadingStatusProfileconstants) {
      case 'SUCCESS':
        return this.renderingProfile()
      case 'FAILURE':
        return this.failureProfileView()
      case 'LOADING':
        return this.loadingRender()
      default:
        return null
    }
  }

  finalRenderingJobsList = () => {
    const {loadingStatusconstants, jobDetails} = this.state
    const {jobsList} = jobDetails
    switch (loadingStatusconstants) {
      case 'SUCCESS':
        if (jobsList.length === 0) {
          return (
            <div className="failure-Jobs-View">
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                alt="no jobs"
              />
              <h1 className="failure-view-heading ">No Jobs Found</h1>
              <p className="failure-view-subheading ">
                We could not find any jobs. Try other filters.
              </p>
            </div>
          )
        }
        return jobsList.map(eachJob => (
          <JobCard jobDetail={eachJob} key={eachJob.id} />
        ))
      case 'FAILURE':
        return this.failureJobsView()
      case 'LOADING':
        return this.loadingRender()
      default:
        return null
    }
  }

  failureProfileView = () => (
    <div className="failure-profile-container">
      <button
        type="button"
        onClick={this.gettingProfileDetails}
        className="retry-button"
      >
        Retry
      </button>
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
        onClick={this.gettingJobDetails}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-main-background">
          <div className="search-box-container">
            <input
              className="search-input"
              onChange={this.onChangeSearchInput}
              type="search"
              placeholder="Search"
            />
            <button
              className="search-button"
              onClick={this.onClickingSearchButton}
              type="button"
              testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="sorting-details-container">
            {this.finalRenderingProfile()}
            <hr />
            <p className="employment-heading">Types of Employment</p>
            {employmentTypesList.map(eachType => (
              <li>
                <input
                  onChange={this.onSelectingEmploymentType}
                  type="checkbox"
                  value={eachType.employmentTypeId}
                />
                <label className="label-style" htmlFor="checkbox">
                  {eachType.label}
                </label>
              </li>
            ))}
            <hr />
            <p className="salary-range-heading">Salary Range</p>

            {salaryRangesList.map(eachType => (
              <li>
                <input
                  className="input"
                  onChange={this.onSelectingSalaryType}
                  type="radio"
                  value={eachType.salaryRangeId}
                  name="salaryGroup"
                />
                <label className="label-style" htmlFor="checkbox">
                  {eachType.label}
                </label>
              </li>
            ))}
            <hr />
          </div>
          <div className="jobs-details-container">
            <div className="search-box-container-large">
              <input
                className="search-input"
                onChange={this.onChangeSearchInput}
                type="search"
                placeholder="Search"
              />
              <button
                className="search-button"
                onClick={this.onClickingSearchButton}
                type="button"
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.finalRenderingJobsList()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
