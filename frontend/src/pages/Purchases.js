import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import { toast } from "react-toastify";
import { purchaseAPI } from "../services/api";

function Purchases() {
  const [form, setForm] = useState({
    name: "",
    type: "Vehicle",
    quantity: "",
    baseName: "Alpha Base",
    date: new Date().toISOString().split('T')[0]
  });

  const [purchases, setPurchases] = useState([]);
  const navigate = useNavigate();
  const baseOptions = ["Alpha Base", "Bravo Base", "Charlie Base"];
  const types = ["Vehicle", "Weapon", "Ammunition"];

  const fetchPurchases = async () => {
    try {
      const response = await purchaseAPI.getAll();
      setPurchases(response.data);
    } catch (error) {
      toast.error("Error loading purchases");
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const purchaseData = {
        name: form.name,
        type: form.type,
        quantity: parseInt(form.quantity),
        baseName: form.baseName,
        date: form.date
      };

      await purchaseAPI.create(purchaseData);
      toast.success("Purchase saved successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving purchase");
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-container">
        <div className="form-section">
          <h2>Record Purchase</h2>
          <form onSubmit={handleSubmit} className="data-form">
            <div className="form-group">
              <label>Asset Name:</label>
              <input 
                className="form-control"
                name="name" 
                placeholder="Enter asset name" 
                value={form.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Type:</label>
              <select 
                className="form-control"
                name="type" 
                value={form.type} 
                onChange={handleChange}
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
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

            <div className="form-group">
              <label>Date:</label>
              <input 
                className="form-control"
                type="date" 
                name="date" 
                value={form.date} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="submit-button">Save Purchase</button>
          </form>
        </div>

        <div className="data-section">
          <h3>Purchase History</h3>
          {purchases.length === 0 ? (
            <p className="no-data">No purchases recorded yet.</p>
          ) : (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Base</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.type}</td>
                      <td>{p.quantity}</td>
                      <td>{p.baseName}</td>
                      <td>{new Date(p.date).toLocaleDateString()}</td>
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

export default Purchases;
