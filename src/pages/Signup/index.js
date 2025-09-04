import { use, useState } from 'react'
import axios from "axios"
import './Signup.scss'
import { URL_BASE_API } from '../../constants'
import { message, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const HandleSubmit = async () => {
        // verify otp
        try {
            await axios.post(`${URL_BASE_API}/otp/verify-otp`, {
                otp: otp,
                email: email
            })
        } catch (err) {
            message.error('OTP not correct')
            return
        }

        // verify username, email, ...
        try {
            await axios.post(`${URL_BASE_API}/auth`, {
                username, email, password, loginMethod: 'username'
            })
            message.success('Registration successful')
            navigate('/dashboard')
            // navigate('/') // Navigate to login page after successful registration
        }
        catch (err) {
            if (err.response && err.response.data) {
                message.error(err.response.data.message);
            } else {
                message.error("Something went wrong, please try again");
            }
        }
        setUsername('')
        setEmail('')
        setPassword('')
    }
    const HandleSendOtp = async () => {
        try {
            await axios.post(`${URL_BASE_API}/otp/request-otp`, { email })
            message.success('Sent OTP to your email!')
        } catch (err) {
            message.error('Failed when send OTP')
        }
    }
    const HandleSignUpWithGG = async () => {
        try {
            window.location.href = `${URL_BASE_API}/auth/google`
        } catch (e) {
            message.error('Error when sign up with Google')
        }
    }
    return (
        <>
            <div className="login">
                <img src="/images/signup.svg" />
                <div className='form-login'>
                    <div className='title signup-title'>
                        <span className='webcome'>Welcome to </span>
                        <span className='unicalc'>UniCalc</span>
                    </div>

                    <div className='google-container'>
                        <button className='login-google' onClick={HandleSignUpWithGG}>
                            <img src='/images/gg.png' alt='google' className="google-icon" />
                            <span className='g'>Login with Google</span>
                        </button>
                    </div>

                    <div className="divider signup-divider">
                        <span>OR</span>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        HandleSubmit();
                    }}>

                        <div className='form-container signup'>
                            <div className='form-group'>
                                <i className="fa-solid fa-user-plus"></i>
                                <div className='input-group'>
                                    <label htmlFor='username'>Username</label>
                                    <input type='text' id='username' required
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-container signup'>
                            <div className='form-group'>
                                <i className="fa-solid fa-envelope"></i>
                                <div className='input-group'>
                                    <label htmlFor='email'>Email</label>
                                    <input type='email' id='email' required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-container signup'>
                            <div className='form-group'>
                                <i className="fa-solid fa-key"></i>
                                <div className='input-group'>
                                    <label htmlFor='password'>Password</label>
                                    <input id='password' required type='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-container signup'>
                            <div className='form-group'>
                                <i className="fa-solid fa-lock"></i>
                                <div className='input-group'>
                                    <label htmlFor='OTP'>OTP</label>
                                    <input id='OTP' required
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='extra-info'>
                            <Button
                                type="primary"
                                onClick={HandleSendOtp}
                                loading={loading}
                            >
                                Send OTP
                            </Button>
                        </div>

                        <div className='btn-submit-container'>
                            <button className='btn-submit' type="submit">
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup