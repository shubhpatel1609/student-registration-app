import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "/api";

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", rollNumber: "", age: "", email: "", course: "" });
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      setError("Backend thi connect nathi thai rahyu");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add student");
      setForm({ name: "", rollNumber: "", age: "", email: "", course: "" });
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/students/${id}`, { method: "DELETE" });
    fetchStudents();
  };

  return (
    <div className="container">
      <h1>Student Registration</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
          required
        />
        <input
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <button type="submit">Add Student</button>
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No.</th>
            <th>Age</th>
            <th>Email</th>
            <th>Course</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.rollNumber}</td>
              <td>{s.age}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>
                <button onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}