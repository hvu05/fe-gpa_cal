import DashboardComponent from '../../components/DashboardComponent'
import GpaCalc from '../../components/GpaCalc'
import Profile from '../../components/Profile'
import { getTokenFromUrl } from '../../func/getTokenFromURL'
import './Dashboard.scss'
import { useState } from 'react'


function Dashboard() {
    const [isOpen, setIsOpen] = useState(true)
    const [activeItem, setActiveItem] = useState('GPA Calculator')
    const token = getTokenFromUrl()
    localStorage.setItem('token', token)
    
    const components = {
        'Dashboard': <DashboardComponent />,
        'GPA Calculator': <GpaCalc />,
        'profile': <Profile />
    }
    return (
        <>
            <div className={`dashboard ${isOpen ? 'open' : 'closed'}`}>
                <aside className="sidebar">
                    <div className='logo-container'><img src='/images/logo.svg' /></div>

                    <div className='sidebar__item'>
                        <div
                            className={`item ${activeItem == 'Dashboard' ? 'item-active' : ''}`}
                            onClick={() => setActiveItem("Dashboard")}
                        >
                            <i class="fa-solid fa-house"></i> Dashboard
                        </div>

                        <div
                            className={`item ${activeItem == 'GPA Calculator' ? 'item-active' : ''}`}
                            onClick={() => setActiveItem("GPA Calculator")}
                        >
                            <i class="fa-solid fa-calculator"></i> GPA Calculator
                        </div>

                        <div
                            className={`item ${activeItem == 'file' ? 'item-active' : ''}`}
                            onClick={() => setActiveItem("file")}
                        >
                            <i class="fa-solid fa-file-export"></i> File export
                        </div>

                        <div
                            className={`item ${activeItem == 'profile' ? 'item-active' : ''}`}
                            onClick={() => setActiveItem("profile")}
                        >
                            <i class="fa-solid fa-id-badge"></i> Profile
                        </div>
                        <div
                            className={`item ${activeItem == 'Setting' ? 'item-active' : ''}`}
                            onClick={() => setActiveItem("Setting")}
                        >
                            <i class="fa-solid fa-gear"></i> Setting
                        </div>

                        <div
                            className={`item item-logout`}
                        >
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> Log out
                        </div>
                    </div>
                </aside>

                <main className='main'>
                    <div className='header-main'>
                        <button onClick={() => setIsOpen(!isOpen)} className='button-control'>
                            {isOpen ?
                                <i class="fa-solid fa-backward"></i> :
                                <i class="fa-solid fa-bars"></i>
                            }
                        </button>

                        <button className='button-control avt'>
                            <i class="fa-solid fa-circle-user"></i>
                        </button>
                    </div>
                    {components[activeItem] || <p>Tính năng đang được phát triển</p>}
                    
                    
                </main>
            </div>
        </>
    )
}

export default Dashboard