import React, { useState } from "react";
import "./GpaTable.scss"; // File CSS tùy chọn để styling
import useGetAllGrade from "../../func/getAllGrade";
import axios from "axios";
import { URL_BASE_API } from "../../constants";
import { message } from "antd";

const GpaTable = ({ refresh, setRefresh }) => {
  const {grades, loading} = useGetAllGrade(refresh)
  const token = localStorage.getItem('token')
  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${URL_BASE_API}/grade/${_id}`, {
        headers: {token: token}
      })
      setRefresh(prev => !prev)
      message.success('Delete a subject success')
    } catch (err) {
      message.error('Delete a subject FAILED')
    }
  }

  const handleEdit = (gradeId, subjectId) => {
    
  }
  return (
    <div className="gpa-table-container">
      {loading && <p>Loading ...</p>}
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
                  <td>{subject.subjectId.subjectName}</td>
                  <td>{subject.subjectId.credit}</td>
                  <td>{subject.grade4}</td>
                  <td>{subject.grade10}</td>
                  <td>{subject.gradeChar}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(subject._id, subject.subjectId._id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(subject._id)}
                    >
                      Xóa
                    </button>
                  </td>
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