import { useState } from 'react'
import './ChangePassword.scss'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { URL_BASE_API } from '../../constants'
import { message, Button } from 'antd'

function ChangePassword() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loadingSendOtp, setLoadingSendOtp] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const navigate = useNavigate()

  const HandleSendOtp = async () => {
    if (!email) {
      message.error('Please enter a valid email address.')
      return
    }
    try {
      setLoadingSendOtp(true) // bật loading
      await axios.post(`${URL_BASE_API}/otp/request-otp`, { email })
      message.success('Sent OTP to your email!')
    } catch (err) {
      message.error('Failed when sending OTP')
    } finally {
      setLoadingSendOtp(false) // tắt loading
    }
  }

  const HandeSubmit = async () => {
    try {
      setLoadingSubmit(true)
      const data = await axios.post(`${URL_BASE_API}/otp/verify-otp`, {
        otp: otp,
        email: email,
      })
      localStorage.setItem('otpToken', data.data.token)
      navigate('/set-new-password', { state: { email: email } })
    } catch (err) {
      message.error('OTP not correct')
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <div className="login">
      <img src="/images/change-password.svg" />
      <div className="form-login">
        <div className="title">
          <span className="webcome">Welcome to </span>
          <span className="unicalc">UniCalc</span>
        </div>

        <form>
          <div style={{ marginLeft: '100px' }}>
            Nhập email để nhận mã otp
          </div>
          <div className="form-container">
            <div className="form-group">
              <i className="fa-solid fa-envelope"></i>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="exampleUsername"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <i className="fa-solid fa-key"></i>
              <div className="input-group">
                <label htmlFor="otp">OTP</label>
                <input
                  id="otp"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="extra-info">
            {/* Antd Button với loading */}
            <Button
              type="primary"
              onClick={HandleSendOtp}
              loading={loadingSendOtp}
            >
              Send OTP
            </Button>
          </div>
        </form>

        <div className="btn-submit-container">
          <Button
            type="primary"
            className="btn-submit"
            onClick={HandeSubmit}
            loading={loadingSubmit}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
