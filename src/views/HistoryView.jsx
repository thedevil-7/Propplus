import React, { useState } from 'react';
import {
  Search,
  Trash2,
  Eye,
  Calendar,
  Building,
  ArrowUpDown,
  History,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const HistoryView = ({
  history = [],
  onDeleteRecord,
  onSelectProperty,
  setCurrentView
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortField, setSortField] = useState('datePredicted');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter & Search logic
  const filtered = history.filter((item) => {
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase()) ||
      item.locality?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">Audit Trail & Record Storage</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>Prediction History</h1>
          <p className="section-desc">
            All historical machine learning appraisals, input specifications, and valuation reports.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setCurrentView('predict')}
        >
          <Sparkles size={16} />
          <span>New Valuation</span>
        </button>
      </div>

      {/* Controls Bar: Search, Filter, Sort */}
      <div className="history-controls-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by property, locality, city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Villa', 'Apartment', 'Independent House'].map((t) => (
            <button
              key={t}
              className={`toggle-chip ${filterType === t ? 'active' : ''}`}
              onClick={() => { setFilterType(t); setCurrentPage(1); }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* History Table or Empty State */}
      {paginated.length > 0 ? (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('datePredicted')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Date</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Property</th>
                <th>Location</th>
                <th onClick={() => toggleSort('area')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Area</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>BHK</th>
                <th onClick={() => toggleSort('predictedValue')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Predicted Price</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.datePredicted}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.type}</span>
                      </div>
                    </div>
                  </td>
                  <td>{item.locality}, {item.location.split(',')[0]}</td>
                  <td>{item.area} sq.ft</td>
                  <td>{item.bedrooms} BHK</td>
                  <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>
                    ₹{item.predictedValue}L
                  </td>
                  <td>
                    <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                      {item.status || "Verified"}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        className="icon-button"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => onSelectProperty && onSelectProperty(item)}
                        title="View Property Report"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="icon-button"
                        style={{ width: '30px', height: '30px', color: 'var(--status-negative)' }}
                        onClick={() => onDeleteRecord && onDeleteRecord(item.id)}
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing page {currentPage} of {totalPages} ({sorted.length} total records)
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="card empty-state-box">
          <div className="empty-state-icon">
            <History size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>No predictions yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
            You haven't run any valuations yet. Start by entering property parameters and photos to generate an estimate.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setCurrentView('predict')}
          >
            <Sparkles size={16} />
            <span>Predict Your First Property</span>
          </button>
        </div>
      )}
    </div>
  );
};
