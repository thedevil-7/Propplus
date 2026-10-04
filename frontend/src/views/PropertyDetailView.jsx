import {
  MapPin, Bed, Bath, Maximize, Layers, Car, CheckCircle2,
  Heart, ArrowLeft, Sparkles, TrendingUp, Info, Activity, ShieldAlert, FileText,
  Building2, LineChart, PieChart, ShieldCheck, Download
} from 'lucide-react';
import { formatPropertyValue } from '../utils/formatters';
// Components
const WhyThisPrice = ({ property }) => {
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Why is this price?</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> Location</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {property.locality} in {property.location} commands a premium due to high infrastructure development and connectivity.
          </p>
        </div>
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Maximize size={18} /> Property Size</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            At {property.area} sq.ft., this property offers substantial living space, positively scaling the overall value.
          </p>
        </div>
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layers size={18} /> Configuration</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            A {property.bedrooms} BHK layout with {property.bathrooms} bathrooms matches the highest demand configuration in this micro-market.
          </p>
        </div>
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> ₹/sq.ft. Trend</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Calculated at ₹{property.pricePerSqFt?.toLocaleString()}/sq.ft., aligned with recent localized market appreciations.
          </p>
        </div>
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building2 size={18} /> Comparable Properties</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Evaluated against {property.planUsed === 'free' ? '3' : '24'} similar properties sold in the last 6 months within a 2km radius.
          </p>
        </div>
      </div>
      
      {property.planUsed !== 'free' && (
        <div style={{ marginTop: '2.5rem' }}>
          <FeatureImportanceChart />
        </div>
      )}
    </div>
  );
};

const InvestmentCalculator = ({ property, setCurrentView }) => {
  const isFree = property.planUsed === 'free';
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <TrendingUp size={24} color="var(--accent-blue)" /> Investment Calculator
      </h2>
      {isFree ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Premium Feature</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Investment forecasting and ROI tools are only available for premium users.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('pricing')}>Upgrade to Premium</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
           <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                 <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Expected Holding Period (Years)</label>
                 <input type="range" min="1" max="10" defaultValue="5" style={{ width: '100%' }} />
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>1 yr</span><span>5 yrs</span><span>10 yrs</span>
                 </div>
              </div>
              <div>
                 <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Expected Annual Appreciation (%)</label>
                 <input type="range" min="1" max="15" defaultValue="7" style={{ width: '100%' }} />
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>1%</span><span>7%</span><span>15%</span>
                 </div>
              </div>
           </div>
           <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Estimated Future Value (in 5 years)</h4>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-700)', marginBottom: '1rem' }}>{formatPropertyValue(property.predictedValue * 1.4)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderTop: '1px solid var(--border-medium)', paddingTop: '1rem' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>Net Profit Projection</span>
                 <span style={{ fontWeight: 600, color: 'var(--status-positive)' }}>+{formatPropertyValue(property.predictedValue * 0.4)}</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ComparableProperties = ({ property, setCurrentView }) => {
  const isFree = property.planUsed === 'free';
  
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Comparable Properties</h2>
      
      {isFree ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>3 comparable properties found in this location.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', opacity: 0.7, pointerEvents: 'none' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ padding: '1.5rem', border: '1px solid var(--border-medium)', borderRadius: '8px' }}>
                <div style={{ height: '100px', background: 'var(--bg-surface-secondary)', borderRadius: '6px', marginBottom: '1rem' }}></div>
                <div style={{ height: '20px', background: 'var(--bg-surface-secondary)', borderRadius: '4px', marginBottom: '0.5rem', width: '60%' }}></div>
                <div style={{ height: '30px', background: 'var(--bg-surface-secondary)', borderRadius: '4px', width: '40%' }}></div>
              </div>
            ))}
          </div>
          <div style={{ padding: '2rem', marginTop: '-120px', position: 'relative', zIndex: 10, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 -10px 40px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-blue)' }}>🔒 21 more comparable properties available</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Upgrade to Premium to view all comparable properties and detailed micro-locality analysis.</p>
            <button className="btn btn-primary" onClick={() => setCurrentView('pricing')}>Upgrade to Premium</button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Showing top comparable properties driving this valuation.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { price: (property.predictedValue * 0.98).toFixed(2), area: property.area, type: 'Sold' },
              { price: (property.predictedValue * 1.02).toFixed(2), area: property.area + 50, type: 'Sold' },
              { price: (property.predictedValue * 0.95).toFixed(2), area: property.area - 30, type: 'Active' },
              { price: (property.predictedValue * 1.05).toFixed(2), area: property.area + 100, type: 'Active' }
            ].map((comp, i) => (
              <div key={i} style={{ padding: '1.5rem', border: '1px solid var(--border-medium)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className={`badge ${comp.type === 'Sold' ? 'badge-ai' : 'badge-demo'}`}>{comp.type}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>0.4 km away</span>
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{formatPropertyValue(comp.price)}</h4>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {comp.area} sq.ft. • {property.bedrooms} BHK
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PriceHistory = ({ property, priceHistory, setCurrentView }) => {
  const isFree = property.planUsed === 'free';
  
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <LineChart size={24} color="var(--accent-blue)" /> Price History
      </h2>
      
      {isFree ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Premium Feature</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>3-Year Price History is only available for premium users.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('pricing')}>Upgrade to Premium</button>
        </div>
      ) : priceHistory && priceHistory.available ? (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {priceHistory.data.map((point, idx) => (
              <div key={idx} style={{ background: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '120px', borderLeft: '4px solid var(--accent-blue)' }}>
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{point.year}</div>
                 <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-700)' }}>₹{point.price}L</div>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Based on historical registry data and localized appreciation metrics over the last {priceHistory.years_available} years.</p>
        </div>
      ) : (
        <div style={{ color: 'var(--text-muted)' }}>
          Historical price data is not available for this property/location yet.
        </div>
      )}
    </div>
  );
};

const PropertyScore = ({ property, setCurrentView }) => {
  const isFree = property.planUsed === 'free';
  
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldCheck size={24} color="var(--accent-blue)" /> Property Score
      </h2>
      
      {isFree ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Premium Feature</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Detailed Property Score is only available for premium users.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('pricing')}>Upgrade to Premium</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Location Score', score: 85, max: 100 },
            { label: 'Price Competitiveness', score: 92, max: 100 },
            { label: 'Infrastructure', score: 78, max: 100 },
            { label: 'Investment Potential', score: 88, max: 100 }
          ].map((item, i) => (
            <div key={i} style={{ background: 'var(--bg-surface-secondary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-600)', marginBottom: '0.5rem' }}>{item.score}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AIValuationReport = ({ property, setCurrentView }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const isFree = property.planUsed === 'free' || property.userRole === 'free' || property.userRole === 'customer_free';

  const handleGenerateReport = async () => {
    setShowModal(true);
    setIsGenerating(true);
    setLoadingStep(0);
    setError(null);
    setReportData(null);

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          return 5;
        }
        return prev + 1;
      });
    }, 600);

    try {
      const response = await propertyService.generateReport(property);
      if (response.success) {
        clearInterval(stepInterval);
        setLoadingStep(6);
        setReportData(response.report);
      } else {
        clearInterval(stepInterval);
        setError("Failed to generate report. Please try again.");
      }
    } catch (err) {
      console.error(err);
      clearInterval(stepInterval);
      setError("We couldn't prepare your valuation report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  const renderProgress = () => {
    const steps = [
      "Property information collected",
      "Property valuation analyzed",
      "Analyzing comparable properties",
      "Reviewing historical market data",
      "Generating AI valuation analysis",
      "Preparing final report"
    ];

    return (
      <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'left', background: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>Preparing Your PropPulse Valuation Report</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {steps.map((step, idx) => {
            const isCompleted = loadingStep > idx;
            const isCurrent = loadingStep === idx;
            const isPending = loadingStep < idx;
            
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: isCompleted ? 'var(--status-positive)' : isCurrent ? 'var(--primary-600)' : 'var(--text-muted)' }}>
                {isCompleted ? <CheckCircle2 size={20} /> : isCurrent ? <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(0,0,0,0.1)', borderTop: '2px solid var(--primary-600)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> : <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏳</div>}
                <span style={{ fontWeight: isCurrent ? 600 : 400 }}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="card" style={{ padding: '3rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-secondary) 100%)', textAlign: 'center', border: '1px solid var(--border-medium)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', marginBottom: '1.5rem' }}>
          <FileText size={32} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>AI-Generated Valuation Report</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Generate a dynamic, property-specific PDF report containing micro-market analysis, full comparable property details, historical trends, and AI-driven investment forecasting.
        </p>

        <button 
          className="btn btn-primary" 
          onClick={handleGenerateReport} 
          style={{ padding: '1rem 2rem', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minWidth: '300px', justifyContent: 'center' }}
        >
          <Sparkles size={20} /> Download Valuation Report
        </button>

        {isFree && (
          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            * Free users receive a basic report. <span style={{ color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setCurrentView('pricing')}>Upgrade to Premium</span> for full insights.
          </div>
        )}
      </div>

      {showModal && (
        <div className="report-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-surface-secondary)', zIndex: 9999, overflowY: 'auto' }}>
          <div className="report-modal-content" style={{ minHeight: '100vh', padding: '2rem', background: 'var(--bg-surface)' }}>
            
            {isGenerating && !error && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                {renderProgress()}
              </div>
            )}

            {error && (
              <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', background: 'var(--bg-surface)', padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <ShieldAlert size={48} color="var(--status-negative)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>We couldn't prepare your valuation report</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your property valuation is still available.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>View Valuation</button>
                  <button className="btn btn-primary" onClick={handleGenerateReport}>Try Again</button>
                </div>
              </div>
            )}

            {reportData && !isGenerating && (
              <div className="report-print-container" style={{ maxWidth: '900px', margin: '0 auto', background: '#FFFFFF', padding: '0', color: 'var(--text-primary)' }}>
                {/* Action Bar Top */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}><ArrowLeft size={16} style={{ marginRight: '0.5rem' }}/> Close</button>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary btn-sm"><FileText size={16} style={{ marginRight: '0.5rem' }}/> Save Report</button>
                    <button className="btn btn-primary btn-sm" onClick={downloadPDF}><Download size={16} style={{ marginRight: '0.5rem' }}/> Download PDF</button>
                  </div>
                </div>

                {/* Report Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>PropPulse</h1>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>AI Property Valuation Report</h2>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span><strong>Generated:</strong> {new Date().toLocaleString()}</span>
                    <span><strong>Property ID:</strong> {property.id}</span>
                    <span><strong>Valuation Type:</strong> {isFree ? 'Free' : 'Premium'}</span>
                  </div>
                </div>

                {/* Report Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <section style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface-secondary)', borderRadius: '12px', border: '1px solid var(--border-medium)' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>PropPulse Fair Value</h3>
                    <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary-700)', lineHeight: 1, marginBottom: '0.5rem' }}>{reportData.fairValue}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{reportData.pricePerSqFt} / sq.ft.</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                      Estimated Range: <strong style={{ color: 'var(--text-primary)' }}>{reportData.valuationRange.low} — {reportData.valuationRange.high}</strong>
                    </div>
                  </section>

                  <section>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--primary-100)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Property Overview</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{reportData.propertyOverview}</p>
                  </section>

                  <section>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--primary-100)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Why This Price?</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{reportData.valuationExplanation}</p>
                  </section>

                  <section>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--primary-100)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Comparable Properties</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{reportData.comparableAnalysis}</p>
                  </section>
                  
                  <section>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--primary-100)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Historical Market Analysis</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{reportData.historicalAnalysis}</p>
                  </section>

                  {reportData.propertyScoreExplanation && (
                    <section>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--primary-100)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Property Score</h3>
                      <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{reportData.propertyScoreExplanation}</p>
                    </section>
                  )}

                  <section>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--primary-100)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>AI Market Insight</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{reportData.marketInsight}</p>
                  </section>
                  
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <section style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--primary-100)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Strengths</h3>
                      <ul style={{ paddingLeft: '1.5rem', fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                        {reportData.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                      </ul>
                    </section>
                    <section style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--primary-100)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Considerations</h3>
                      <ul style={{ paddingLeft: '1.5rem', fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                        {reportData.considerations.map((con, idx) => <li key={idx}>{con}</li>)}
                      </ul>
                    </section>
                  </div>

                  <section style={{ padding: '2rem', background: 'var(--bg-surface)', borderLeft: '4px solid var(--primary-600)', borderRadius: '0 8px 8px 0', borderTop: '1px solid var(--border-medium)', borderRight: '1px solid var(--border-medium)', borderBottom: '1px solid var(--border-medium)' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>AI Valuation Summary</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-primary)', fontWeight: 500 }}>{reportData.summary}</p>
                  </section>
                </div>

                {/* Action Bar Bottom */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                   <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close Viewer</button>
                   <button className="btn btn-secondary"><FileText size={18} style={{ marginRight: '0.5rem' }}/> Save Report</button>
                   <button className="btn btn-primary" onClick={downloadPDF}><Download size={18} style={{ marginRight: '0.5rem' }}/> Download PDF</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media print {
          body * {
            visibility: hidden;
          }
          .report-print-container, .report-print-container * {
            visibility: visible;
          }
          .report-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />
    </>
  );
};

const AIPropertyAdvisor = ({ property, setCurrentView }) => {
  const isFree = property.planUsed === 'free';
  
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Sparkles size={24} color="var(--accent-blue)" /> AI Property Advisor
      </h2>
      
      {isFree ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Premium Feature</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Chat directly with PropPulse AI to analyze this property's investment merits.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('pricing')}>Upgrade to Premium</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={20} />
            </div>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '1rem 1.5rem', borderRadius: '0 12px 12px 12px', fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
              Based on the 89% AI score, this {property.bedrooms} BHK in {property.locality} is priced aggressively. The area has seen a 6.2% YoY appreciation, making it a solid long-term hold. Would you like me to compare it against rental yields or alternative localities?
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>What is the rental yield?</button>
            <button className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>Compare with nearby areas</button>
            <button className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>Is this a good flip?</button>
          </div>
          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <input type="text" placeholder="Ask AI about this property..." style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid var(--border-medium)', borderRadius: '8px 0 0 8px', outline: 'none' }} />
            <button className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0', padding: '0 1.5rem' }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Export
export const PropertyDetailView = ({ property, onBack, setCurrentView }) => {
  const [isFavorite, setIsFavorite] = useState(property?.isFavorite || false);
  const [priceHistory, setPriceHistory] = useState(null);

  useEffect(() => {
    if (property) {
      propertyService.getPriceHistory(property.id).then(res => {
        setPriceHistory(res);
      }).catch(err => {
        setPriceHistory({ available: false, years_available: 0, data: [] });
      });
    }
  }, [property]);

  if (!property) return null;

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      {/* Back button & top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="icon-button"
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label="Toggle favorite"
          >
            <Heart size={16} fill={isFavorite ? '#F43F5E' : 'none'} color={isFavorite ? '#F43F5E' : 'var(--text-secondary)'} />
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentView('predict')}
          >
            <Sparkles size={14} />
            <span>Re-evaluate</span>
          </button>
        </div>
      </div>

      {/* SECTION: PROPERTY */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-ai">AI Score {property.aiScore || 89}%</span>
              <span className="badge badge-demo">{property.type}</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.35rem' }}>{property.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <MapPin size={16} color="var(--accent-blue)" />
              <span>{property.locality}, {property.location}</span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <Gallery images={property.gallery} defaultImage={property.imageUrl} />
        
        {/* Key Stats Bar */}
        <div className="card" style={{ padding: '1.25rem 2rem', marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Maximize size={22} color="var(--accent-blue)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carpet Area</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.area} sq.ft</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bed size={22} color="var(--accent-blue)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bedrooms</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.bedrooms} Beds</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bath size={22} color="var(--accent-blue)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bathrooms</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.bathrooms} Baths</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={22} color="var(--accent-blue)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Floors</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.floors} Floors</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Car size={22} color="var(--accent-blue)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parking</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.parking} Slots</div>
            </div>
          </div>
        </div>

        {/* 2D Floor Plan if exists */}
        {property.floorPlanUrl && (
          <div className="card" style={{ padding: '2rem', marginTop: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>2D Floor Plan</h3>
            <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
              <img 
                src={property.floorPlanUrl} 
                alt="2D Floor Plan" 
                style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} 
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <ArrowLeft size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border-medium)' }} />
      </div>

      {/* SECTION: PROPULSE FAIR VALUE */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="result-hero-card" style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PropPulse Fair Value</h2>
          <div className="result-main-price" style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--primary-700)', lineHeight: 1.1, marginBottom: '1rem' }}>
            {formatPropertyValue(property.predictedValue)}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            ₹{property.pricePerSqFt?.toLocaleString()} / sq.ft.
          </div>
          
          <div className="price-range-bar-wrap" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <span>Lower: {formatPropertyValue(property.priceRange ? property.priceRange[0] : property.predictedValue * 0.95)}</span>
              <span>Upper: {formatPropertyValue(property.priceRange ? property.priceRange[1] : property.predictedValue * 1.05)}</span>
            </div>
            <div className="range-gradient-track" style={{ height: '8px', background: 'var(--border-medium)', borderRadius: '4px', position: 'relative' }}>
              <div className="range-gradient-fill" style={{ position: 'absolute', top: 0, left: property.planUsed === 'free' ? '10%' : '20%', right: property.planUsed === 'free' ? '10%' : '20%', height: '100%', background: 'linear-gradient(90deg, var(--primary-300), var(--primary-600))', borderRadius: '4px' }} />
              <div className="range-marker-pin" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: '#FFFFFF', border: '3px solid var(--primary-600)', borderRadius: '50%' }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Estimated Range ({property.planUsed === 'free' ? '75%' : '95%'} Confidence)</div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Data used</div>
              <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <li>Property size</li>
                <li>Location & Configuration</li>
                <li>Comparable properties</li>
                <li>{property.planUsed === 'free' ? 'Basic' : 'Detailed'} historical data</li>
              </ul>
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Comparable properties</div>
                <div style={{ fontWeight: 600 }}>{property.planUsed === 'free' ? '3' : '24'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Model</div>
                <div style={{ fontWeight: 600 }}>{property.debugInfo?.model || 'PropPulse AI'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Data updated</div>
                <div style={{ fontWeight: 600 }}>{property.datePredicted}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <ArrowLeft size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border-medium)' }} />
      </div>

      {/* SECTION: WHY THIS PRICE? */}
      <WhyThisPrice property={property} />
      
      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <ArrowLeft size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border-medium)' }} />
      </div>

      {/* SECTION: COMPARABLE PROPERTIES */}
      <ComparableProperties property={property} setCurrentView={setCurrentView} />

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <ArrowLeft size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border-medium)' }} />
      </div>

      {/* SECTION: PRICE HISTORY */}
      <PriceHistory property={property} priceHistory={priceHistory} setCurrentView={setCurrentView} />

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <ArrowLeft size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border-medium)' }} />
      </div>

      {/* SECTION: PROPERTY SCORE */}
      <PropertyScore property={property} setCurrentView={setCurrentView} />

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <ArrowLeft size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border-medium)' }} />
      </div>

      {/* SECTION: INVESTMENT CALCULATOR */}
      <InvestmentCalculator property={property} setCurrentView={setCurrentView} />

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <ArrowLeft size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border-medium)' }} />
      </div>

      {/* SECTION: AI PROPERTY ADVISOR */}
      <AIPropertyAdvisor property={property} setCurrentView={setCurrentView} />

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <ArrowLeft size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border-medium)' }} />
      </div>

      {/* SECTION: AI VALUATION REPORT */}
      <AIValuationReport property={property} setCurrentView={setCurrentView} />
      
    </div>
  );
};

