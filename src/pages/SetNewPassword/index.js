import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL_BASE_API } from "../../constants";

function SetNewPassword() {
    const navigate = useNavigate();
    const email = useLocation().state.email || null
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmNewPassword] = useState('')
    const otpToken = localStorage.getItem('otpToken')

    useEffect(() => {
        if (!otpToken) {
            message.warning("Please verify your OTP before setting a new password.")
            navigate("/change-password"); // quay lại nếu chưa xác thực
        }
    }, [navigate]);
    const HandleSetNewPassword = async () => {
        try {
            if (newPassword === confirmPassword) {
                await axios.put(`${URL_BASE_API}/reset-password`, {
                    email, new_password: newPassword
                }, {
                    withCredentials: true
                })
                message.success('Change password success')
                setNewPassword('')
                setConfirmNewPassword('')
                navigate('/log-in')
            } else {
                message.error('Passwords do not match')
            }
        } catch (e) {
            message.error('Error at set password')
        }
    }
    return (
        <>
            <div className="login">
                <img src="/images/set-new-password.svg" />
                <div className='form-login'>
                    <div className='title'>
                        <span className='webcome'>Welcome to </span>
                        <span className='unicalc'>UniCalc</span>
                    </div>

                    <form onSubmit={HandleSetNewPassword}>
                        <div style={{ marginLeft: '100px' }}>Thay đổi mật khẩu</div>


                        <div className='form-container'>
                            <div className='form-group'>
                                <i className="fa-solid fa-key"></i>
                                <div className='input-group'>
                                    <label htmlFor='pw'>Nhập mật khẩu mới</label>
                                    <input id='pw' required type="password"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-container'>
                            <div className='form-group'>
                                <i className="fa-solid fa-key"></i>
                                <div className='input-group'>
                                    <label htmlFor='pw-confirm'>Xác nhận mật khẩu</label>
                                    <input id='pw-confirm' required type="password"
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='btn-submit-container'>
                            <button className='btn-submit' type="submit">
                                Next
                            </button>
                        </div>
                    </form>


                </div>
            </div>
        </>
    )
}

export default SetNewPassword