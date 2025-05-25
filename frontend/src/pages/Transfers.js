import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import { toast } from "react-toastify";
import { transferAPI } from "../services/api";

function Transfers() {
  const [form, setForm] = useState({
    assetName: "",
    quantity: "",
    sourceBase: "Alpha Base",
    destinationBase: "Bravo Base"
  });

  const [transfers, setTransfers] = useState([]);
  const baseOptions = ["Alpha Base", "Bravo Base", "Charlie Base"];
  const navigate = useNavigate();

  const fetchTransfers = async () => {
    try {
      const response = await transferAPI.getAll();
      setTransfers(response.data);
    } catch (error) {
      toast.error("Error loading transfers");
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.sourceBase === form.destinationBase) {
      toast.error("Source and destination bases must be different");
      return;
    }

    try {
      await transferAPI.create(form);
      toast.success("Transfer recorded successfully!");
      await fetchTransfers();
      setForm({
        assetName: "",
        quantity: "",
        sourceBase: "Alpha Base",
        destinationBase: "Bravo Base"
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record transfer");
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-container">
        <div className="form-section">
          <h2>Transfer Assets</h2>
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
              <label>Quantity:</label>
              <input
                className="form-control"
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>From (Source Base):</label>
              <select
                className="form-control"
                name="sourceBase"
                value={form.sourceBase}
                onChange={handleChange}
              >
                {baseOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>To (Destination Base):</label>
              <select
                className="form-control"
                name="destinationBase"
                value={form.destinationBase}
                onChange={handleChange}
              >
                {baseOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <button type="submit" className="submit-button">Transfer Asset</button>
          </form>
        </div>

        <div className="data-section">
          <h3>Transfer History</h3>
          {transfers.length === 0 ? (
            <p className="no-data">No transfers recorded yet.</p>
          ) : (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Quantity</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map(t => (
                    <tr key={t.id}>
                      <td>{t.assetName}</td>
                      <td>{t.quantity}</td>
                      <td>{t.sourceBase}</td>
                      <td>{t.destinationBase}</td>
                      <td>{new Date(t.timestamp).toLocaleString()}</td>
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

export default Transfers;
