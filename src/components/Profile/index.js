import { use, useEffect, useState } from 'react'
import useInfoAUser from '../../func/getInfoAUser'
import './Profile.scss'
import axios from 'axios'
import { URL_BASE_API } from '../../constants'
import { message } from 'antd'

function Profile() {
    const [refresh, setRefresh] = useState(true)
    const { user, loading } = useInfoAUser(refresh)

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFromData] = useState({
        fullname: '',
        username: '',
    })
    useEffect(() => {
        if(!loading) {
            setFromData({
                fullname: user.fullname,
                username: user.username
            })
        }
    }, [loading])
    const HandleChange = (e) => {
        // const [name, value] = e.target
        const {id, value} = e.target
        setFromData({...formData, [id]: value})
    }
    const HandleClick = async() => {
        if(!isEditing) setIsEditing(!isEditing)
        else await HandleSave()
    }
    const HandleSave = async () => {
        try {
            const result = await axios.put(`${URL_BASE_API}/user`, {
                username: formData.username,
                fullname: formData.fullname
            }, {withCredentials: true})
            console.log('result', result)
            setIsEditing(!isEditing)
            message.success('Thay đổi thông tin thành công!')
        } catch (err) {
            message.error('Thay đổi thất bại, vui lòng nhập tên khác hoặc đăng nhập lại!')
            console.log(err)
        }
    }
    return (
        <>
            <p className='info-account'>THÔNG TIN TÀI KHOẢN</p>
            {!loading && <div className='profile-container'>
                <div className="profile-user">
                    <div className='profile-avt'>
                        <img src='/images/Avatar.svg' alt='avatar' />
                        <p>{user.fullname}</p>
                        <div className='avt-email'>{user.email}</div>
                    </div>
                    <form>
                        <div>
                            <label for='full name'>Full name</label>
                            <input
                                id='fullname'
                                placeholder='Full name'
                                value={formData.fullname}
                                disabled={!isEditing}
                                onChange={HandleChange}
                                className={isEditing ? 'active-change-user': ''}
                            />
                        </div>

                        <div>
                            <label for='full name'>Username</label>
                            <input
                                id='username'
                                placeholder='Full name'
                                value={formData.username}
                                disabled={!isEditing}
                                onChange={HandleChange}
                                className={isEditing ? 'active-change-user': ''}
                            />
                        </div>

                        <div>
                            <label for='full name'>Email</label>
                            <input
                                id='full name'
                                placeholder='Full name'
                                value={user.email}
                                disabled
                            />
                        </div>

                        <div>
                            <label for='full name'>Status account</label>
                            <input
                                id='full name'
                                placeholder='Full name'
                                value={user.isPurchased === true ? 'Premium' : 'Trial'}
                                disabled
                            />
                        </div>

                        <div>
                            <label for='full name'>Ngày hết hạn</label>
                            <input
                                id='full name'
                                placeholder='Full name'
                                value={(new Date(user.expiredAt)).toLocaleString('vi-VN')}
                                disabled
                            />
                        </div>

                        <div>
                            <button 
                                className={isEditing ? '': 'user-edit-save'}
                                type='button' 
                                onClick={HandleClick} >
                                    {isEditing ? 'LƯU' : 'CHỈNH SỬA THÔNG TIN'}
                            </button>
                        </div>

                        <div>
                            <button>THAY ĐỔI MẬT KHẨU</button>
                        </div>
                    </form>
                </div>
            </div>}
        </>
    )
}

export default Profile