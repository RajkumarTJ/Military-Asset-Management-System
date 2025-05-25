import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assetAPI, purchaseAPI, transferAPI, assignmentAPI } from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [equipmentType, setEquipmentType] = useState("All");
  const [base, setBase] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const equipmentTypes = ["All", "Vehicle", "Weapon", "Ammunition"];
  const baseOptions = ["All", "Alpha Base", "Bravo Base", "Charlie Base"];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [assetRes, purchaseRes, transferRes, assignmentRes] = await Promise.all([
          assetAPI.getAll(),
          purchaseAPI.getAll(),
          transferAPI.getAll(),
          assignmentAPI.getAll()
        ]);

        const enrichedAssets = assetRes.data.map((asset, index) => {
          const name = asset.name;

          const purchases = purchaseRes.data
            .filter(p => p.name === name)
            .reduce((sum, p) => sum + p.quantity, 0);

          const transferIn = transferRes.data
            .filter(t => t.assetName === name && t.destinationBase)
            .reduce((sum, t) => sum + t.quantity, 0);

          const transferOut = transferRes.data
            .filter(t => t.assetName === name && t.sourceBase)
            .reduce((sum, t) => sum + t.quantity, 0);

          const assigned = assignmentRes.data
            .filter(a => a.assetName === name)
            .reduce((sum, a) => sum + a.assignedQuantity, 0);

          const expended = assignmentRes.data
            .filter(a => a.assetName === name)
            .reduce((sum, a) => sum + a.expendedQuantity, 0);

          const netMovement = purchases + transferIn - transferOut;

          return {
            ...asset,
            purchases,
            transferIn,
            transferOut,
            assigned,
            expended,
            netMovement,
            baseName: baseOptions[index % baseOptions.length],
            createdAt: new Date().toISOString().split('T')[0]
          };
        });

        setAssets(enrichedAssets);
        setFilteredAssets(enrichedAssets);
      } catch (error) {
        toast.error("Error loading dashboard data");
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  useEffect(() => {
    let temp = [...assets];

    if (equipmentType !== "All") {
      temp = temp.filter(asset => asset.type === equipmentType);
    }
    if (base !== "All") {
      temp = temp.filter(asset => asset.baseName === base);
    }
    if (selectedDate) {
      temp = temp.filter(asset => asset.createdAt === selectedDate);
    }

    setFilteredAssets(temp);
  }, [equipmentType, base, selectedDate, assets]);

  const grouped = {
    Vehicle: [],
    Weapon: [],
    Ammunition: []
  };

  filteredAssets.forEach(asset => {
    if (grouped[asset.type]) {
      grouped[asset.type].push(asset);
    }
  });

  const renderGroup = (label, items) => (
    <div className="asset-group">
      <h2>{label}</h2>
      {items.length === 0 ? (
        <p className="no-data">No items found</p>
      ) : (
        <div className="asset-grid">
          {items.map(asset => (
            <div key={asset.id} className="asset-card">
              <h3>{asset.name}</h3>
              <div className="asset-details">
                <div className="detail-row">
                  <span>Opening Balance:</span>
                  <span>{asset.openingBalance}</span>
                </div>
                <div className="detail-row">
                  <span>Closing Balance:</span>
                  <span>{asset.closingBalance}</span>
                </div>
                <div className="detail-row">
                  <span>Net Movement:</span>
                  <span>{asset.netMovement}</span>
                </div>
                <div className="detail-row">
                  <span>Assigned:</span>
                  <span>{asset.assigned}</span>
                </div>
                <div className="detail-row">
                  <span>Expended:</span>
                  <span>{asset.expended}</span>
                </div>
                <div className="detail-row">
                  <span>Base:</span>
                  <span>{asset.baseName}</span>
                </div>
              </div>
              <button className="view-details-button" onClick={() => openModal(asset)}>
                View Movement Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const openModal = (asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAsset(null);
    setShowModal(false);
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="filters">
            <div className="filter-group">
              <label>Equipment Type:</label>
              <select 
                value={equipmentType} 
                onChange={e => setEquipmentType(e.target.value)}
                className="form-control"
              >
                {equipmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Base:</label>
              <select 
                value={base} 
                onChange={e => setBase(e.target.value)}
                className="form-control"
              >
                {baseOptions.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Date:</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : (
          <div className="dashboard-content">
            {renderGroup("🚗 Vehicles", grouped.Vehicle)}
            {renderGroup("🔫 Weapons", grouped.Weapon)}
            {renderGroup("💣 Ammunition", grouped.Ammunition)}
          </div>
        )}

        {showModal && selectedAsset && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Movement Details for {selectedAsset.name}</h3>
              <div className="modal-details">
                <div className="detail-row">
                  <span>Purchases:</span>
                  <span>{selectedAsset.purchases}</span>
                </div>
                <div className="detail-row">
                  <span>Transfer In:</span>
                  <span>{selectedAsset.transferIn}</span>
                </div>
                <div className="detail-row">
                  <span>Transfer Out:</span>
                  <span>{selectedAsset.transferOut}</span>
                </div>
                <div className="detail-row">
                  <span>Net Movement:</span>
                  <span>{selectedAsset.netMovement}</span>
                </div>
              </div>
              <button className="close-button" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
