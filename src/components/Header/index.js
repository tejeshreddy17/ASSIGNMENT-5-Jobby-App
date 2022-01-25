import './index.css'

import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'

import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

const Header = props => {
  const onLoggingOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar-section">
      <Link to="/">
        <img
          alt="website logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="navbar-logo"
        />
      </Link>
      <ul className="large-devices-buttons">
        <Link to="/">
          <button type="button" className="home-jobs-button">
            Home
          </button>
        </Link>

        <Link to="/jobs">
          <button type="button" className="home-jobs-button">
            Jobs
          </button>
        </Link>
      </ul>
      <ul className="small-devices-buttons">
        <Link to="/">
          <button type="button" className="icon-button">
            <AiFillHome className="icons-color" />
          </button>
        </Link>
        <Link to="/jobs">
          <button type="button" className="icon-button">
            <BsFillBriefcaseFill className="icons-color" />
          </button>
        </Link>
        <button
          type="button"
          className="icon-button logout-icon-small-devices"
          onClick={onLoggingOut}
        >
          <FiLogOut className="icons-color" />
        </button>
      </ul>

      <button
        onClick={onLoggingOut}
        type="button"
        className="logout-button-large-devices"
      >
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
