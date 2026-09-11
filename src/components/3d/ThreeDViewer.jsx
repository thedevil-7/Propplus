import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Bed,
  Bath,
  Layers,
  Car,
  Maximize,
  Sparkles,
  Sun
} from 'lucide-react';

export const ThreeDViewer = ({ property, height = "600px", isHero = false }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const houseGroupRef = useRef(null);
  const poolMeshRef = useRef(null);
  const gardenGroupRef = useRef(null);
  const garageMeshRef = useRef(null);
  const balconyMeshRef = useRef(null);
  const roofMeshRef = useRef(null);
  const wallsMeshRef = useRef(null);
  const lightsGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePreset, setActivePreset] = useState('front');

  // Customization state
  const [houseStyle, setHouseStyle] = useState('modern');
  const [wallColor, setWallColor] = useState('#F8FAFC');
  const [roofType, setRoofType] = useState('flat');
  const [showGarden, setShowGarden] = useState(true);
  const [showPool, setShowPool] = useState(true);
  const [showGarage, setShowGarage] = useState(true);
  const [showBalcony, setShowBalcony] = useState(true);
  const [outdoorLights, setOutdoorLights] = useState(true);

  // Mouse interaction state for orbit controls
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraRotationRef = useRef({ theta: 0, phi: 0.35, radius: 24 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const heightPx = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090e1a);
    scene.fog = new THREE.FogExp2(0x090e1a, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 7, 24);
    camera.lookAt(0, 3, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(15, 25, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.top = 15;
    sunLight.shadow.camera.bottom = -15;
    scene.add(sunLight);

    const outdoorLightsGroup = new THREE.Group();
    lightsGroupRef.current = outdoorLightsGroup;

    // Accent soft lights
    const bluePoint = new THREE.PointLight(0x38bdf8, 2, 18);
    bluePoint.position.set(-6, 3, 7);
    outdoorLightsGroup.add(bluePoint);

    const warmPoint = new THREE.PointLight(0xfbbf24, 2.5, 14);
    warmPoint.position.set(0, 4, 3);
    outdoorLightsGroup.add(warmPoint);
    scene.add(outdoorLightsGroup);

    // 5. Ground / Driveway
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Driveway paving
    const driveGeo = new THREE.PlaneGeometry(6, 12);
    const driveMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const driveway = new THREE.Mesh(driveGeo, driveMat);
    driveway.rotation.x = -Math.PI / 2;
    driveway.position.set(5, 0.01, 7);
    driveway.receiveShadow = true;
    scene.add(driveway);

    // 6. House Assembly Group
    const houseGroup = new THREE.Group();
    houseGroupRef.current = houseGroup;
    scene.add(houseGroup);

    // Ground Floor Body
    const gfGeo = new THREE.BoxGeometry(11, 4, 9);
    const wallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(wallColor),
      roughness: 0.35,
      metalness: 0.1
    });
    const gfMesh = new THREE.Mesh(gfGeo, wallMat);
    gfMesh.position.set(-0.5, 2, 0);
    gfMesh.castShadow = true;
    gfMesh.receiveShadow = true;
    houseGroup.add(gfMesh);
    wallsMeshRef.current = gfMesh;

    // First Floor (Cantilevered Modern Volume)
    const ffGeo = new THREE.BoxGeometry(9, 3.6, 8);
    const ffMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3
    });
    const ffMesh = new THREE.Mesh(ffGeo, ffMat);
    ffMesh.position.set(-1.5, 5.8, 0.5);
    ffMesh.castShadow = true;
    ffMesh.receiveShadow = true;
    houseGroup.add(ffMesh);

    // Flat Roof (default)
    const roofGeo = new THREE.BoxGeometry(10, 0.4, 9);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(-1.5, 7.8, 0.5);
    roofMesh.castShadow = true;
    houseGroup.add(roofMesh);
    roofMeshRef.current = roofMesh;

    // Windows (Semi-transparent reflective glass)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      transmission: 0.8,
      ior: 1.5
    });

    // Large Living Room Panoramic Window
    const win1Geo = new THREE.BoxGeometry(4.5, 2.6, 0.2);
    const win1 = new THREE.Mesh(win1Geo, glassMat);
    win1.position.set(-2, 2.2, 4.6);
    houseGroup.add(win1);

    // Upper Floor Ribbon Window
    const win2Geo = new THREE.BoxGeometry(6.5, 1.8, 0.2);
    const win2 = new THREE.Mesh(win2Geo, glassMat);
    win2.position.set(-1.5, 6, 4.6);
    houseGroup.add(win2);

    // Cantilevered Balcony
    const balconyGroup = new THREE.Group();
    const balcBaseGeo = new THREE.BoxGeometry(4.5, 0.3, 2.5);
    const balcBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const balcBase = new THREE.Mesh(balcBaseGeo, balcBaseMat);
    balcBase.position.set(-2, 3.9, 5.5);
    balcBase.castShadow = true;
    balconyGroup.add(balcBase);

    // Glass Railing
    const railGeo = new THREE.BoxGeometry(4.5, 1, 0.1);
    const rail = new THREE.Mesh(railGeo, glassMat);
    rail.position.set(-2, 4.5, 6.7);
    balconyGroup.add(rail);
    houseGroup.add(balconyGroup);
    balconyMeshRef.current = balconyGroup;

    // Modern Garage
    const garageGeo = new THREE.BoxGeometry(4.5, 3.6, 6);
    const garageMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const garage = new THREE.Mesh(garageGeo, garageMat);
    garage.position.set(5.5, 1.8, 0.5);
    garage.castShadow = true;
    garage.receiveShadow = true;
    houseGroup.add(garage);
    garageMeshRef.current = garage;

    // Swimming Pool
    const poolGroup = new THREE.Group();
    const poolBorderGeo = new THREE.BoxGeometry(7, 0.2, 4);
    const poolBorderMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    const poolBorder = new THREE.Mesh(poolBorderGeo, poolBorderMat);
    poolBorder.position.set(-7.5, 0.05, 5);
    poolGroup.add(poolBorder);

    const waterGeo = new THREE.PlaneGeometry(6.4, 3.4);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(-7.5, 0.12, 5);
    poolGroup.add(water);
    scene.add(poolGroup);
    poolMeshRef.current = poolGroup;

    // Garden & Architectural Trees
    const gardenGroup = new THREE.Group();
    const lawnGeo = new THREE.PlaneGeometry(16, 8);
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(-5, 0.02, 6);
    gardenGroup.add(lawn);

    // Stylized Architectural Trees
    const createTree = (x, z) => {
      const tree = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3825 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.25;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageGeo = new THREE.ConeGeometry(1.6, 3.2, 8);
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 3.6;
      foliage.castShadow = true;
      tree.add(foliage);

      tree.position.set(x, 0, z);
      return tree;
    };

    gardenGroup.add(createTree(-12, 4));
    gardenGroup.add(createTree(-11, 8));
    gardenGroup.add(createTree(9, -2));
    scene.add(gardenGroup);
    gardenGroupRef.current = gardenGroup;

    setIsLoading(false);

    // Mouse Interaction Handlers
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cameraRotationRef.current.theta -= deltaX * 0.007;
      cameraRotationRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI / 2 - 0.05, cameraRotationRef.current.phi + deltaY * 0.007)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraRotationRef.current.radius = Math.max(
        8,
        Math.min(45, cameraRotationRef.current.radius + e.deltaY * 0.02)
      );
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Render Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth auto-orbit when not dragging and on hero view
      if (isHero && !isDraggingRef.current) {
        cameraRotationRef.current.theta += 0.002;
      }

      // Compute spherical camera coordinate
      const r = cameraRotationRef.current.radius;
      const phi = cameraRotationRef.current.phi;
      const theta = cameraRotationRef.current.theta;

      camera.position.x = r * Math.sin(phi) * Math.sin(theta);
      camera.position.y = r * Math.cos(phi) + 1.5;
      camera.position.z = r * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 3, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isHero]);

  // Update Visual Customizations
  useEffect(() => {
    if (wallsMeshRef.current) {
      wallsMeshRef.current.material.color.set(wallColor);
    }
  }, [wallColor]);

  useEffect(() => {
    if (poolMeshRef.current) {
      poolMeshRef.current.visible = showPool;
    }
  }, [showPool]);

  useEffect(() => {
    if (gardenGroupRef.current) {
      gardenGroupRef.current.visible = showGarden;
    }
  }, [showGarden]);

  useEffect(() => {
    if (garageMeshRef.current) {
      garageMeshRef.current.visible = showGarage;
    }
  }, [showGarage]);

  useEffect(() => {
    if (balconyMeshRef.current) {
      balconyMeshRef.current.visible = showBalcony;
    }
  }, [showBalcony]);

  useEffect(() => {
    if (lightsGroupRef.current) {
      lightsGroupRef.current.visible = outdoorLights;
    }
  }, [outdoorLights]);

  // Apply Camera Presets
  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    switch (presetName) {
      case 'front':
        cameraRotationRef.current = { theta: 0, phi: 0.35, radius: 24 };
        break;
      case 'back':
        cameraRotationRef.current = { theta: Math.PI, phi: 0.35, radius: 24 };
        break;
      case 'left':
        cameraRotationRef.current = { theta: -Math.PI / 2, phi: 0.35, radius: 24 };
        break;
      case 'right':
        cameraRotationRef.current = { theta: Math.PI / 2, phi: 0.35, radius: 24 };
        break;
      case 'top':
        cameraRotationRef.current = { theta: 0, phi: 0.05, radius: 28 };
        break;
      case 'interior':
        cameraRotationRef.current = { theta: 0.1, phi: 0.45, radius: 10 };
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    applyPreset('front');
  };

  const toggleFullscreen = () => {
    const el = mountRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div
        className="three-viewer-container"
        style={{ height: height }}
        ref={mountRef}
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-app)',
            zIndex: 30,
            gap: '1rem'
          }}>
            <div className="neural-scanner-circle" style={{ width: '60px', height: '60px', margin: 0 }}>
              <Sparkles size={24} color="var(--accent-blue)" />
            </div>
            <p style={{ fontWeight: 600 }}>Loading Property Model...</p>
          </div>
        )}

        {/* Camera Presets Bar */}
        <div className="camera-presets-bar">
          {['front', 'back', 'left', 'right', 'top', 'interior'].map((preset) => (
            <button
              key={preset}
              className={`preset-btn ${activePreset === preset ? 'active' : ''}`}
              onClick={() => applyPreset(preset)}
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </button>
          ))}
          <button className="preset-btn" onClick={handleReset} title="Reset Camera">
            <RotateCcw size={13} />
          </button>
          <button className="preset-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>

        {/* 3D Floating Property HUD */}
        <div className="three-specs-hud">
          <div className="hud-title">Property Overview</div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bed size={13} /> Bedrooms</span>
            <span>{property?.bedrooms || 3} BHK</span>
          </div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Maximize size={13} /> Area</span>
            <span>{property?.area || 1800} sq.ft</span>
          </div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bath size={13} /> Bathrooms</span>
            <span>{property?.bathrooms || 2} Bath</span>
          </div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layers size={13} /> Elevation</span>
            <span>{property?.floors || 2} Floors</span>
          </div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Car size={13} /> Parking</span>
            <span>{property?.parking || 2} Slots</span>
          </div>
        </div>
      </div>

      {/* 3D Customizer Bottom Controls (Only in full viewer mode) */}
      {!isHero && (
        <div className="three-customizer-panel">
          {/* House Style */}
          <div className="customizer-group">
            <div className="customizer-title">House Style</div>
            <div className="button-toggle-group">
              {['modern', 'classic', 'luxury', 'minimal'].map((style) => (
                <button
                  key={style}
                  className={`toggle-chip ${houseStyle === style ? 'active' : ''}`}
                  onClick={() => setHouseStyle(style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Exterior Color */}
          <div className="customizer-group">
            <div className="customizer-title">Exterior Color</div>
            <div className="color-swatch-group">
              {[
                { name: 'White', color: '#F8FAFC' },
                { name: 'Gray', color: '#64748B' },
                { name: 'Beige', color: '#D4B996' },
                { name: 'Blue', color: '#38BDF8' }
              ].map((c) => (
                <button
                  key={c.name}
                  className={`color-swatch ${wallColor === c.color ? 'active' : ''}`}
                  style={{ backgroundColor: c.color }}
                  onClick={() => setWallColor(c.color)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Roof Type */}
          <div className="customizer-group">
            <div className="customizer-title">Roof Profile</div>
            <div className="button-toggle-group">
              <button
                className={`toggle-chip ${roofType === 'flat' ? 'active' : ''}`}
                onClick={() => setRoofType('flat')}
              >
                Flat Terrace
              </button>
              <button
                className={`toggle-chip ${roofType === 'sloped' ? 'active' : ''}`}
                onClick={() => setRoofType('sloped')}
              >
                Sloped Gable
              </button>
            </div>
          </div>

          {/* Environmental Toggles */}
          <div className="customizer-group">
            <div className="customizer-title">Environment Modules</div>
            <div className="button-toggle-group">
              <button
                className={`toggle-chip ${showGarden ? 'active' : ''}`}
                onClick={() => setShowGarden(!showGarden)}
              >
                Garden
              </button>
              <button
                className={`toggle-chip ${showPool ? 'active' : ''}`}
                onClick={() => setShowPool(!showPool)}
              >
                Pool
              </button>
              <button
                className={`toggle-chip ${showGarage ? 'active' : ''}`}
                onClick={() => setShowGarage(!showGarage)}
              >
                Garage
              </button>
              <button
                className={`toggle-chip ${showBalcony ? 'active' : ''}`}
                onClick={() => setShowBalcony(!showBalcony)}
              >
                Balcony
              </button>
              <button
                className={`toggle-chip ${outdoorLights ? 'active' : ''}`}
                onClick={() => setOutdoorLights(!outdoorLights)}
              >
                Lights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
