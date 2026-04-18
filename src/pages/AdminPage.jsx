import React from 'react';
import DashboardTable from '../components/DashboardTable';

const AdminPage = () => (
  <div>
    <div className="page-header container">
      <div className="page-header__eyebrow">🛠️ Admin Panel</div>
      <h1 className="page-header__title">
        Inventory <span className="gradient-text">Dashboard</span>
      </h1>
      <p className="page-header__sub">
        View and manage all inventory requests. Filter by status, search by any field,
        and mark items as returned directly from the table.
      </p>
    </div>
    <div className="container" style={{ paddingBottom: '80px' }}>
      <DashboardTable />
    </div>
  </div>
);

export default AdminPage;
