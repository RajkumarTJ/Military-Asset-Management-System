import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import { toast } from "react-toastify";
import { assignmentAPI } from "../services/api";

function Assignments() {
  const [form, setForm] = useState({
    assetName: "",
    personnel: "",
    assignedQuantity: "",
    expendedQuantity: "0",
    baseName: "Alpha Base"
  });

  const [assignments, setAssignments] = useState([]);
  const baseOptions = ["Alpha Base", "Bravo Base", "Charlie Base"];
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const response = await assignmentAPI.getAll();
      setAssignments(response.data);
    } catch (error) {
      toast.error("Error loading assignments");
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignmentAPI.create(form);
      toast.success("Assignment recorded successfully!");
      await fetchAssignments();
      setForm({
        assetName: "",
        personnel: "",
        assignedQuantity: "",
        expendedQuantity: "0",
        baseName: "Alpha Base"
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save assignment");
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-container">
        <div className="form-section">
          <h2>Assign Asset</h2>
          <form onSubmit={handleSubmit} className="data-form">
            <div className="form-group">
              <label>Asset Name:</label>
              <input
                className="form-control"
                name="assetName"
                placeholder="Enter asset name"
                value={form.assetName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Personnel Name:</label>
              <input
                className="form-control"
                name="personnel"
                placeholder="Enter personnel name"
                value={form.personnel}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Assigned Quantity:</label>
              <input
                className="form-control"
                type="number"
                name="assignedQuantity"
                placeholder="Enter assigned quantity"
                value={form.assignedQuantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Expended Quantity:</label>
              <input
                className="form-control"
                type="number"
                name="expendedQuantity"
                placeholder="Enter expended quantity"
                value={form.expendedQuantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Base:</label>
              <select
                className="form-control"
                name="baseName"
                value={form.baseName}
                onChange={handleChange}
              >
                {baseOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <button type="submit" className="submit-button">Submit Assignment</button>
          </form>
        </div>

        <div className="data-section">
          <h3>Assignment History</h3>
          {assignments.length === 0 ? (
            <p className="no-data">No assignments recorded yet.</p>
          ) : (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Personnel</th>
                    <th>Assigned</th>
                    <th>Expended</th>
                    <th>Base</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id}>
                      <td>{a.assetName}</td>
                      <td>{a.personnel}</td>
                      <td>{a.assignedQuantity}</td>
                      <td>{a.expendedQuantity}</td>
                      <td>{a.baseName}</td>
                      <td>{new Date(a.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assignments;
