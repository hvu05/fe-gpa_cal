import { useState } from 'react'
import axios from 'axios'
import { URL_BASE_API } from '../../../constants'
import { message } from 'antd'

function ConfirmPasswordProfile({email, setStatusUI}) {
    const [newPass, setNewPass] = useState({ new_password: '', confirm_password: '' })

    const HandleConfirmPassword = async () => {
        if (newPass.new_password.length < 6) {
            message.error('Mật khẩu không hợp lệ')
            return
        }
        else if (newPass.new_password != newPass.confirm_password) {
            message.error('Mật khẩu không trùng khớp')
            return
        }
        if (newPass.new_password === newPass.confirm_password) {
            try {
                axios.put(`${URL_BASE_API}/reset-password`, {
                    email: email,
                    new_password: newPass.new_password
                }, { withCredentials: true })
                message.success('Thay đổi mật khẩu thành công')
                setStatusUI(0)
            } catch (err) {
                message.error('Có lỗi xảy ra')
            }
        }
    }
    return (
        <form>
            <div>
                <label for='otp'>Nhập mật khẩu mới</label>
                <input
                    type='password'
                    id='otp'
                    className='active-change-user'
                    onChange={(e) => setNewPass({
                        ...newPass,
                        new_password: e.target.value
                    })}
                />
            </div>

            <div>
                <label for='otp'>Xác nhận mật khẩu</label>
                <input
                    type='password'
                    id='otp'
                    className='active-change-user'
                    onChange={(e) => setNewPass({
                        ...newPass,
                        confirm_password: e.target.value
                    })}
                />
            </div>

            <div>
                <button
                    type='button'
                    onClick={HandleConfirmPassword} >
                    XÁC NHẬN THAY ĐỔI
                </button>
            </div>
        </form>
    )
}

export default ConfirmPasswordProfile