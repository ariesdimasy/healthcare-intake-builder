"use client";

import { useEffect, useState } from "react";

// Mock interface for this page
interface TenantData {
  name: string;
  database: {
    host: string;
    port: number;
    db_name: string;
    username: string;
  };
  stats: {
    doctors_count: number;
    patients_count: number;
    responses_count: number;
  };
}

export default function SettingsPage() {
  const [tenant, setTenant] = useState<TenantData | null>(null);

  useEffect(() => {
    // Simulate fetching the logged-in tenant's database details
    const timer = setTimeout(() => {
      setTenant({
        name: "My Healthcare Clinic",
        database: {
          host: "db.platform.com",
          port: 5432,
          db_name: "tenant_myclinic",
          username: "usr_myclinic",
        },
        stats: {
          doctors_count: 5,
          patients_count: 120,
          responses_count: 350,
        },
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!tenant) {
    return (
      <div className="page-container">
        <div style={{ padding: "32px" }}>
           <div className="skeleton" style={{ height: "32px", width: "200px", borderRadius: "8px" }} />
           <div className="skeleton" style={{ height: "20px", width: "300px", borderRadius: "8px", marginTop: "12px" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings & Overview</h1>
        <p className="page-subtitle">View your dedicated database configuration and data statistics.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        
        {/* Database Configuration Card */}
        <div className="card" style={{ padding: "28px" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            🗄️ Database Configuration
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            This is your dedicated PostgreSQL database connection info.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                Host
              </label>
              <div style={{ padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.875rem", color: "#334155" }}>
                {tenant.database.host}
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                  Port
                </label>
                <div style={{ padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.875rem", color: "#334155" }}>
                  {tenant.database.port}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                  Username
                </label>
                <div style={{ padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.875rem", color: "#334155" }}>
                  {tenant.database.username}
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                Database Name
              </label>
              <div style={{ padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.875rem", color: "#334155" }}>
                {tenant.database.db_name}
              </div>
            </div>
          </div>
        </div>

        {/* Data Overview Card */}
        <div className="card" style={{ padding: "28px" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            📊 Data Overview
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            Quick summary of the data registered to your clinic.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.5rem" }}>👨‍⚕️</span>
                <span style={{ fontWeight: "600", color: "#334155" }}>Doctors</span>
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>{tenant.stats.doctors_count}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.5rem" }}>🏥</span>
                <span style={{ fontWeight: "600", color: "#334155" }}>Patients</span>
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>{tenant.stats.patients_count}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.5rem" }}>📄</span>
                <span style={{ fontWeight: "600", color: "#334155" }}>Form Responses</span>
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>{tenant.stats.responses_count}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
