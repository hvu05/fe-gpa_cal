import { useState, useEffect, useRef } from "react"
import useSemesterByUserId from "../../func/getSemesterByUserId"
import axios from "axios"
import { URL_BASE_API } from "../../constants"
import { message } from "antd"
import './GpaCalc.scss'
import GpaTable from "../GpaTable"
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
const { confirm } = Modal;

function GpaCalc() {
    const [subject, setSubject] = useState({ name: '', credit: '' })
    const [grade, setGrade] = useState({ grade4: 4, grade10: '' })

    const [refresh, setRefresh] = useState(true)
    const { semesters, loading } = useSemesterByUserId(refresh)
    const [idSemester, setIdSemester] = useState("")
    // dùng cho việc save giá trị khi chọn select option để gọi API thêm điểm

    const [semName, setSemName] = useState('') // dùng để gán tên cho việc thêm học kì

    const listRef = useRef(null)
    const [toggleEditSemester, setToggleEditSemester] = useState(false)
    useEffect(() => {
        if (!loading && semesters?.data?.data?.length > 0) {
            setIdSemester(semesters.data.data[0]._id)
        }
    }, [loading, semesters])

    useEffect(() => {
        function handleClickOutside(e) {
            // nếu (listRef.current): có tồn tại và (contains(e.target)): trỏ chuột ấn ngoài current
            if (listRef.current && !listRef.current.contains(e.target)) {
                setToggleEditSemester(false)
            }
        }

        if (toggleEditSemester) {
            // dùng mousedown để đóng sớm, có thể dùng "click" cũng được
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [toggleEditSemester])

    const HandleSubmitSubject = async (e) => {
        e.preventDefault()
        try {
            const submitSubject = await axios.post(`${URL_BASE_API}/subject`, {
                subjectName: subject.name,
                credit: subject.credit
            }, {
                withCredentials: true
            })

            await axios.post(`${URL_BASE_API}/grade`, {
                subjectId: submitSubject.data.data._id,
                semesterId: idSemester,
                grade10: grade.grade10,
                grade4: grade.grade4
            }, {
                withCredentials: true
            })

            message.success("Thêm môn học thành công ✅")

            // reset form
            setRefresh(!refresh)
            setSubject({ name: "", credit: '' })
            setGrade({ grade4: 4, grade10: '' })

        } catch (err) {
            message.error("Thêm môn học thất bại ❌")
            // console.log('err at post subject or grade', err)
        }
    }

    const HandleSubmitSemester = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${URL_BASE_API}/semester`, {
                semesterName: semName
            }, {
                withCredentials: true
            })
            setRefresh(!refresh)
            setSemName('')
            message.success('Add semester success')
        } catch (err) {
            message.error('Add semester failed')
        }
    }
    const HandleEditSemester = () => {
        setToggleEditSemester(!toggleEditSemester)
    }
    const HandleDeleteASemester = async (_id) => {
        try {
            await axios.delete(`${URL_BASE_API}/semester/${_id}`, {
                withCredentials: true
            })
            message.success('Delete a semester success')
            setRefresh(!refresh)
        } catch (err) {
            message.error('Delete a semester invalid')
        }
    }
    const showDeleteConfirm = async (_id, name) => {
        confirm({
            title: 'Xóa môn học',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc chắn muốn xóa học kì ${name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => HandleDeleteASemester(_id),
            onCancel: () => {
                // console.log('Hủy');
            },
        })
    }
    return (
        <>
            <div className="gpa-form-container">
                <div className="gpa-form-container">
                    <form onSubmit={(e) => HandleSubmitSemester(e)} className="semester-form">
                        <input
                            value={semName}
                            onChange={(e) => setSemName(e.target.value)}
                            required
                            placeholder="Nhập học kì"
                            className="input-btn semester-form__input"
                        />

                        <button type="submit" className="btn-submit-form-gpa semester-form__submit-btn">
                            Nhập học kì
                        </button>

                        <div className="semester-form__label">
                            <button type="button" className="btn-submit-form-gpa " onClick={HandleEditSemester}>
                                Chỉnh sửa học kì
                            </button>
                            {toggleEditSemester && <div className="list-edit-semester" ref={listRef}>
                                <ul>
                                    {!loading && semesters.data.data.map((s, i) => (
                                        <li key={i}>{s.semesterName}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    HandleDeleteASemester(s._id)
                                                }}
                                            >
                                                X
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>}
                        </div>
                    </form>

                    <form onSubmit={HandleSubmitSubject} className="subject-form">
                        <div className="subject-form__inputs">
                            <div className="subject-form__name-container">
                                <input
                                    value={subject.name}
                                    placeholder="Tên môn học"
                                    onChange={(e) => setSubject({ ...subject, name: e.target.value })}
                                    required
                                    className="input-btn subject-form__name-input"
                                />
                            </div>

                            <div className="subject-form__credit-container">
                                <input
                                    value={subject.credit}
                                    placeholder="Số tín chỉ"
                                    onChange={(e) => setSubject({ ...subject, credit: Number(e.target.value) })}
                                    required
                                    className="input-btn subject-form__credit-input"
                                    type="number"
                                    min={0}
                                />
                            </div>

                            <div className="subject-form__grade-input">
                                <select
                                    value={grade.grade4}
                                    onChange={(e) => setGrade({ ...grade, grade4: Number(e.target.value) })}
                                    className="input-btn subject-form__grade-input__selector"
                                >
                                    <option disabled>Thang 4</option>
                                    <option value={4}>4.0</option>
                                    <option value={3.5}>3.5</option>
                                    <option value={3}>3.0</option>
                                    <option value={2.5}>2.5</option>
                                    <option value={2}>2.0</option>
                                    <option value={1.5}>1.5</option>
                                    <option value={1}>1.0</option>
                                </select>

                                <input
                                    max={10}
                                    min={0}
                                    step='0.01'
                                    value={grade.grade10}
                                    onChange={(e) => setGrade({ ...grade, grade10: Number(e.target.value) })}
                                    required
                                    placeholder="Thang 10"
                                    className="input-btn subject-form__grade-input__input"
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="subject-form__actions">
                            <div className="subject-form__semester-selector-container">
                                {loading ? (
                                    <p className="subject-form__loading-text">Loading semesters...</p>
                                ) : (
                                    <select
                                        onChange={(e) => setIdSemester(e.target.value)}
                                        className="input-btn subject-form__semester-selector"
                                    >
                                        {semesters.data.data.map((s, i) => (
                                            <option key={i} value={s._id} className="subject-form__semester-option">
                                                {s.semesterName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <button type="submit" className="btn-submit-form-gpa subject-form__submit-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="divider"></div>

            <div className="gpa-form-container">
                <GpaTable refresh={refresh} setRefresh={setRefresh} />
            </div>

        </>
    )
}

export default GpaCalc