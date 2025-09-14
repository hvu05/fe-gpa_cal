import React, { useState } from "react"
import "./GpaTable.scss" // File CSS tùy chọn để styling
import useGetAllGrade from "../../func/getAllGrade"
import axios from "axios"
import { URL_BASE_API } from "../../constants"
import { message } from "antd"
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
const { confirm } = Modal;

const GpaTable = ({ refresh, setRefresh }) => {
  const { grades, loading } = useGetAllGrade(refresh)

  const [editingId, setEditingId] = useState({})
  const [editValues, setEditValues] = useState({})

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${URL_BASE_API}/grade/${_id}`, {
        withCredentials: true
      })
      setRefresh(prev => !prev)
      message.success('Xóa môn học thành công!')
    } catch (err) {
      message.error('Delete a subject FAILED')
    }
  }

  const handleEdit = (subject) => {
    setEditingId({ gradeId: subject._id, subjectId: subject.subjectId._id })
    setEditValues({
      grade4: subject.grade4,
      grade10: subject.grade10,
      credit: subject.subjectId.credit,
      subjectName: subject.subjectId.subjectName
    })
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setEditValues(prev => ({ ...prev, [name]: value }))
  }
  const handleSave = async (gradeId, subjectId) => {
    try {
      // console.log('edit value', editValues)
      // console.log(gradeId, subjectId)
      await axios.put(`${URL_BASE_API}/grade`, {
        _id: gradeId,
        grade4: editValues.grade4,
        grade10: editValues.grade10
      }, {
        withCredentials: true
      })
      await axios.put(`${URL_BASE_API}/subject`, {
        idSubject: subjectId,
        subjectName: editValues.subjectName,
        credit: editValues.credit
      }, {
        withCredentials: true
      })
      setEditingId({ gradeId: 0 });
      setEditValues({});
      setRefresh(prev => !prev);
    } catch (err) {
      message.error("Update failed")
    }
  }


  // !DELETE
  const showDeleteConfirm = (_id, name) => {
    confirm({
      title: 'Xóa môn học',
      icon: <ExclamationCircleFilled />,
      content: `Bạn có chắc chắn muốn xóa môn ${name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:() => {
        handleDelete(_id)
      },
      onCancel:() => {
        // console.log('Hủy');
      },
    })
  }
    return (
      <div className="gpa-table-container">
        {loading && <p>Loading ...</p>}
        {!loading &&
          <div className="overall-container">
            <div className="overallGpa">Điểm TBTL: <span>{grades.overallGPA}</span></div>
            <div className="totalCredit">Tổng TCTL: <span>{grades.totalCredit}</span></div>
          </div>
        }
        {!loading && grades.gradesBySemester.map((semester, semesterIndex) => (
          <div key={semester.semesterId} className="semester-table-wrapper">
            <h3>{semester.semesterName}</h3>
            <table className="gpa-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên môn học</th>
                  <th>Tín chỉ</th>
                  <th>Thang 4</th>
                  <th>Thang 10</th>
                  <th>Điểm chữ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {semester.subjects.length == 0 && <p>Chưa có môn học</p>}
                {semester.subjects.length > 0 && semester.subjects.map((subject, subjectIndex) => (
                  <tr key={subject._id}>
                    <td>{subjectIndex + 1}</td>

                    {editingId.gradeId === subject._id ? (
                      <>
                        <td>
                          <input
                            name="subjectName"
                            value={editValues.subjectName}
                            onChange={handleChange}
                            className="input-subject-name"
                          />
                        </td>
                        <td>
                          <input
                            name="credit"
                            value={editValues.credit}
                            onChange={handleChange}
                            type="number"
                          />
                        </td>
                        <td>
                          <input
                            name="grade4"
                            value={editValues.grade4}
                            onChange={handleChange}
                            type="number"
                            step={0.5}
                            max={4}
                            min={0}
                          />
                        </td>
                        <td>
                          <input
                            name="grade10"
                            value={editValues.grade10}
                            onChange={handleChange}
                            max={10}
                            min={0}
                            step='0.01'
                            type="number"
                          />
                        </td>
                        <td>{subject.gradeChar}</td>
                        <td>

                          <button className="action-btn cancel-btn" onClick={() => setEditingId({ gradeId: 0 })}>Hủy</button>
                          <button
                            onClick={() => handleSave(subject._id, subject.subjectId._id)}
                            className="action-btn save-btn"
                          >
                            Lưu
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{subject.subjectId.subjectName}</td>
                        <td>{subject.subjectId.credit}</td>
                        <td>{Number(subject.grade4).toFixed(1)}</td>
                        <td>{Number(subject.grade10).toFixed(2)}</td>
                        <td>{subject.gradeChar}</td>

                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(subject)}
                          >
                            Sửa
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => handleDelete(subject._id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

              </tbody>
            </table>
            <p>
              GPA: {semester.gpa}; Tổng tín chỉ: {semester.totalCredits}
            </p>
          </div>
        ))}
      </div>
    );
  };

  export default GpaTable;