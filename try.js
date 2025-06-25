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

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, languages: checked   ? [...prev.languages, value]
                                                           : prev.languages.filter(l => l !== value)
    }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validation();

    if (Object.keys(validationError).length === 0) {
      try {
        const url = editId
          ? `http://localhost:6001/allproductsnacks/${editId}`
          : 'http://localhost:6001/upload';

        await axios[editId ? 'patch' : 'post'](url, formData);
        setFormData(initialState);
        setEditId(null);
        fetchStudents();
        setError({});
      } catch (err) {
        console.error('Submit error:', err);
      }
    } else {
      setError(validationError);
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

  const validation = () => {
    const newError = {};

    if (!formData.firstName.trim()) newError.firstName = "First name is required";

    if (!formData.email) newError.email = "Invalid email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newError.email = "Missing @ or .com";

    if (!formData.password) newError.password = "Invalid password";
    else {
      if (formData.password.length < 6) newError.password = "Minimum 6 characters";
      if (!/[a-z]/.test(formData.password)) newError.password = "Must contain lowercase";
      if (!/[A-Z]/.test(formData.password)) newError.password = "Must contain uppercase";
      if (!/[!@#$%&*?]/.test(formData.password)) newError.password = "Include a special character";
    }
    if (formData.languages.length === 0) { 
      newError.languages = "Please select at least one language";
    }

    return newError;
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
          <label><input type="checkbox" name="languages" value="English" checked={formData.languages.includes("English")} onChange={handleChange} /> English</label><br />
          <label><input type="checkbox" name="languages" value="Tamil" checked={formData.languages.includes("Tamil")} onChange={handleChange} /> Tamil</label><br />
          <label><input type="checkbox" name="languages" value="Malayalam" checked={formData.languages.includes("Malayalam")} onChange={handleChange} /> Malayalam</label><br />
          <label><input type="checkbox" name="languages" value="Kanata" checked={formData.languages.includes("Kanata")} onChange={handleChange} /> Kanata</label><br />
          <label><input type="checkbox" name="languages" value="Telugu" checked={formData.languages.includes("Telugu")} onChange={handleChange} /> Telugu</label>
          {error.languages && <p style={{ color: 'red' }}>{error.languages}</p>}
          
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
          <label><input type="radio" name="Passed_Out_Year" value="2024" checked={formData.Passed_Out_Year === "2024"} onChange={handleChange} /> 2024</label><br />
          <label><input type="radio" name="Passed_Out_Year" value="2023" checked={formData.Passed_Out_Year === "2023"} onChange={handleChange} /> 2023</label><br />
          <label><input type="radio" name="Passed_Out_Year" value="2022" checked={formData.Passed_Out_Year === "2022"} onChange={handleChange} /> 2022</label><br />
          <label><input type="radio" name="Passed_Out_Year" value="2021" checked={formData.Passed_Out_Year === "2021"} onChange={handleChange} /> 2021</label><br />
          <label><input type="radio" name="Passed_Out_Year" value="2020" checked={formData.Passed_Out_Year === "2020"} onChange={handleChange} /> 2020</label><br />
          <label><input type="radio" name="Passed_Out_Year" value="Others" checked={formData.Passed_Out_Year === "Others"} onChange={handleChange} /> Others</label>
          {error.Passed_Out_Year && <p style={{ color: 'red' }}>{error.Passed_Out_Year}</p>}
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

form {
  max-width: 600px;
  margin: 20px auto;
  padding: 25px;
  background: #f4f4f4;
  border-radius: 12px;
}

form h1, form h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="date"],
input[type="number"],
input[type="month"],
input[type="datetime-local"],
select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.checkbox-option,
.radio-option {
  margin-right: 10px;
  display: inline-block;
}

.radio-group,
.checkbox-group {
  margin-top: 5px;
  margin-bottom: 15px;
}

input[type="range"] {
  width: 100%;
}

input[type="submit"],
input[type="reset"] {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  margin-top: 10px;
}

input[type="reset"] {
  background-color: #e74c3c;
}

img {
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

table{
  padding-left: 400px;
}

const express = require ('express')
const cors =require('cors')
const app = express();
const port =6001;
app.use (cors());
app.use(express.json())


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = "mongodb+srv://praviipravii7:LSQdy00UM8vtFx4Z@cluster0.qpvyubh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const dolls=client.db("Studentslist").collection("studentdata");

    app.post("/upload",async(req,res)=>{
        const data=req.body;
        const result=await dolls.insertOne(data);
        res.send(result);
    })
    
    
    app.get("/sns",async(req,res)=>{
        const foods=dolls.find();
        const result=await foods.toArray();
        res.send(result);
    })

    app.get("/snsbyid/:id",async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const result=await dolls.findOne(filter);
      res.send(result);
    })
    
    app.patch("/allproductsnacks/:id",async(req,res)=>{
      
        const id=req.params.id;
        
  const updateFooddata = { ...req.body };
  delete updateFooddata._id;

        const filter={_id:new ObjectId(id)};

        const updateDoc={
            $set:{
                ...updateFooddata
            },
        }
        const options ={upsert:true};

        const result=await dolls.updateOne(filter,updateDoc,options);
        res.send(result);
    })

    app.delete('/deletesnack/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id)
        const filter={_id:new ObjectId(id)};
        const result=await dolls.deleteOne(filter);
        res.status(200).json({success:true , message:"data deleted successfully", result});
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen (port, ()=>{
    console.log(`conected to ${port}`)
}
)








