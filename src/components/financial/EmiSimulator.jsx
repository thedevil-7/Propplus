import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { formatPropertyValue } from '../../utils/formatters';

export const EmiSimulator = ({ property, planUsed, setCurrentView }) => {
  const isFree = planUsed === 'free';
  const propertyPrice = property?.predictedValue || 8019000;
  
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [isYearly, setIsYearly] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(170000);
  
  const downPaymentAmount = (propertyPrice * downPaymentPct) / 100;
  const loanAmount = propertyPrice - downPaymentAmount;

  // EMI Calculation
  const calculateEMI = (principal, rateAnnual, years) => {
    if (principal <= 0) return 0;
    const r = (rateAnnual / 12) / 100;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const monthlyEmi = calculateEMI(loanAmount, interestRate, tenureYears);
  const yearlyEmi = monthlyEmi * 12;
  const totalPayment = monthlyEmi * tenureYears * 12;
  const totalInterest = totalPayment - loanAmount;

  const displayEmi = isYearly ? yearlyEmi : monthlyEmi;
  const displayLabel = isYearly ? '/ year' : '/ month';

  // Affordability
  const emiToIncomeRatio = monthlyIncome > 0 ? (monthlyEmi / monthlyIncome) * 100 : 0;
  let affordabilityStatus = 'moderate';
  if (emiToIncomeRatio <= 40) affordabilityStatus = 'comfortable';
  else if (emiToIncomeRatio > 50) affordabilityStatus = 'high';

  const affordabilityScore = useMemo(() => {
    let score = 100;
    score -= Math.max(0, (emiToIncomeRatio - 30)); 
    score += (downPaymentPct - 20) * 0.5;
    return Math.max(10, Math.min(99, Math.round(score)));
  }, [emiToIncomeRatio, downPaymentPct]);

  const recommendedBudgetRange = useMemo(() => {
    // Basic back calculation assuming 40% income goes to EMI
    const maxEmi = monthlyIncome * 0.4;
    const r = (interestRate / 12) / 100;
    const n = tenureYears * 12;
    const maxLoan = maxEmi * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    const maxProperty = maxLoan / (1 - (downPaymentPct / 100));
    const minProperty = maxProperty * 0.85;
    return [minProperty, maxProperty];
  }, [monthlyIncome, interestRate, tenureYears, downPaymentPct]);

  const nexaInsight = useMemo(() => {
    if (affordabilityStatus === 'comfortable') {
      return `This property appears comfortably affordable based on your current income and selected loan structure. Your estimated EMI is ${Math.round(emiToIncomeRatio)}% of your monthly income, which is within the selected affordability range.`;
    } else if (affordabilityStatus === 'high') {
      return `The current loan structure may place a high monthly burden on your income (${Math.round(emiToIncomeRatio)}%). Consider increasing the down payment or selecting a longer tenure.`;
    }
    return `This property is potentially affordable, but your EMI represents a significant portion (${Math.round(emiToIncomeRatio)}%) of your monthly income.`;
  }, [affordabilityStatus, emiToIncomeRatio]);

  const handleSavePlan = () => {
    alert("Affordability plan saved successfully.");
  };

  const handleExploreProperties = () => {
    if (setCurrentView) {
      setCurrentView('properties');
    } else {
      alert("Navigating to explore properties within budget...");
    }
  };

  const propertyImage = property?.primaryImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: '12px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge stitch-pill-royal" style={{ marginBottom: '0.5rem' }}>Financial Analysis</span>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
          CAN YOU AFFORD THIS PROPERTY?
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Calculate your EMI, loan details and affordability instantly with PropPulse AI.
        </p>
      </div>

      {/* Selected Property Header */}
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', background: 'var(--bg-surface-secondary)', borderRadius: '12px', marginBottom: '2rem', alignItems: 'center' }}>
        <img src={propertyImage} alt="Property" style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: 'var(--primary-700)' }}>
            {property?.bedrooms || 3} BHK {property?.propertyType || 'Property'}
          </h3>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            {property?.locality || 'Locality'}, {property?.location || 'City'} • {property?.area || 1800} sq.ft
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            AI Estimated Value: {formatPropertyValue(propertyPrice)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Inputs */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Property Price <span title="Property value is based on the PropPulse AI valuation." style={{cursor:'help'}}>ℹ️</span></label>
              <span style={{ fontWeight: 700 }}>{formatPropertyValue(propertyPrice)}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Property value is based on the PropPulse AI valuation.
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Down Payment ({downPaymentPct}%)</label>
              <span style={{ fontWeight: 700 }}>{formatPropertyValue(downPaymentAmount)}</span>
            </div>
            <input 
              type="range" min="10" max="60" step="5" 
              value={downPaymentPct} 
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '0.5rem', accentColor: 'var(--primary-600)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--primary-600)' }}>
              {[10, 20, 30, 40, 50, 60].map(pct => (
                <span key={pct} onClick={() => setDownPaymentPct(pct)} style={{ cursor: 'pointer', fontWeight: downPaymentPct === pct ? 700 : 400 }}>
                  {pct}%
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loan Amount</span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-700)' }}>{formatPropertyValue(loanAmount)}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{100 - downPaymentPct}% of property value</div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Interest Rate (p.a.)</label>
              <span style={{ fontWeight: 700 }}>{interestRate}%</span>
            </div>
            <input 
              type="range" min="6" max="15" step="0.1" 
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-600)' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Loan Tenure</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[10, 15, 20, 25, 30].map(yr => (
                <button 
                  key={yr}
                  onClick={() => setTenureYears(yr)}
                  style={{ 
                    padding: '8px 12px', borderRadius: '8px', 
                    border: `1px solid ${tenureYears === yr ? 'var(--primary-600)' : 'var(--border-medium)'}`,
                    background: tenureYears === yr ? 'var(--primary-600)' : '#FFF',
                    color: tenureYears === yr ? '#FFF' : 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 600
                  }}
                >
                  {yr} Years
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', background: 'var(--bg-surface-secondary)', padding: '4px', borderRadius: '8px' }}>
              <button onClick={() => setIsYearly(false)} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: !isYearly ? '#FFF' : 'transparent', fontWeight: !isYearly ? 700 : 500, color: !isYearly ? 'var(--primary-700)' : 'var(--text-secondary)', boxShadow: !isYearly ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}>Monthly</button>
              <button onClick={() => setIsYearly(true)} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: isYearly ? '#FFF' : 'transparent', fontWeight: isYearly ? 700 : 500, color: isYearly ? 'var(--primary-700)' : 'var(--text-secondary)', boxShadow: isYearly ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}>Yearly</button>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '2rem', background: '#FFFFFF', border: '2px solid var(--primary-100)', borderRadius: '16px', boxShadow: '0 8px 24px rgba(49,89,201,0.08)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Your Estimated EMI</h3>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-700)', lineHeight: 1.1 }}>
              ₹{Math.round(displayEmi).toLocaleString('en-IN')}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>{displayLabel}</div>
          </div>

          {/* Breakdown cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Loan Amount</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatPropertyValue(loanAmount)}</div>
            </div>
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Interest</div>
              <div style={{ fontWeight: 700, color: '#E11D48' }}>{formatPropertyValue(totalInterest)}</div>
            </div>
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Payment</div>
              <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{formatPropertyValue(totalPayment)}</div>
            </div>
          </div>

          {/* Payment Breakdown Chart (Simple CSS Conic Gradient approximation) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: '12px' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: `conic-gradient(#3159C9 0% ${(loanAmount/totalPayment)*100}%, #E11D48 ${(loanAmount/totalPayment)*100}% 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: '80px', height: '80px', background: '#FFF', borderRadius: '50%' }}></div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: '#3159C9', borderRadius: '3px' }}></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Principal ({Math.round((loanAmount/totalPayment)*100)}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: '#E11D48', borderRadius: '3px' }}></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Interest ({Math.round((totalInterest/totalPayment)*100)}%)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-medium)', margin: '3rem 0' }} />

      {/* Affordability Section */}
      <div>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 700 }}>Affordability Analysis</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ padding: '1.5rem', background: 'var(--bg-surface-secondary)', borderRadius: '12px' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Your Monthly Income</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>₹</span>
              <input 
                type="number" 
                value={monthlyIncome} 
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="form-input" 
                style={{ fontSize: '1.1rem', padding: '0.75rem', width: '100%' }} 
              />
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>/ month</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>EMI to Income Ratio</span>
              <span style={{ 
                fontWeight: 800, fontSize: '1.25rem', 
                color: affordabilityStatus === 'comfortable' ? '#059669' : affordabilityStatus === 'high' ? '#DC2626' : '#D97706' 
              }}>
                {Math.round(emiToIncomeRatio)}%
              </span>
            </div>
            
            {/* Status indicator bar */}
            <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', width: `${Math.min(100, emiToIncomeRatio)}%`,
                background: affordabilityStatus === 'comfortable' ? '#10B981' : affordabilityStatus === 'high' ? '#EF4444' : '#F59E0B'
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <span>0%</span>
              <span>40% (Comfortable)</span>
              <span>100%</span>
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: '#FFFFFF', border: '2px solid var(--border-medium)', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>PropPulse Affordability Score</h4>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary-700)', lineHeight: 1 }}>{affordabilityScore} <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/ 100</span></div>
          </div>
        </div>

        {/* Premium Features area */}
        <div style={{ marginTop: '2rem', position: 'relative' }}>
          
          {isFree && (
            <div style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
              background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', zIndex: 10,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'
            }}>
              <div style={{ background: '#FFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px' }}>
                <ShieldAlert size={40} className="text-secondary" style={{ marginBottom: '1rem', color: 'var(--primary-600)' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Unlock Advanced Insights</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Premium users get access to NexaAgent financial insights, AI recommended budgets, and scenario comparisons.</p>
                <button className="btn btn-primary" style={{ width: '100%', background: 'var(--accent-gold)', color: '#000', borderColor: 'var(--accent-gold)' }}>Upgrade to Premium</button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: '#F0F5FF', borderRadius: '12px', border: '1px solid #D6E4FF' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E3A8A' }}>
                <span style={{ fontSize: '1.25rem' }}>✦</span> NexaAgent Insight
              </h4>
              <p style={{ fontSize: '1rem', color: '#1E3A8A', lineHeight: 1.6, margin: 0 }}>
                "{nexaInsight}"
              </p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--border-medium)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>AI Recommended Budget</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-700)', marginBottom: '0.5rem' }}>
                {formatPropertyValue(recommendedBudgetRange[0])} – {formatPropertyValue(recommendedBudgetRange[1])}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Recommended EMI Range: <br/>
                <span style={{ fontWeight: 600 }}>₹{Math.round(monthlyIncome*0.25).toLocaleString('en-IN')} – ₹{Math.round(monthlyIncome*0.35).toLocaleString('en-IN')} / month</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            
            <div style={{ border: '1px solid var(--border-medium)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-surface-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border-medium)' }}>Down Payment Scenarios</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Down Payment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Loan Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Monthly EMI</th>
                  </tr>
                </thead>
                <tbody>
                  {[10, 20, 30, 40].map(pct => {
                    const dpAmt = (propertyPrice * pct) / 100;
                    const lnAmt = propertyPrice - dpAmt;
                    const e = calculateEMI(lnAmt, interestRate, tenureYears);
                    return (
                      <tr key={pct} onClick={() => setDownPaymentPct(pct)} style={{ cursor: 'pointer', background: downPaymentPct === pct ? '#F0F5FF' : '#FFF', borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{formatPropertyValue(dpAmt)} ({pct}%)</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{formatPropertyValue(lnAmt)}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--primary-700)' }}>₹{Math.round(e).toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ border: '1px solid var(--border-medium)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-surface-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border-medium)' }}>Loan Tenure Comparison</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Tenure</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Monthly EMI</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Interest</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {[10, 15, 20, 25, 30].map(yr => {
                    const e = calculateEMI(loanAmount, interestRate, yr);
                    const totPay = e * yr * 12;
                    const totInt = totPay - loanAmount;
                    return (
                      <tr key={yr} onClick={() => setTenureYears(yr)} style={{ cursor: 'pointer', background: tenureYears === yr ? '#F0F5FF' : '#FFF', borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{yr} Years</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--primary-700)' }}>₹{Math.round(e).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{formatPropertyValue(totInt)}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{formatPropertyValue(totPay)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-lg" style={{ flex: 1, padding: '1rem' }} onClick={() => alert("Full EMI analysis report generated.")}>
          View Full EMI Analysis →
        </button>
        <button className="btn btn-secondary btn-lg" style={{ padding: '1rem' }} onClick={handleSavePlan}>
          Save Plan
        </button>
        <button className="btn btn-secondary btn-lg" style={{ padding: '1rem', background: '#F8FAFC' }} onClick={handleExploreProperties}>
          Explore Properties Within My Budget →
        </button>
      </div>
      
    </div>
  );
};
