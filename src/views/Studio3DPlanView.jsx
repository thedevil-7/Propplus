import React, { useState } from 'react';
import {
  Box,
  Compass,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Ruler,
  PhoneCall,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building,
  Layers,
  ZoomIn,
  Move,
  ArrowRight,
  Columns,
  MapPin,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ThreeDViewer } from '../components/3d/ThreeDViewer';
import { Tour360 } from '../components/3d/Tour360';
import { Interactive2DPlan } from '../components/architectural/Interactive2DPlan';

export const Studio3DPlanView = ({ property, setCurrentView, onShowToast }) => {
  // Active Main Studio View: 'walkthrough' | 'floorplan' | '2d_cad' | 'mapping' | 'split' | 'exterior' | 'vr'
  const [activeMode, setActiveMode] = useState('walkthrough');

  // Camera preset
  const [cameraMode, setCameraMode] = useState('orbit');

  // Lighting simulation: 'day' | 'golden' | 'twilight' | 'night'
  const [lighting, setLighting] = useState('twilight');

  // Measure mode laser line toggle
  const [measureMode, setMeasureMode] = useState(true);

  // Floor plan mode in right sidebar: 'iso' (3D cutaway) | 'cad' (2D CAD schematic)
  const [planMode, setPlanMode] = useState('iso');

  // Floating 2D Minimap / Radar state
  const [showMinimap, setShowMinimap] = useState(true);
  const [minimapCollapsed, setMinimapCollapsed] = useState(false);

  // Selected room hotspot inspection
  const [activeRoom, setActiveRoom] = useState({
    id: 'living',
    name: 'Double Height Living Room',
    desc: "24' x 16' • Floor to ceiling double glazed structural glass facing South-West",
    carpet: '360 sq.ft',
    finish: 'Italian Botticino Marble'
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

  const roomsList = [
    {
      id: 'living',
      name: 'Living & Dining Lounge',
      carpet: '360 sq.ft',
      finish: 'Italian Botticino Marble',
      desc: "24' x 16' • 384 sq.ft Italian Marble lounge with floor-to-ceiling glazing",
      zone: 'Public Entertaining',
      dotColor: 'var(--accent-cyan)'
    },
    {
      id: 'master',
      name: 'Master Suite (Bed 1)',
      carpet: '180 sq.ft',
      finish: 'Attached Bath & Balcony',
      desc: "15' x 16' • Walk-in dressing wardrobe and private skyline deck access",
      zone: 'Primary Sanctuary',
      dotColor: 'var(--primary-500)'
    },
    {
      id: 'bed2',
      name: 'Bedroom 2 (Guest Suite)',
      carpet: '145 sq.ft',
      finish: 'Wardrobe Niche & Ensuite',
      desc: "12' x 15' • Well-ventilated executive guest suite with fitted wardrobes",
      zone: 'Guest Sanctuary',
      dotColor: 'var(--accent-blue)'
    },
    {
      id: 'kitchen',
      name: 'Modular Italian Kitchen',
      carpet: '120 sq.ft',
      finish: 'Utility Deck & Pantry Attached',
      desc: '120 sq.ft • Quartz island counter with built-in European chimney and appliances',
      zone: 'Culinary & Service',
      dotColor: 'var(--status-positive)'
    },
    {
      id: 'balcony',
      name: 'Sunset Skyline Deck',
      carpet: '80 sq.ft',
      finish: 'Composite Wood & Glass Railing',
      desc: "16' x 5' • Panoramic west-facing cantilevered terrace overlooking horizon",
      zone: 'Outdoor Living',
      dotColor: 'var(--accent-amber)'
    },
    {
      id: 'foyer',
      name: 'Private Entrance Foyer',
      carpet: '70 sq.ft',
      finish: 'Textured Teak Panelling',
      desc: "10' x 7' • Private vestibule with biometric smart door and shoe niche",
      zone: 'Entryway',
      dotColor: '#94A3B8'
    }
  ];

  const handleSelectRoom = (r) => {
    setActiveRoom(r);
  };

  const handleCallbackClick = () => {
    if (onShowToast) onShowToast("Dealer callback requested! A certified PropPulse asset manager will contact you.", "success");
  };

  const handleDownloadPDF = () => {
    if (onShowToast) onShowToast("Downloading architectural CAD Specification Sheet (PDF)...", "info");
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('spatial-canvas-container');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Lighting overlay styling filter
  const getLightingFilter = () => {
    switch (lighting) {
      case 'day': return 'brightness(1.1) contrast(1.02)';
      case 'golden': return 'sepia(0.25) saturate(1.3) brightness(1.05)';
      case 'twilight': return 'hue-rotate(10deg) saturate(1.1) brightness(0.95)';
      case 'night': return 'brightness(0.75) contrast(1.15) saturate(0.9)';
      default: return 'none';
    }
  };

  return (
    <div className="container-xl" style={{ paddingBottom: '4rem' }}>
      {/* ------------------------------------------------------------------
          1. TOP SPATIAL CONTEXT BAR
          ------------------------------------------------------------------ */}
      <div
        className="card"
        style={{
          padding: '1rem 1.5rem',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span className="badge badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)', boxShadow: '0 0 8px var(--accent-blue)' }} />
            <span>REALTIME DIGITAL TWIN &amp; FLOOR MAP</span>
          </span>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              {property?.title || "Skyline Imperial Residence"}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              &bull; {property?.bedrooms || 3} BHK Luxury Penthouse, {property?.locality || "C-Scheme"}, {property?.location || "Jaipur"}
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs (Stitch + 2D Floor Plan & Spatial Mapping) */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-surface-elevated)', padding: '0.3rem', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
          <button
            className={`toggle-chip ${activeMode === 'walkthrough' ? 'active' : ''}`}
            onClick={() => setActiveMode('walkthrough')}
          >
            3D Walkthrough
          </button>
          <button
            className={`toggle-chip ${activeMode === 'floorplan' ? 'active' : ''}`}
            onClick={() => setActiveMode('floorplan')}
          >
            3D Cutaway Plan
          </button>
          <button
            className={`toggle-chip ${activeMode === '2d_cad' ? 'active' : ''}`}
            onClick={() => setActiveMode('2d_cad')}
          >
            2D CAD Blueprint
          </button>
          <button
            className={`toggle-chip ${activeMode === 'mapping' ? 'active' : ''}`}
            onClick={() => setActiveMode('mapping')}
          >
            Spatial Mapping &amp; Zoning
          </button>
          <button
            className={`toggle-chip ${activeMode === 'split' ? 'active' : ''}`}
            onClick={() => setActiveMode('split')}
          >
            <Columns size={13} style={{ marginRight: '4px' }} />
            Split 3D + 2D
          </button>
          <button
            className={`toggle-chip ${activeMode === 'exterior' ? 'active' : ''}`}
            onClick={() => setActiveMode('exterior')}
          >
            3D Exterior View
          </button>
          <button
            className={`toggle-chip ${activeMode === 'vr' ? 'active' : ''}`}
            onClick={() => setActiveMode('vr')}
          >
            360° Tour
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. CAMERA PRESETS & HUD ACTION STRIP
          ------------------------------------------------------------------ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '0.35rem' }}>
            Perspective:
          </span>
          <button
            className={`preset-btn ${cameraMode === 'orbit' ? 'active' : ''}`}
            onClick={() => setCameraMode('orbit')}
          >
            Orbit View
          </button>
          <button
            className={`preset-btn ${cameraMode === 'fps' ? 'active' : ''}`}
            onClick={() => setCameraMode('fps')}
          >
            First Person Walk
          </button>
          <button
            className={`preset-btn ${cameraMode === 'isometric' ? 'active' : ''}`}
            onClick={() => setCameraMode('isometric')}
          >
            Top-Down Isometric
          </button>
          <button
            className={`preset-btn ${cameraMode === 'elevation' ? 'active' : ''}`}
            onClick={() => setCameraMode('elevation')}
          >
            Front Elevation
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Toggle 2D Minimap Button for 3D modes */}
          {(activeMode === 'walkthrough' || activeMode === 'floorplan' || activeMode === 'exterior') && (
            <button
              className={`btn btn-sm ${showMinimap ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => setShowMinimap(!showMinimap)}
            >
              <Compass size={13} />
              <span>{showMinimap ? '2D Minimap (Active)' : 'Show 2D Minimap'}</span>
            </button>
          )}

          <span className="badge badge-demo" style={{ fontSize: '0.7rem' }}>
            CAD &amp; 3D ENGINE SYNCHRONIZED
          </span>
          <button className="icon-button" style={{ width: '32px', height: '32px' }} onClick={() => setCameraMode('orbit')} title="Reset Camera">
            <RotateCcw size={14} />
          </button>
          <button className="icon-button" style={{ width: '32px', height: '32px' }} onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. PRIMARY SPLIT STUDIO CONTAINER (70% Canvas / 30% Spec & Plan)
          ------------------------------------------------------------------ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* LEFT COLUMN: 3D Spatial Viewport & 2D Floor Plan Canvas */}
        <div id="spatial-canvas-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Viewport Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '580px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              background: '#090E1A',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* VIEWPORT MODE 1: 3D WALKTHROUGH */}
            {activeMode === 'walkthrough' && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoJp6iURZqAVsUebH4yQHkBSUt8p-gjmz3hQUygB5u9asqR4u5Uu_5e3eTX5X6v2WTedjSM4o9Mj1xGnl2cBnAkY0dEz_Nuh4Xumsm91oBE3XdEVQ6sQUWcGaCxGwMnfDX_2_u0RVpsKbEK12G4uBsPiHQ_yDUW8fSXPDjmFKr_pcwEyD7i-PNjBOH6eZtDLnTGE6XYoUGxq1VbX7KqqBTKwytbX7HGj6XnLpuF43612tttFglCFg"
                  alt="Skyline Imperial Penthouse interior"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: getLightingFilter(),
                    transition: 'filter 0.4s ease'
                  }}
                />

                {/* Hotspot 1: Living Room */}
                <div
                  style={{ position: 'absolute', top: '62%', left: '46%', transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 20 }}
                  onClick={() => handleSelectRoom(roomsList[0])}
                  title="Double Height Living Room"
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="pulsing-beacon" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.4)' }} />
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                      01
                    </div>
                  </div>
                </div>

                {/* Hotspot 2: Kitchen */}
                <div
                  style={{ position: 'absolute', top: '48%', left: '78%', transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 20 }}
                  onClick={() => handleSelectRoom(roomsList[3])}
                  title="Modular Italian Kitchen"
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="pulsing-beacon" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.4)' }} />
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--status-positive)', color: 'var(--status-positive)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                      02
                    </div>
                  </div>
                </div>

                {/* Hotspot 3: Master Suite */}
                <div
                  style={{ position: 'absolute', top: '28%', left: '28%', transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 20 }}
                  onClick={() => handleSelectRoom(roomsList[1])}
                  title="Master Suite & Mezzanine"
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--primary-500)', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    03
                  </div>
                </div>

                {/* Laser Dimension Overlay */}
                {measureMode && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '90px',
                      left: '20%',
                      right: '25%',
                      height: '2px',
                      backgroundColor: 'var(--accent-blue)',
                      boxShadow: '0 0 10px var(--accent-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF', position: 'absolute', left: '-4px' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF', position: 'absolute', right: '-4px' }} />
                    <span style={{ position: 'absolute', top: '-24px', background: 'rgba(9, 14, 26, 0.85)', backdropFilter: 'blur(8px)', padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.06em' }}>
                      WALL TO WALL: 24.0 FT (CALIBRATED CAD)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* VIEWPORT MODE 2: 3D CUTAWAY PLAN */}
            {activeMode === 'floorplan' && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090E1A', position: 'relative' }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUeM_ilIJWdlz99nKo_61k7OTRbd0pe2P1jii4kSCmqJybZlpSyfx10vtMuqHCs48toDFoYyb6AU-LIObWmXC-CKWCcb5J8RbFvKjzGiiQZrwLj8d-cdJv4Ec3M9OWoxWjOiJQXQHklk98W3oY2FLjIddFmtv7Sx-xRJ7bVaTje5flOMn2j8Nbkl7VAu26vUCa98fi7SlHNGvHB_OF1sWvE1u155VWXYNywsS4fVRaYireviOAcy8"
                  alt="3D Cutaway Floor Plan"
                  style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* VIEWPORT MODE 3: 2D ARCHITECTURAL CAD BLUEPRINT (FULL SCREEN) */}
            {activeMode === '2d_cad' && (
              <div style={{ width: '100%', height: '100%', padding: '1rem', background: '#080D1A' }}>
                <Interactive2DPlan
                  selectedRoomId={activeRoom.id}
                  onSelectRoom={(id, data) => setActiveRoom({ id, name: data.name, carpet: data.carpet, desc: data.desc, finish: data.finish })}
                  mode="cad"
                  showDimensions={true}
                  showZoning={false}
                />
              </div>
            )}

            {/* VIEWPORT MODE 4: SPATIAL MAPPING & FUNCTIONAL ZONING */}
            {activeMode === 'mapping' && (
              <div style={{ width: '100%', height: '100%', padding: '1rem', background: '#080D1A' }}>
                <Interactive2DPlan
                  selectedRoomId={activeRoom.id}
                  onSelectRoom={(id, data) => setActiveRoom({ id, name: data.name, carpet: data.carpet, desc: data.desc, finish: data.finish })}
                  mode="mapping"
                  showDimensions={true}
                  showZoning={true}
                />
              </div>
            )}

            {/* VIEWPORT MODE 5: SPLIT VIEW (3D + 2D SIDE-BY-SIDE) */}
            {activeMode === 'split' && (
              <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#080D1A' }}>
                <div style={{ height: '100%', position: 'relative', borderRight: '1px solid var(--border-medium)', overflow: 'hidden' }}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUeM_ilIJWdlz99nKo_61k7OTRbd0pe2P1jii4kSCmqJybZlpSyfx10vtMuqHCs48toDFoYyb6AU-LIObWmXC-CKWCcb5J8RbFvKjzGiiQZrwLj8d-cdJv4Ec3M9OWoxWjOiJQXQHklk98W3oY2FLjIddFmtv7Sx-xRJ7bVaTje5flOMn2j8Nbkl7VAu26vUCa98fi7SlHNGvHB_OF1sWvE1u155VWXYNywsS4fVRaYireviOAcy8"
                    alt="3D Perspective"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(9, 14, 26, 0.85)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                    3D CUTAWAY PERSPECTIVE
                  </span>
                </div>
                <div style={{ height: '100%', padding: '0.5rem' }}>
                  <Interactive2DPlan
                    selectedRoomId={activeRoom.id}
                    onSelectRoom={(id, data) => setActiveRoom({ id, name: data.name, carpet: data.carpet, desc: data.desc, finish: data.finish })}
                    mode="cad"
                    showDimensions={false}
                  />
                </div>
              </div>
            )}

            {/* VIEWPORT MODE 6: 3D EXTERIOR MODEL */}
            {activeMode === 'exterior' && (
              <ThreeDViewer property={property} height="580px" isHero={false} />
            )}

            {/* VIEWPORT MODE 7: 360° PANORAMA */}
            {activeMode === 'vr' && (
              <Tour360 />
            )}

            {/* FLOATING 2D MINIMAP / SPATIAL RADAR OVERLAY (PICTURE-IN-PICTURE) */}
            {showMinimap && (activeMode === 'walkthrough' || activeMode === 'floorplan' || activeMode === 'exterior') && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: minimapCollapsed ? 'auto' : '230px',
                  background: 'rgba(15, 23, 42, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.5)',
                  zIndex: 35,
                  overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Minimap Header */}
                <div style={{
                  padding: '0.4rem 0.65rem',
                  background: 'rgba(9, 14, 26, 0.7)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    <Compass size={12} />
                    <span>2D MAPPING RADAR</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      onClick={() => setMinimapCollapsed(!minimapCollapsed)}
                      title={minimapCollapsed ? "Expand Minimap" : "Collapse Minimap"}
                    >
                      {minimapCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      onClick={() => setShowMinimap(false)}
                      title="Close Minimap"
                    >
                      <EyeOff size={13} />
                    </button>
                  </div>
                </div>

                {/* Minimap Content */}
                {!minimapCollapsed && (
                  <div style={{ padding: '0.4rem' }}>
                    <Interactive2DPlan
                      selectedRoomId={activeRoom.id}
                      onSelectRoom={(id, data) => setActiveRoom({ id, name: data.name, carpet: data.carpet, desc: data.desc, finish: data.finish })}
                      mode="minimap"
                      showDimensions={false}
                      showCompass={false}
                    />
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.3rem' }}>
                      Click any partition to orient 3D view
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Top-Left Telemetry Overlay */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                zIndex: 20
              }}
            >
              <Box size={16} color="var(--accent-blue)" />
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  {activeMode === '2d_cad' ? 'CAD 2D ARCHITECTURE' : (activeMode === 'mapping' ? 'SPATIAL ZONING ENGINE' : '3D SPATIAL DIGITAL TWIN')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  FOV 84&deg; &bull; 60 FPS &bull; VASTU ALIGNED
                </div>
              </div>
            </div>

            {/* Floating Bottom HUD Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                right: '14px',
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(14px)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.6rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                zIndex: 25
              }}
            >
              {/* Room Quick Selector Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Partition:</span>
                {roomsList.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    className={`toggle-chip ${activeRoom.id === r.id ? 'active' : ''}`}
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                    onClick={() => handleSelectRoom(r)}
                  >
                    {r.name}
                  </button>
                ))}
              </div>

              {/* Lighting Simulation Toggles & Measure Tool */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-surface-elevated)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
                  <button
                    className={`toggle-chip ${lighting === 'day' ? 'active' : ''}`}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                    onClick={() => setLighting('day')}
                    title="Daylight 5500K"
                  >
                    <Sun size={12} /> Day
                  </button>
                  <button
                    className={`toggle-chip ${lighting === 'golden' ? 'active' : ''}`}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                    onClick={() => setLighting('golden')}
                    title="Golden Hour 3200K"
                  >
                    <Sunrise size={12} /> Gold
                  </button>
                  <button
                    className={`toggle-chip ${lighting === 'twilight' ? 'active' : ''}`}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                    onClick={() => setLighting('twilight')}
                    title="Twilight Ambient"
                  >
                    <Sunset size={12} /> Twilight
                  </button>
                  <button
                    className={`toggle-chip ${lighting === 'night' ? 'active' : ''}`}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                    onClick={() => setLighting('night')}
                    title="Night Blue"
                  >
                    <Moon size={12} /> Night
                  </button>
                </div>

                <button
                  className={`btn btn-sm ${measureMode ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => setMeasureMode(!measureMode)}
                >
                  <Ruler size={13} />
                  <span>Measure</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Room Inspection Toast Banner */}
          <div
            className="card"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-surface-elevated)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Active Partition Inspection &bull; {activeRoom.carpet}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{activeRoom.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activeRoom.desc}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveMode(activeMode === '2d_cad' ? 'walkthrough' : '2d_cad')}
              >
                <span>{activeMode === '2d_cad' ? 'Switch to 3D' : 'Inspect 2D CAD'}</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveMode('vr')}
              >
                <span>360&deg; Panorama</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Spatial Zoning Breakdown Bar (Displayed in Mapping mode or general inspection) */}
          <div className="card" style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                Floor Plate Functional Zoning Allocation (1,480 sq.ft RERA Carpet)
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                100% Usable Efficient Flow
              </span>
            </div>

            {/* Stacked Allocation Progress Bar */}
            <div style={{ width: '100%', height: '12px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px', overflow: 'hidden', display: 'flex', marginBottom: '0.8rem' }}>
              <div style={{ width: '32%', height: '100%', background: 'var(--accent-cyan)' }} title="Public Lounge (32%)" />
              <div style={{ width: '22%', height: '100%', background: 'var(--primary-500)' }} title="Master Suite (22%)" />
              <div style={{ width: '18%', height: '100%', background: 'var(--accent-blue)' }} title="Bedroom 2 (18%)" />
              <div style={{ width: '13%', height: '100%', background: 'var(--status-positive)' }} title="Modular Kitchen (13%)" />
              <div style={{ width: '8%', height: '100%', background: 'var(--accent-amber)' }} title="Skyline Deck (8%)" />
              <div style={{ width: '7%', height: '100%', background: '#94A3B8' }} title="Foyer & Baths (7%)" />
            </div>

            {/* Zone Legend Chips */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-cyan)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Public Living (32%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary-500)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Master Sanctuary (22%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-blue)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Guest Bedroom (18%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--status-positive)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Italian Kitchen (13%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-amber)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Sky Deck (8%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Floor Plan & Architectural Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Furnished Floor Plan Card (Switches between 3D Cutaway and Interactive 2D CAD) */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building size={18} color="var(--accent-blue)" /> Architectural Plan
              </h3>
              <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-surface-elevated)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
                <button
                  className={`toggle-chip ${planMode === 'iso' ? 'active' : ''}`}
                  style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}
                  onClick={() => setPlanMode('iso')}
                >
                  3D Cutaway
                </button>
                <button
                  className={`toggle-chip ${planMode === 'cad' ? 'active' : ''}`}
                  style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}
                  onClick={() => setPlanMode('cad')}
                >
                  2D CAD
                </button>
              </div>
            </div>

            {/* Floor Plan Graphic / Interactive 2D Canvas */}
            <div style={{ position: 'relative', width: '100%', height: '230px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#080D1A', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
              {planMode === 'iso' ? (
                <>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUeM_ilIJWdlz99nKo_61k7OTRbd0pe2P1jii4kSCmqJybZlpSyfx10vtMuqHCs48toDFoYyb6AU-LIObWmXC-CKWCcb5J8RbFvKjzGiiQZrwLj8d-cdJv4Ec3M9OWoxWjOiJQXQHklk98W3oY2FLjIddFmtv7Sx-xRJ7bVaTje5flOMn2j8Nbkl7VAu26vUCa98fi7SlHNGvHB_OF1sWvE1u155VWXYNywsS4fVRaYireviOAcy8"
                    alt="Furnished Architectural Floor Plan Layout"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(9, 14, 26, 0.85)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 600 }}>
                    UNIT A-2704 &bull; 1,480 SQ.FT CARPET
                  </span>
                </>
              ) : (
                <Interactive2DPlan
                  selectedRoomId={activeRoom.id}
                  onSelectRoom={(id, data) => setActiveRoom({ id, name: data.name, carpet: data.carpet, desc: data.desc, finish: data.finish })}
                  mode="cad"
                  showDimensions={false}
                  showCompass={false}
                />
              )}
            </div>

            {/* Room Dimension & Spec Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {roomsList.map((room) => (
                <div
                  key={room.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: activeRoom.id === room.id ? 'var(--bg-surface-hover)' : 'var(--bg-surface-elevated)',
                    border: activeRoom.id === room.id ? '1px solid var(--accent-blue)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => handleSelectRoom(room)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: room.dotColor }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{room.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{room.carpet}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{room.finish}</div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  TOTAL RERA CARPET
                </span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-blue)' }}>1,480 sq.ft</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>(Super Built-up: 1,800 sq.ft)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithmic Asset Valuation Card */}
          <div className="card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)', border: '1px solid var(--border-medium)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                ALGORITHMIC ASSET VALUATION
              </span>
              <span className="badge badge-positive" style={{ fontSize: '0.68rem' }}>
                HIGH VALUE RETENTION
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.85rem' }}>
              <div>
                <div className="price-display" style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>
                  ₹1.35 <span style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>Cr</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Indicative Fair Market Price</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--status-positive)' }}>+14.8%</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>18M Capital Gain</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Per Sq.Ft Base</span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-blue)' }}>₹7,500 / sq.ft</div>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sub-Market Average</span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>₹7,200 / sq.ft</div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '0.5rem' }}
              onClick={handleCallbackClick}
            >
              <PhoneCall size={15} />
              <span>Request Dealer Callback</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
              onClick={handleDownloadPDF}
            >
              <Download size={14} />
              <span>Download Architectural CAD Specs (PDF)</span>
            </button>
          </div>

          {/* Spatial Specification Matrix */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              Architectural Structural Matrix
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Clear Ceiling Height</span>
                <span style={{ fontWeight: 600 }}>11.8 Feet (High Volume)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Facing &amp; Orientation</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>South-West (Vastu Compliant)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Glazing Specification</span>
                <span style={{ fontWeight: 600 }}>Double Low-E Acoustic Glass</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>HVAC Infrastructure</span>
                <span style={{ fontWeight: 600 }}>VRV Ducting Pre-Installed</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Covered Parking Bays</span>
                <span style={{ fontWeight: 600 }}>2 Dedicated Stilt Bays</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio3DPlanView;
