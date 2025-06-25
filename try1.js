import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

const Form = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    languages: [],
    dob: '',
    datetime: '',
    month: '',
    age: '',
    confidence: 5,
    password: '',
    interest: '',
    Passed_Out_Year: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState({});

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:6001/sns');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const validation = () => {
    const newError = {};

    if (!formData.firstName) newError.firstName = "First name is required";

    if (!formData.email) {
      newError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newError.email = "Email format is invalid";
    }

    if (!formData.password) {
      newError.password = "Password is required";
    } else {
      if (formData.password.length < 6) newError.password = "Must be at least 6 characters";
      else if (!/[a-z]/.test(formData.password)) newError.password = "Must include one lowercase letter";
      else if (!/[A-Z]/.test(formData.password)) newError.password = "Must include one uppercase letter";
      else if (!/[!@#$%&*?]/.test(formData.password)) newError.password = "Must include one special character";
    }

    return newError;
  };

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        languages: checked
          ? [...prev.languages, value]
          : prev.languages.filter(l => l !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validation();
    if (Object.keys(validationError).length !== 0) {
      setError(validationError);
      return;
    }

    try {
      const url = editId
        ? `http://localhost:6001/allproductsnacks/${editId}`
        : 'http://localhost:6001/upload';

      await axios[editId ? 'patch' : 'post'](url, formData);
      setFormData(initialState);
      setEditId(null);
      setError({});
      fetchStudents();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (student) => {
    setEditId(student._id);
    setFormData({ ...initialState, ...student });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this student?")) {
      try {
        await axios.delete(`http://localhost:6001/deletesnack/${id}`);
        setStudents(prev => prev.filter(st => st._id !== id));
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const langs = ['English', 'Tamil', 'Malayalam', 'Kanata', 'Telugu'];
  const years = ['2024', '2023', '2022', '2021', '2020', 'Others'];

  return (
    <>
      <form onSubmit={handleSubmit} className="student-form">
        <h1><b>MERN STACK COURSE</b></h1>
        <h2><b>STUDENT REGISTRATION LIST</b></h2>

        <label>First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {error.firstName && <p style={{ color: 'red' }}>{error.firstName}</p>}
        </label><br />

        <label>Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </label><br />

        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {error.email && <p style={{ color: 'red' }}>{error.email}</p>}
        </label><br />

        <label>Month:
          <input type="month" name="month" value={formData.month} onChange={handleChange} />
        </label><br />

        <label>Date of Birth:
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </label><br />

        <label>DateTime:
          <input type="datetime-local" name="datetime" value={formData.datetime} onChange={handleChange} />
        </label><br />

        <label>Age:
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </label><br />

        <label>Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {error.password && <p style={{ color: 'red' }}>{error.password}</p>}
        </label><br />

        <label>Languages Known:<br />
          {langs.map(lang => (
            <label key={lang}>
              <input type="checkbox" value={lang}
                checked={formData.languages.includes(lang)}
                onChange={handleChange} name="languages"
              /> {lang}
            </label>
          ))}
        </label><br /><br />

        <label>Confidence: {formData.confidence}/10
          <input type="range" min="1" max="10"
            name="confidence" value={formData.confidence} onChange={handleChange}
          />
        </label><br /><br />

        <label>Interest:
          <select name="interest" value={formData.interest} onChange={handleChange}>
            <option value="">--Select--</option>
            <option>Frontend Designing</option>
            <option>Backend Connecting</option>
            <option>Full Stack Development</option>
          </select>
        </label><br /><br />

        <label>Year of Passed Out:<br />
          {years.map(year => (
            <label key={year}>
              <input type="radio" name="Passed_Out_Year" value={year}
                checked={formData.Passed_Out_Year === year}
                onChange={handleChange}
              /> {year}
            </label>
          ))}
        </label><br /><br />

        <button
          type="submit"
          style={{
            backgroundColor: editId ? '#f39c12' : '#2ecc71',
            color: 'white', padding: '6px 12px',
            border: 'none', cursor: 'pointer'
          }}>
          {editId ? 'Update Student' : 'Register Student'}
        </button>

        {editId && (
          <button type="button" onClick={() => {
            setEditId(null); setFormData(initialState);
          }}
            style={{
              marginLeft: '10px', backgroundColor: '#e74c3c',
              color: 'white', padding: '6px 12px', border: 'none'
            }}>
            Cancel Edit
          </button>
        )}
      </form>

      {students.length > 0 && (
        <table border="1" style={{ marginTop: '20px' }}>
          <thead>
            <tr><th>First Name</th><th>Email</th><th>Confidence</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {students.map(st => (
              <tr key={st._id}>
                <td>{st.firstName}</td>
                <td>{st.email}</td>
                <td>{st.confidence}/10</td>
                <td>
                  <button onClick={() => handleEdit(st)}>Edit</button>
                  <button onClick={() => handleDelete(st._id)}
                    style={{ color: 'red', marginLeft: '8px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Form;
