import { useState } from 'react'
import axios from 'axios'
import { URL_BASE_API } from '../../../constants'
import { message } from 'antd'

function OtpWithChangePassword({ email, setStatusUI, loading }) {
    const [otp, setOtp] = useState('')
    const HandleSendOtp = async () => {
        if (!loading) {
            try {
                await axios.post(`${URL_BASE_API}/otp/request-otp`,
                    { email: email }, { withCredentials: true })
                message.success('Đã gửi mã otp')
            } catch (err) {
                message.error('Gửi mã thất bại, vui lòng thử lại!')
            }
        }
    }
    const HandleNextWithOtp = async () => {
        if (otp) {
            try {
                await axios.post(`${URL_BASE_API}/otp/verify-otp`, {
                    email: email,
                    otp: otp
                }, { withCredentials: true })

                setStatusUI(2)
            } catch (err) {
                message.error('Mã OTP sai hoặc đã hết hạn, vui lòng thử lại!')
            }
        }
    }
    return (
        <form>
            <div>
                <label for='otp'>OTP</label>
                <input
                    id='otp'
                    placeholder='Nhập mã otp'
                    onChange={(e) => setOtp(e.target.value)}
                    className='active-change-user'
                />
            </div>
            <div>
                <button
                    type='button'
                    onClick={HandleSendOtp}
                    className='user-edit-save' >
                    GỬI MÃ OTP
                </button>
            </div>
            <div>
                <button
                    type='button'
                    onClick={HandleNextWithOtp} >
                    TIẾP TỤC
                </button>
            </div>
        </form>
    )
}

export default OtpWithChangePassword