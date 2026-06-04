"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (q: string) => void;
  searchValue?: string;
  actions?: React.ReactNode;
  emptyMessage?: string;
  // Pagination
  total?: number;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, ri) => (
        <tr key={ri}>
          {Array.from({ length: cols }).map((_, ci) => (
            <td key={ci} style={{ padding: "14px 16px" }}>
              <div
                className="skeleton"
                style={{ height: "14px", width: ci === 0 ? "60%" : "80%", borderRadius: "4px" }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  searchPlaceholder = "Cari...",
  onSearchChange,
  searchValue = "",
  actions,
  emptyMessage = "Tidak ada data ditemukan.",
  total = 0,
  page = 1,
  perPage = 10,
  onPageChange,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="data-table-container">
      {/* Table Header */}
      <div className="data-table-header">
        {onSearchChange && (
          <div className="data-table-search">
            <MagnifyingGlassIcon style={{ width: "16px", height: "16px", color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              id="data-table-search-input"
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
        {actions && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            {actions}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} style={{ width: col.width }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows cols={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <MagnifyingGlassIcon style={{ width: "24px", height: "24px", color: "var(--text-muted)" }} />
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={String(col.key)}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key as string] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && onPageChange && totalPages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} dari {total} data
          </span>
          <div className="pagination-controls">
            <button
              id="pagination-prev"
              className="pagination-btn"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  id={`pagination-page-${pageNum}`}
                  className={`pagination-btn ${pageNum === page ? "active" : ""}`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              id="pagination-next"
              className="pagination-btn"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
