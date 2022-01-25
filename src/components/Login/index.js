import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showLoginError: false, errMsg: ''}

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    history.replace('/')
  }

  onFailureLogin = erroMessage => {
    this.setState({errMsg: erroMessage, showLoginError: true})
  }

  onLoggingIn = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userdetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userdetails),
    }
    const url = 'https://apis.ccbp.in/login'
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    console.log(data)
    if (response.ok === true) {
      this.onSuccessLogin(data.jwt_token)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  onChangingUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangingPassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {showLoginError, errMsg, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-background">
        <form onSubmit={this.onLoggingIn} className="login-form">
          <img
            alt="website logo"
            className="logo-style"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <label className="label-style" htmlFor="username">
            USERNAME
          </label>
          <input
            id="username"
            onChange={this.onChangingUserName}
            className="input-style"
            placeholder="username"
            type="text"
            value={username}
          />
          <label className="label-style" htmlFor="password">
            PASSWORD
          </label>
          <input
            id="password"
            onChange={this.onChangingPassword}
            className="input-style"
            placeholder="password"
            type="password"
            value={password}
          />
          <button className="login-button-style" type="submit">
            Login
          </button>
          {showLoginError && <p className="error-message">* {errMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
