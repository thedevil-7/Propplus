import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Home,
  Palette,
  Trees,
  Waves,
  Lightbulb,
  Compass
} from 'lucide-react';

export const ThreeDViewer = ({ property, height = "600px", isHero = false }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const houseGroupRef = useRef(null);
  const environmentGroupRef = useRef(null);
  const sunLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePreset, setActivePreset] = useState('front');

  // Customization state
  const [houseStyle, setHouseStyle] = useState('modern'); // 'modern' | 'classic' | 'luxury' | 'minimal'
  const [wallColor, setWallColor] = useState('#F8FAFC');
  const [roofType, setRoofType] = useState('flat'); // 'flat' | 'sloped'
  const [lightingMode, setLightingMode] = useState('twilight'); // 'day' | 'golden' | 'twilight' | 'night'
  const [showGarden, setShowGarden] = useState(true);
  const [showPool, setShowPool] = useState(true);
  const [showGarage, setShowGarage] = useState(true);
  const [showBalcony, setShowBalcony] = useState(true);
  const [outdoorLights, setOutdoorLights] = useState(true);

  // Mouse interaction & smooth lerping camera state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef({ x: 0, y: 3, z: 0 });
  const cameraRotationRef = useRef({
    theta: 0,
    phi: 0.35,
    radius: 24,
    targetTheta: 0,
    targetPhi: 0.35,
    targetRadius: 24,
    lookAtX: 0,
    lookAtY: 3,
    lookAtZ: 0,
    targetLookAtX: 0,
    targetLookAtY: 3,
    targetLookAtZ: 0
  });

  // Lighting profiles configuration
  const lightingConfigs = useMemo(() => ({
    day: {
      sunColor: 0xffffff,
      sunIntensity: 1.6,
      sunPos: [18, 28, 14],
      ambientColor: 0xe2e8f0,
      ambientIntensity: 0.85,
      bg: 0x0f172a,
      fog: 0x0f172a,
      fogDensity: 0.018,
      windowEmissive: 0x000000,
      windowEmissiveIntensity: 0,
      interiorLightIntensity: 0.5,
      poolEmissive: 0x000000,
      accentLightsIntensity: 0.2
    },
    golden: {
      sunColor: 0xff9944,
      sunIntensity: 1.85,
      sunPos: [24, 7, 18],
      ambientColor: 0xfb923c,
      ambientIntensity: 0.7,
      bg: 0x1c1022,
      fog: 0x1c1022,
      fogDensity: 0.022,
      windowEmissive: 0xffaa44,
      windowEmissiveIntensity: 0.45,
      interiorLightIntensity: 1.8,
      poolEmissive: 0x0891b2,
      accentLightsIntensity: 1.2
    },
    twilight: {
      sunColor: 0x38bdf8,
      sunIntensity: 0.45,
      sunPos: [12, 3, -18],
      ambientColor: 0x1e3a8a,
      ambientIntensity: 0.65,
      bg: 0x070d1e,
      fog: 0x070d1e,
      fogDensity: 0.025,
      windowEmissive: 0xfbbf24,
      windowEmissiveIntensity: 0.85,
      interiorLightIntensity: 2.8,
      poolEmissive: 0x06b6d4,
      accentLightsIntensity: 2.2
    },
    night: {
      sunColor: 0x818cf8,
      sunIntensity: 0.25,
      sunPos: [-15, 20, -10],
      ambientColor: 0x0f172a,
      ambientIntensity: 0.35,
      bg: 0x030712,
      fog: 0x030712,
      fogDensity: 0.028,
      windowEmissive: 0xfef08a,
      windowEmissiveIntensity: 1.1,
      interiorLightIntensity: 3.5,
      poolEmissive: 0x22d3ee,
      accentLightsIntensity: 3.0
    }
  }), []);

  // Initialize Three.js Scene, Camera, Renderer
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const heightPx = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const currentLighting = lightingConfigs[lightingMode] || lightingConfigs.twilight;
    scene.background = new THREE.Color(currentLighting.bg);
    scene.fog = new THREE.FogExp2(currentLighting.fog, currentLighting.fogDensity);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 7, 24);
    camera.lookAt(0, 3, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(currentLighting.ambientColor, currentLighting.ambientIntensity);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(currentLighting.sunColor, currentLighting.sunIntensity);
    sunLight.position.set(...currentLighting.sunPos);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 70;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.bias = -0.0005;
    sunLightRef.current = sunLight;
    scene.add(sunLight);

    // 5. Ground / Driveway Paving
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x090e17, roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    const driveGeo = new THREE.PlaneGeometry(7, 14);
    const driveMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 });
    const driveway = new THREE.Mesh(driveGeo, driveMat);
    driveway.rotation.x = -Math.PI / 2;
    driveway.position.set(5.5, 0.01, 7.5);
    driveway.receiveShadow = true;
    scene.add(driveway);

    // Assembly Groups
    const houseGroup = new THREE.Group();
    houseGroupRef.current = houseGroup;
    scene.add(houseGroup);

    const envGroup = new THREE.Group();
    environmentGroupRef.current = envGroup;
    scene.add(envGroup);

    setIsLoading(false);

    // Mouse Interaction Handlers
    const onMouseDown = (e) => {
      if (e.button !== 0) return; // Only left-click drag
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      const rot = cameraRotationRef.current;
      rot.targetTheta -= deltaX * 0.007;
      rot.targetPhi = Math.max(
        0.05,
        Math.min(Math.PI / 2 - 0.05, rot.targetPhi + deltaY * 0.007)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const rot = cameraRotationRef.current;
      rot.targetRadius = Math.max(
        6,
        Math.min(48, rot.targetRadius + e.deltaY * 0.025)
      );
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Touch Support for Mobile / Tablet
    let lastTouchX = 0;
    let lastTouchY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        isDraggingRef.current = true;
      }
    };
    const onTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - lastTouchX;
      const deltaY = e.touches[0].clientY - lastTouchY;
      const rot = cameraRotationRef.current;
      rot.targetTheta -= deltaX * 0.008;
      rot.targetPhi = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, rot.targetPhi + deltaY * 0.008));
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Render Animation Loop with Smooth Lerping
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const rot = cameraRotationRef.current;
      // Auto-orbit in hero mode when not actively dragging
      if (isHero && !isDraggingRef.current) {
        rot.targetTheta += 0.002;
      }

      // Smooth camera interpolation (Inertia lerp)
      const lerpFactor = 0.08;
      rot.theta += (rot.targetTheta - rot.theta) * lerpFactor;
      rot.phi += (rot.targetPhi - rot.phi) * lerpFactor;
      rot.radius += (rot.targetRadius - rot.radius) * lerpFactor;

      rot.lookAtX += (rot.targetLookAtX - rot.lookAtX) * lerpFactor;
      rot.lookAtY += (rot.targetLookAtY - rot.lookAtY) * lerpFactor;
      rot.lookAtZ += (rot.targetLookAtZ - rot.lookAtZ) * lerpFactor;

      // Compute spherical camera coordinate around target lookAt point
      const r = rot.radius;
      const phi = rot.phi;
      const theta = rot.theta;

      camera.position.x = rot.lookAtX + r * Math.sin(phi) * Math.sin(theta);
      camera.position.y = rot.lookAtY + r * Math.cos(phi);
      camera.position.z = rot.lookAtZ + r * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(rot.lookAtX, rot.lookAtY, rot.lookAtZ);

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
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isHero, lightingConfigs]);

  // Update Dynamic Scene Lighting & Atmosphere
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !ambientLightRef.current) return;
    const cfg = lightingConfigs[lightingMode] || lightingConfigs.twilight;

    sceneRef.current.background.set(cfg.bg);
    sceneRef.current.fog.color.set(cfg.fog);
    sceneRef.current.fog.density = cfg.fogDensity;

    ambientLightRef.current.color.set(cfg.ambientColor);
    ambientLightRef.current.intensity = cfg.ambientIntensity;

    sunLightRef.current.color.set(cfg.sunColor);
    sunLightRef.current.intensity = cfg.sunIntensity;
    sunLightRef.current.position.set(...cfg.sunPos);
  }, [lightingMode, lightingConfigs]);

  // Procedural 3D Architectural Builder: Constructs Style, Walls, Roof, Windows & Doors
  useEffect(() => {
    const houseGroup = houseGroupRef.current;
    if (!houseGroup) return;

    // Clear previous children
    while (houseGroup.children.length > 0) {
      const child = houseGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      houseGroup.remove(child);
    }

    const cfg = lightingConfigs[lightingMode] || lightingConfigs.twilight;

    // Shared Architectural Materials
    const baseWallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(wallColor),
      roughness: 0.35,
      metalness: 0.05
    });

    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.2
    });

    const woodSlatMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.6,
      metalness: 0.1
    });

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.85
    });

    const blackSteelMat = new THREE.MeshStandardMaterial({
      color: 0x090e17,
      roughness: 0.2,
      metalness: 0.8
    });

    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.08,
      transmission: 0.82,
      ior: 1.5,
      emissive: new THREE.Color(cfg.windowEmissive),
      emissiveIntensity: cfg.windowEmissiveIntensity
    });

    const frameMat = blackSteelMat;

    // Helper: Create architectural window with frames
    const createWindow = (width, height, hasMullion = true) => {
      const winGroup = new THREE.Group();
      const glassGeo = new THREE.BoxGeometry(width, height, 0.08);
      const glassMesh = new THREE.Mesh(glassGeo, windowGlassMat);
      winGroup.add(glassMesh);

      // Frame border
      const th = 0.08;
      const hBorderGeo = new THREE.BoxGeometry(width + th * 2, th, 0.16);
      const topFrame = new THREE.Mesh(hBorderGeo, frameMat);
      topFrame.position.y = height / 2;
      winGroup.add(topFrame);

      const btmFrame = topFrame.clone();
      btmFrame.position.y = -height / 2;
      winGroup.add(btmFrame);

      const vBorderGeo = new THREE.BoxGeometry(th, height, 0.16);
      const leftFrame = new THREE.Mesh(vBorderGeo, frameMat);
      leftFrame.position.x = -width / 2;
      winGroup.add(leftFrame);

      const rightFrame = leftFrame.clone();
      rightFrame.position.x = width / 2;
      winGroup.add(rightFrame);

      if (hasMullion && width > 2.5) {
        const mullion = leftFrame.clone();
        mullion.position.x = 0;
        winGroup.add(mullion);
      }

      return winGroup;
    };

    // Helper: Create Sloped Gable Roof with Overhangs
    const createGableRoof = (width, depth, height, overhang = 0.6, tileColor = 0x1e293b) => {
      const roofMat = new THREE.MeshStandardMaterial({ color: tileColor, roughness: 0.5 });
      const shape = new THREE.Shape();
      const halfW = width / 2 + overhang;
      shape.moveTo(-halfW, 0);
      shape.lineTo(0, height);
      shape.lineTo(halfW, 0);
      shape.closePath();

      const extrudeSettings = { steps: 1, depth: depth + overhang * 2, bevelEnabled: false };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.translate(0, 0, -(depth + overhang * 2) / 2);
      const mesh = new THREE.Mesh(geo, roofMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // Helper: Create Classical Hipped Roof
    const createHippedRoof = (width, depth, height, overhang = 0.6, tileColor = 0x334155) => {
      const group = new THREE.Group();
      const roofMat = new THREE.MeshStandardMaterial({ color: tileColor, roughness: 0.55 });
      const w = width + overhang * 2;
      const d = depth + overhang * 2;

      const hipGeo = new THREE.ConeGeometry(Math.max(w, d) * 0.72, height, 4);
      hipGeo.rotateY(Math.PI / 4);
      hipGeo.scale(w / Math.max(w, d), 1, d / Math.max(w, d));
      const hipMesh = new THREE.Mesh(hipGeo, roofMat);
      hipMesh.position.y = height / 2;
      hipMesh.castShadow = true;
      hipMesh.receiveShadow = true;
      group.add(hipMesh);

      // Fascia soffit band
      const fasciaGeo = new THREE.BoxGeometry(w, 0.25, d);
      const fasciaMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      const fascia = new THREE.Mesh(fasciaGeo, fasciaMat);
      fascia.position.y = 0.12;
      group.add(fascia);

      return group;
    };

    // Helper: Create Interior Elements (visible through glass)
    const addInteriorLiving = (parentGroup, posX, posY, posZ) => {
      const intGroup = new THREE.Group();
      intGroup.position.set(posX, posY, posZ);

      // Parquet Hardwood Floor
      const floorGeo = new THREE.PlaneGeometry(8, 6);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0xd4b996, roughness: 0.4 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0.02;
      intGroup.add(floor);

      // Contemporary L-Shaped Sectional Sofa
      const sofaMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
      const sofaBaseGeo = new THREE.BoxGeometry(3.6, 0.6, 1.4);
      const sofaBase = new THREE.Mesh(sofaBaseGeo, sofaMat);
      sofaBase.position.set(-1, 0.3, 0);
      intGroup.add(sofaBase);

      const sofaReturnGeo = new THREE.BoxGeometry(1.4, 0.6, 2.2);
      const sofaReturn = new THREE.Mesh(sofaReturnGeo, sofaMat);
      sofaReturn.position.set(0.6, 0.3, -0.4);
      intGroup.add(sofaReturn);

      // Coffee Table
      const tableGeo = new THREE.BoxGeometry(1.6, 0.35, 1.0);
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.set(-0.8, 0.18, -1.2);
      intGroup.add(table);

      // Warm Ceiling Pendant Light
      if (cfg.interiorLightIntensity > 0) {
        const interiorLight = new THREE.PointLight(0xfbbf24, cfg.interiorLightIntensity, 8);
        interiorLight.position.set(0, 3.2, 0);
        intGroup.add(interiorLight);
      }

      parentGroup.add(intGroup);
    };

    // -------------------------------------------------------------
    // STYLE 1: MODERN VILLA
    // -------------------------------------------------------------
    if (houseStyle === 'modern') {
      // Ground Floor
      const gfGeo = new THREE.BoxGeometry(11, 4, 9);
      const gfMesh = new THREE.Mesh(gfGeo, baseWallMat);
      gfMesh.position.set(-0.5, 2, 0);
      gfMesh.castShadow = true;
      gfMesh.receiveShadow = true;
      houseGroup.add(gfMesh);

      // Cantilevered First Floor Volume (Slate Composite with Wood Louver Panel)
      const ffGeo = new THREE.BoxGeometry(9.2, 3.6, 8.2);
      const ffMesh = new THREE.Mesh(ffGeo, darkAccentMat);
      ffMesh.position.set(-1.6, 5.8, 0.6);
      ffMesh.castShadow = true;
      ffMesh.receiveShadow = true;
      houseGroup.add(ffMesh);

      // Wood Slat Accent Panel on facade
      const slatPanelGeo = new THREE.BoxGeometry(3.2, 3.2, 0.15);
      const slatPanel = new THREE.Mesh(slatPanelGeo, woodSlatMat);
      slatPanel.position.set(-3.5, 5.8, 4.75);
      houseGroup.add(slatPanel);

      // Panoramic Floor-to-ceiling Living Glass Wall
      const mainWin = createWindow(5.5, 2.8);
      mainWin.position.set(-1.5, 2.2, 4.56);
      houseGroup.add(mainWin);

      // Upper Floor Ribbon Glass
      const ribbonWin = createWindow(5.0, 1.8);
      ribbonWin.position.set(0.8, 6.0, 4.76);
      houseGroup.add(ribbonWin);

      // Modern Entrance: Recessed Porch & Wood Pivot Door
      const doorFrameGeo = new THREE.BoxGeometry(1.6, 2.6, 0.2);
      const doorMesh = new THREE.Mesh(doorFrameGeo, woodSlatMat);
      doorMesh.position.set(3.2, 1.3, 4.56);
      houseGroup.add(doorMesh);

      const canopyGeo = new THREE.BoxGeometry(2.4, 0.2, 1.6);
      const canopyMesh = new THREE.Mesh(canopyGeo, blackSteelMat);
      canopyMesh.position.set(3.2, 2.7, 5.2);
      houseGroup.add(canopyMesh);

      // Stepping Pads
      for (let i = 0; i < 3; i++) {
        const stepGeo = new THREE.BoxGeometry(1.8, 0.12, 0.8);
        const stepMesh = new THREE.Mesh(stepGeo, stoneMat);
        stepMesh.position.set(3.2, 0.06 * (i + 1), 5.4 + i * 0.9);
        stepMesh.receiveShadow = true;
        houseGroup.add(stepMesh);
      }

      // Interior Living Setup
      addInteriorLiving(houseGroup, -1.5, 0, 1.5);

      // Roof Construction
      if (roofType === 'sloped') {
        const gable = createGableRoof(9.6, 8.6, 2.2, 0.5, 0x1e293b);
        gable.position.set(-1.6, 7.6, 0.6);
        houseGroup.add(gable);
      } else {
        // Flat Terrace with Glass Parapet and Rooftop Pergola
        const roofSlabGeo = new THREE.BoxGeometry(9.6, 0.35, 8.6);
        const roofSlab = new THREE.Mesh(roofSlabGeo, darkAccentMat);
        roofSlab.position.set(-1.6, 7.7, 0.6);
        roofSlab.castShadow = true;
        houseGroup.add(roofSlab);

        // Modern Pergola on Roof
        const pergolaGroup = new THREE.Group();
        pergolaGroup.position.set(-3.2, 8.0, 0);
        for (let i = 0; i < 4; i++) {
          const colGeo = new THREE.BoxGeometry(0.12, 2.2, 0.12);
          const col = new THREE.Mesh(colGeo, blackSteelMat);
          col.position.set((i % 2 === 0 ? -1.8 : 1.8), 1.1, (i < 2 ? -1.8 : 1.8));
          pergolaGroup.add(col);
        }
        for (let j = 0; j < 5; j++) {
          const slatGeo = new THREE.BoxGeometry(3.8, 0.08, 0.15);
          const slat = new THREE.Mesh(slatGeo, woodSlatMat);
          slat.position.set(0, 2.2, -1.6 + j * 0.8);
          pergolaGroup.add(slat);
        }
        houseGroup.add(pergolaGroup);
      }
    }

    // -------------------------------------------------------------
    // STYLE 2: CLASSIC MANOR
    // -------------------------------------------------------------
    else if (houseStyle === 'classic') {
      // Symmetrical Central Corps de Logis
      const centerGeo = new THREE.BoxGeometry(7.5, 7.2, 8.5);
      const centerMesh = new THREE.Mesh(centerGeo, baseWallMat);
      centerMesh.position.set(0, 3.6, 0);
      centerMesh.castShadow = true;
      centerMesh.receiveShadow = true;
      houseGroup.add(centerMesh);

      // Left Wing
      const leftWingGeo = new THREE.BoxGeometry(4.2, 5.5, 7.5);
      const leftWing = new THREE.Mesh(leftWingGeo, baseWallMat);
      leftWing.position.set(-5.6, 2.75, -0.4);
      leftWing.castShadow = true;
      leftWing.receiveShadow = true;
      houseGroup.add(leftWing);

      // Right Wing
      const rightWingGeo = new THREE.BoxGeometry(4.2, 5.5, 7.5);
      const rightWing = new THREE.Mesh(rightWingGeo, baseWallMat);
      rightWing.position.set(5.6, 2.75, -0.4);
      rightWing.castShadow = true;
      rightWing.receiveShadow = true;
      houseGroup.add(rightWing);

      // Classical Portico with Columns and Triangular Pediment
      const porticoGroup = new THREE.Group();
      porticoGroup.position.set(0, 0, 4.3);

      const plinthGeo = new THREE.BoxGeometry(4.2, 0.4, 2.0);
      const plinth = new THREE.Mesh(plinthGeo, stoneMat);
      plinth.position.set(0, 0.2, 0.8);
      porticoGroup.add(plinth);

      // Twin Classical Columns
      const colGeo = new THREE.CylinderGeometry(0.2, 0.25, 3.8, 16);
      const colMat = stoneMat;
      const col1 = new THREE.Mesh(colGeo, colMat);
      col1.position.set(-1.6, 2.2, 1.5);
      col1.castShadow = true;
      porticoGroup.add(col1);

      const col2 = col1.clone();
      col2.position.set(1.6, 2.2, 1.5);
      porticoGroup.add(col2);

      // Entablature & Pediment
      const entGeo = new THREE.BoxGeometry(4.4, 0.4, 2.2);
      const ent = new THREE.Mesh(entGeo, stoneMat);
      ent.position.set(0, 4.2, 0.9);
      porticoGroup.add(ent);

      const pedShape = new THREE.Shape();
      pedShape.moveTo(-2.2, 0);
      pedShape.lineTo(0, 1.2);
      pedShape.lineTo(2.2, 0);
      pedShape.closePath();
      const pedGeo = new THREE.ExtrudeGeometry(pedShape, { steps: 1, depth: 0.4, bevelEnabled: false });
      const pedMesh = new THREE.Mesh(pedGeo, stoneMat);
      pedMesh.position.set(0, 4.4, 1.8);
      porticoGroup.add(pedMesh);

      houseGroup.add(porticoGroup);

      // Classical Double Mahogany Doors
      const doorMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 });
      const doorGeo = new THREE.BoxGeometry(2.0, 2.8, 0.15);
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(0, 1.6, 4.3);
      houseGroup.add(door);

      // Symmetrical Arched / Mullioned Sash Windows
      const winPositions = [
        [-2.4, 2.2, 4.3],
        [2.4, 2.2, 4.3],
        [-2.4, 5.6, 4.3],
        [0, 5.6, 4.3],
        [2.4, 5.6, 4.3],
        [-5.6, 2.4, 3.4],
        [5.6, 2.4, 3.4],
        [-5.6, 4.6, 3.4],
        [5.6, 4.6, 3.4]
      ];

      winPositions.forEach(([x, y, z]) => {
        const win = createWindow(1.4, 2.0);
        win.position.set(x, y, z);
        houseGroup.add(win);
      });

      // Roof: Sloped Grand Hipped Slate Roof or Classical Balustraded Terrace
      if (roofType === 'sloped') {
        const mainRoof = createHippedRoof(7.8, 8.8, 3.4, 0.6, 0x334155);
        mainRoof.position.set(0, 7.2, 0);
        houseGroup.add(mainRoof);

        const leftRoof = createHippedRoof(4.4, 7.8, 2.2, 0.5, 0x334155);
        leftRoof.position.set(-5.6, 5.5, -0.4);
        houseGroup.add(leftRoof);

        const rightRoof = createHippedRoof(4.4, 7.8, 2.2, 0.5, 0x334155);
        rightRoof.position.set(5.6, 5.5, -0.4);
        houseGroup.add(rightRoof);

        // Classic Brick Chimney with pots
        const chimneyGeo = new THREE.BoxGeometry(0.8, 2.5, 0.8);
        const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 });
        const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
        chimney.position.set(-2.2, 9.8, -1.2);
        houseGroup.add(chimney);
      } else {
        const flatRoofGeo = new THREE.BoxGeometry(8.0, 0.4, 9.0);
        const flatRoof = new THREE.Mesh(flatRoofGeo, stoneMat);
        flatRoof.position.set(0, 7.3, 0);
        houseGroup.add(flatRoof);

        // Classical Balustrade Urns
        for (let u = 0; u < 4; u++) {
          const urnGeo = new THREE.CylinderGeometry(0.3, 0.15, 0.6, 8);
          const urn = new THREE.Mesh(urnGeo, stoneMat);
          urn.position.set(u % 2 === 0 ? -3.8 : 3.8, 7.7, u < 2 ? -4.2 : 4.2);
          houseGroup.add(urn);
        }
      }
    }

    // -------------------------------------------------------------
    // STYLE 3: LUXURY GLASSHOUSE
    // -------------------------------------------------------------
    else if (houseStyle === 'luxury') {
      // Structural Steel Skeleton I-Beams
      const beamMat = blackSteelMat;
      const pavilionGroup = new THREE.Group();

      // Main Ground Floor & Second Story Double-Height Void
      const coreGeo = new THREE.BoxGeometry(12, 7.4, 9);
      const coreMesh = new THREE.Mesh(coreGeo, baseWallMat);
      coreMesh.position.set(-0.5, 3.7, 0);
      pavilionGroup.add(coreMesh);

      // Floor-to-ceiling Double Height Glass Curtain Facade
      const curtainWin = createWindow(10.5, 6.2);
      curtainWin.position.set(-0.5, 3.8, 4.55);
      pavilionGroup.add(curtainWin);

      // Rear Glass Curtain
      const rearCurtain = createWindow(10.5, 6.2);
      rearCurtain.position.set(-0.5, 3.8, -4.55);
      rearCurtain.rotation.y = Math.PI;
      pavilionGroup.add(rearCurtain);

      // Visible Mezzanine Loft Floor inside glass
      const mezzGeo = new THREE.BoxGeometry(6.5, 0.35, 6.5);
      const mezzMesh = new THREE.Mesh(mezzGeo, darkAccentMat);
      mezzMesh.position.set(2.0, 3.8, 0);
      pavilionGroup.add(mezzMesh);

      // Floating Chandelier in Double-Height Void
      const chandelierGroup = new THREE.Group();
      chandelierGroup.position.set(-2.5, 5.0, 0.5);
      for (let r = 1; r <= 3; r++) {
        const ringGeo = new THREE.TorusGeometry(r * 0.45, 0.04, 8, 24);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xfbbf24,
          emissiveIntensity: 0.9,
          roughness: 0.1
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -r * 0.3;
        chandelierGroup.add(ring);
      }
      if (cfg.interiorLightIntensity > 0) {
        const chLight = new THREE.PointLight(0xfbbf24, cfg.interiorLightIntensity * 1.5, 12);
        chandelierGroup.add(chLight);
      }
      pavilionGroup.add(chandelierGroup);

      // Interior Living
      addInteriorLiving(pavilionGroup, -2.5, 0, 1.2);

      // Cantilevered Teak Deck extending to pool
      const teakDeckGeo = new THREE.BoxGeometry(7, 0.15, 5);
      const teakDeck = new THREE.Mesh(teakDeckGeo, woodSlatMat);
      teakDeck.position.set(-5.5, 0.08, 3.5);
      pavilionGroup.add(teakDeck);

      // Roof: Ultra-thin cantilevered floating slab or vaulted clerestory
      if (roofType === 'sloped') {
        const vaultRoof = createGableRoof(13, 10, 2.0, 0.8, 0x090e17);
        vaultRoof.position.set(-0.5, 7.4, 0);
        pavilionGroup.add(vaultRoof);
      } else {
        const slimRoofGeo = new THREE.BoxGeometry(13.5, 0.3, 10.5);
        const slimRoof = new THREE.Mesh(slimRoofGeo, blackSteelMat);
        slimRoof.position.set(-0.5, 7.55, 0);
        slimRoof.castShadow = true;
        pavilionGroup.add(slimRoof);

        // LED Soffit Perimeter Strip
        const stripGeo = new THREE.BoxGeometry(13.2, 0.06, 10.2);
        const stripMat = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xfbbf24,
          emissiveIntensity: cfg.accentLightsIntensity * 0.8
        });
        const stripMesh = new THREE.Mesh(stripGeo, stripMat);
        stripMesh.position.set(-0.5, 7.36, 0);
        pavilionGroup.add(stripMesh);
      }

      houseGroup.add(pavilionGroup);
    }

    // -------------------------------------------------------------
    // STYLE 4: MINIMALIST CUBE
    // -------------------------------------------------------------
    else if (houseStyle === 'minimal') {
      // Primary Interlocking Geometric Volume
      const mainCubeGeo = new THREE.BoxGeometry(9.5, 4.6, 9.5);
      const mainCube = new THREE.Mesh(mainCubeGeo, baseWallMat);
      mainCube.position.set(0, 2.3, 0);
      mainCube.castShadow = true;
      mainCube.receiveShadow = true;
      houseGroup.add(mainCube);

      // Elevated Cantilevered Offset Volume
      const topCubeGeo = new THREE.BoxGeometry(8.2, 3.6, 7.8);
      const topCube = new THREE.Mesh(topCubeGeo, darkAccentMat);
      topCube.position.set(-1.8, 5.8, 0.8);
      topCube.castShadow = true;
      topCube.receiveShadow = true;
      houseGroup.add(topCube);

      // Clean Minimalist Ribbon Slot Windows
      const ribbonGeo = createWindow(6.5, 1.2, false);
      ribbonGeo.position.set(-1.8, 6.0, 4.75);
      houseGroup.add(ribbonGeo);

      // Vertical 2-Story Lightwell Slit
      const slitGeo = createWindow(0.8, 5.0, false);
      slitGeo.position.set(3.2, 3.6, 4.8);
      houseGroup.add(slitGeo);

      // Hidden Zen Pivot Door with Vertical Handle
      const zenDoorGeo = new THREE.BoxGeometry(1.4, 2.8, 0.1);
      const zenDoor = new THREE.Mesh(zenDoorGeo, woodSlatMat);
      zenDoor.position.set(1.4, 1.4, 4.78);
      houseGroup.add(zenDoor);

      // Floating concrete slabs over pebble court
      for (let s = 0; s < 4; s++) {
        const slabGeo = new THREE.BoxGeometry(2.2, 0.12, 1.0);
        const slab = new THREE.Mesh(slabGeo, stoneMat);
        slab.position.set(1.4, 0.06, 5.5 + s * 1.1);
        slab.receiveShadow = true;
        houseGroup.add(slab);
      }

      // Interior Living
      addInteriorLiving(houseGroup, -1.0, 0, 1.0);

      // Roof: Zero-overhang flush cube with Zen Sky Garden
      if (roofType === 'sloped') {
        const monoSlope = createGableRoof(8.5, 8.2, 2.0, 0.2, 0x1e293b);
        monoSlope.position.set(-1.8, 7.6, 0.8);
        houseGroup.add(monoSlope);
      } else {
        const parapetSlabGeo = new THREE.BoxGeometry(8.4, 0.35, 8.0);
        const parapetSlab = new THREE.Mesh(parapetSlabGeo, darkAccentMat);
        parapetSlab.position.set(-1.8, 7.7, 0.8);
        houseGroup.add(parapetSlab);

        // Zen Planter Box on Roof
        const planterGeo = new THREE.BoxGeometry(2.4, 0.6, 1.8);
        const planter = new THREE.Mesh(planterGeo, stoneMat);
        planter.position.set(-3.2, 8.1, 1.2);
        houseGroup.add(planter);

        // Sculptural Dwarf Tree in Planter
        const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 6);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3825 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(-3.2, 8.8, 1.2);
        trunk.rotation.z = 0.15;
        houseGroup.add(trunk);

        const bushGeo = new THREE.SphereGeometry(0.65, 8, 8);
        const bushMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
        const bush = new THREE.Mesh(bushGeo, bushMat);
        bush.position.set(-3.1, 9.4, 1.2);
        houseGroup.add(bush);
      }
    }

    // -------------------------------------------------------------
    // COMMON CONDITIONAL ATTACHMENTS (Balcony, Garage)
    // -------------------------------------------------------------
    // 1. Balcony
    if (showBalcony && houseStyle !== 'minimal') {
      const balconyGroup = new THREE.Group();
      const balcBaseGeo = new THREE.BoxGeometry(4.8, 0.25, 2.5);
      const balcBase = new THREE.Mesh(balcBaseGeo, darkAccentMat);
      balcBase.position.set(-2, 3.9, 5.5);
      balcBase.castShadow = true;
      balconyGroup.add(balcBase);

      if (houseStyle === 'classic') {
        // Classic Balustrade Rail
        for (let b = 0; b < 9; b++) {
          const balusterGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
          const baluster = new THREE.Mesh(balusterGeo, stoneMat);
          baluster.position.set(-4.0 + b * 0.5, 4.45, 6.7);
          balconyGroup.add(baluster);
        }
      } else {
        // Modern Glass Railing
        const railGeo = new THREE.BoxGeometry(4.8, 0.95, 0.08);
        const rail = new THREE.Mesh(railGeo, windowGlassMat);
        rail.position.set(-2, 4.5, 6.7);
        balconyGroup.add(rail);

        const handrailGeo = new THREE.BoxGeometry(4.85, 0.06, 0.12);
        const handrail = new THREE.Mesh(handrailGeo, blackSteelMat);
        handrail.position.set(-2, 4.98, 6.7);
        balconyGroup.add(handrail);
      }

      houseGroup.add(balconyGroup);
    }

    // 2. Garage Bay
    if (showGarage) {
      const garageGeo = new THREE.BoxGeometry(4.8, 3.6, 6.2);
      const garage = new THREE.Mesh(garageGeo, darkAccentMat);
      garage.position.set(5.8, 1.8, 0.8);
      garage.castShadow = true;
      garage.receiveShadow = true;
      houseGroup.add(garage);

      // Garage Door with Segmented Horizontal Ribs
      const doorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
      const garageDoorGeo = new THREE.BoxGeometry(4.0, 2.8, 0.1);
      const garageDoor = new THREE.Mesh(garageDoorGeo, doorMat);
      garageDoor.position.set(5.8, 1.4, 3.92);
      houseGroup.add(garageDoor);

      // Sconce Light above Garage Door
      const sconceGeo = new THREE.BoxGeometry(0.3, 0.1, 0.15);
      const sconce = new THREE.Mesh(sconceGeo, blackSteelMat);
      sconce.position.set(5.8, 3.0, 3.96);
      houseGroup.add(sconce);

      if (outdoorLights) {
        const sconceLight = new THREE.PointLight(0xfbbf24, cfg.accentLightsIntensity * 0.8, 6);
        sconceLight.position.set(5.8, 2.9, 4.1);
        houseGroup.add(sconceLight);
      }
    }
  }, [houseStyle, wallColor, roofType, showBalcony, showGarage, outdoorLights, lightingMode, lightingConfigs]);

  // Procedural Environment Builder (Lawn, Trees, Infinity Pool, Bollard Lights)
  useEffect(() => {
    const envGroup = environmentGroupRef.current;
    if (!envGroup) return;

    while (envGroup.children.length > 0) {
      const child = envGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      envGroup.remove(child);
    }

    const cfg = lightingConfigs[lightingMode] || lightingConfigs.twilight;

    // 1. Garden & Architectural Trees
    if (showGarden) {
      const gardenGroup = new THREE.Group();

      // Manicured Lawn
      const lawnGeo = new THREE.PlaneGeometry(18, 9);
      const lawnMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
      const lawn = new THREE.Mesh(lawnGeo, lawnMat);
      lawn.rotation.x = -Math.PI / 2;
      lawn.position.set(-6, 0.02, 6.5);
      lawn.receiveShadow = true;
      gardenGroup.add(lawn);

      // Tree Creator
      const createTree = (x, z, type = 'pine') => {
        const tree = new THREE.Group();
        const trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 2.6, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3825, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.3;
        trunk.castShadow = true;
        tree.add(trunk);

        if (type === 'pine') {
          // Tiered conical evergreen
          for (let i = 0; i < 3; i++) {
            const coneGeo = new THREE.ConeGeometry(1.6 - i * 0.35, 2.0, 8);
            const coneMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.7 });
            const cone = new THREE.Mesh(coneGeo, coneMat);
            cone.position.y = 2.8 + i * 1.1;
            cone.castShadow = true;
            tree.add(cone);
          }
        } else {
          // Lush Round Deciduous
          const foliageGeo = new THREE.DodecahedronGeometry(1.8, 1);
          const foliageMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.75 });
          const foliage = new THREE.Mesh(foliageGeo, foliageMat);
          foliage.position.y = 3.6;
          foliage.castShadow = true;
          tree.add(foliage);
        }

        tree.position.set(x, 0, z);
        return tree;
      };

      gardenGroup.add(createTree(-13, 5, 'pine'));
      gardenGroup.add(createTree(-11.5, 9, 'deciduous'));
      gardenGroup.add(createTree(10, -2, 'pine'));
      gardenGroup.add(createTree(11, 4, 'deciduous'));

      // Architectural Boxwood Hedges
      for (let h = 0; h < 4; h++) {
        const hedgeGeo = new THREE.BoxGeometry(1.2, 0.8, 0.8);
        const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
        const hedge = new THREE.Mesh(hedgeGeo, hedgeMat);
        hedge.position.set(-1.5 - h * 1.4, 0.4, 8.5);
        hedge.castShadow = true;
        gardenGroup.add(hedge);
      }

      envGroup.add(gardenGroup);
    }

    // 2. Infinity Swimming Pool
    if (showPool) {
      const poolGroup = new THREE.Group();

      // Stone Coping Rim Border
      const poolBorderGeo = new THREE.BoxGeometry(7.6, 0.25, 4.4);
      const poolBorderMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
      const poolBorder = new THREE.Mesh(poolBorderGeo, poolBorderMat);
      poolBorder.position.set(-8.0, 0.05, 5);
      poolGroup.add(poolBorder);

      // Luminous Water Plane
      const waterGeo = new THREE.PlaneGeometry(7.0, 3.8);
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.08,
        metalness: 0.3,
        transparent: true,
        opacity: 0.88,
        emissive: new THREE.Color(cfg.poolEmissive),
        emissiveIntensity: lightingMode === 'night' || lightingMode === 'twilight' ? 0.65 : 0.05
      });
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.rotation.x = -Math.PI / 2;
      water.position.set(-8.0, 0.14, 5);
      poolGroup.add(water);

      // Underwater Steps
      for (let st = 0; st < 3; st++) {
        const stepGeo = new THREE.BoxGeometry(1.8, 0.08, 0.8);
        const stepMat = new THREE.MeshStandardMaterial({ color: 0x0891b2 });
        const step = new THREE.Mesh(stepGeo, stepMat);
        step.position.set(-11.0 + st * 0.6, 0.08 - st * 0.03, 5);
        poolGroup.add(step);
      }

      // Underwater Cyan Point Light at Night
      if (outdoorLights && (lightingMode === 'night' || lightingMode === 'twilight')) {
        const poolLight = new THREE.PointLight(0x06b6d4, cfg.accentLightsIntensity * 1.5, 10);
        poolLight.position.set(-8.0, 0.5, 5);
        poolGroup.add(poolLight);
      }

      envGroup.add(poolGroup);
    }

    // 3. Outdoor Lighting Bollards & Architectural Facade Spotlights
    if (outdoorLights) {
      const lightsGroup = new THREE.Group();

      const bollardPositions = [
        [3.0, 8.2],
        [3.0, 11.2],
        [8.2, 8.2],
        [8.2, 11.2]
      ];

      bollardPositions.forEach(([bx, bz]) => {
        const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(bx, 0.45, bz);
        lightsGroup.add(post);

        const headGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 8);
        const headMat = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xfbbf24,
          emissiveIntensity: cfg.accentLightsIntensity
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(bx, 0.95, bz);
        lightsGroup.add(head);

        if (lightingMode !== 'day') {
          const ptLight = new THREE.PointLight(0xfbbf24, cfg.accentLightsIntensity * 0.6, 5);
          ptLight.position.set(bx, 1.1, bz);
          lightsGroup.add(ptLight);
        }
      });

      // Architectural Facade Uplight
      if (lightingMode !== 'day') {
        const facadeSpot = new THREE.SpotLight(0x38bdf8, cfg.accentLightsIntensity * 1.2, 18, Math.PI / 4, 0.5);
        facadeSpot.position.set(-6, 0.5, 9);
        facadeSpot.target.position.set(-2, 4, 0);
        lightsGroup.add(facadeSpot);
        lightsGroup.add(facadeSpot.target);
      }

      envGroup.add(lightsGroup);
    }
  }, [showGarden, showPool, outdoorLights, lightingMode, lightingConfigs]);

  // Camera Presets Animation
  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    const rot = cameraRotationRef.current;

    switch (presetName) {
      case 'front':
        rot.targetTheta = 0;
        rot.targetPhi = 0.35;
        rot.targetRadius = 24;
        rot.targetLookAtX = 0;
        rot.targetLookAtY = 3;
        rot.targetLookAtZ = 0;
        break;
      case 'back':
        rot.targetTheta = Math.PI;
        rot.targetPhi = 0.35;
        rot.targetRadius = 24;
        rot.targetLookAtX = 0;
        rot.targetLookAtY = 3;
        rot.targetLookAtZ = 0;
        break;
      case 'left':
        rot.targetTheta = -Math.PI / 2;
        rot.targetPhi = 0.35;
        rot.targetRadius = 24;
        rot.targetLookAtX = -2;
        rot.targetLookAtY = 3;
        rot.targetLookAtZ = 0;
        break;
      case 'right':
        rot.targetTheta = Math.PI / 2;
        rot.targetPhi = 0.35;
        rot.targetRadius = 24;
        rot.targetLookAtX = 2;
        rot.targetLookAtY = 3;
        rot.targetLookAtZ = 0;
        break;
      case 'top':
        rot.targetTheta = 0;
        rot.targetPhi = 0.05;
        rot.targetRadius = 28;
        rot.targetLookAtX = 0;
        rot.targetLookAtY = 0;
        rot.targetLookAtZ = 0;
        break;
      case 'interior':
        // Glides smoothly inside the living room
        rot.targetTheta = 0.15;
        rot.targetPhi = 0.55;
        rot.targetRadius = 1.8;
        rot.targetLookAtX = -1.5;
        rot.targetLookAtY = 1.8;
        rot.targetLookAtZ = 1.5;
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

  // Property Spec Calculations based on active configuration
  const currentSpecs = useMemo(() => {
    const baseArea = property?.area || 2400;
    const styleMultipliers = {
      modern: 1.0,
      classic: 1.25,
      luxury: 1.45,
      minimal: 0.9
    };
    const styleNames = {
      modern: 'Modern Villa',
      classic: 'Classic Manor',
      luxury: 'Luxury Glasshouse',
      minimal: 'Minimalist Cube'
    };
    const mult = styleMultipliers[houseStyle] || 1.0;
    const calcArea = Math.round(baseArea * mult);
    const bhk = houseStyle === 'luxury' || houseStyle === 'classic' ? 4 : 3;

    return {
      styleName: styleNames[houseStyle] || 'Modern Villa',
      area: calcArea,
      bhk,
      baths: houseStyle === 'luxury' ? 4 : 3,
      floors: houseStyle === 'minimal' && roofType === 'flat' ? 2 : (houseStyle === 'classic' ? 3 : 2),
      parking: showGarage ? 2 : 1
    };
  }, [houseStyle, roofType, showGarage, property]);

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
            <p style={{ fontWeight: 600 }}>Assembling 3D Spatial Twin...</p>
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
          <div className="hud-title">{currentSpecs.styleName}</div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bed size={13} /> Layout</span>
            <span>{currentSpecs.bhk} BHK</span>
          </div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Maximize size={13} /> Gross Area</span>
            <span>{currentSpecs.area.toLocaleString()} sq.ft</span>
          </div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bath size={13} /> Bathrooms</span>
            <span>{currentSpecs.baths} Bath</span>
          </div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layers size={13} /> Elevation</span>
            <span>{currentSpecs.floors} Levels</span>
          </div>
          <div className="hud-spec-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Car size={13} /> Garage</span>
            <span>{currentSpecs.parking} Bays</span>
          </div>
          <div className="hud-spec-row" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Compass size={13} /> Solar Bias</span>
            <span style={{ color: 'var(--accent-blue)', textTransform: 'capitalize' }}>{lightingMode}</span>
          </div>
        </div>
      </div>

      {/* 3D Customizer Bottom Controls (Only in full viewer mode) */}
      {!isHero && (
        <div className="three-customizer-panel">
          {/* House Style */}
          <div className="customizer-group">
            <div className="customizer-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Home size={14} color="var(--accent-blue)" />
              <span>Architectural Style</span>
            </div>
            <div className="button-toggle-group">
              {[
                { id: 'modern', label: 'Modern Villa' },
                { id: 'classic', label: 'Classic Manor' },
                { id: 'luxury', label: 'Luxury Glass' },
                { id: 'minimal', label: 'Minimalist Cube' }
              ].map((style) => (
                <button
                  key={style.id}
                  className={`toggle-chip ${houseStyle === style.id ? 'active' : ''}`}
                  onClick={() => setHouseStyle(style.id)}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Roof Profile */}
          <div className="customizer-group">
            <div className="customizer-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} color="var(--accent-blue)" />
              <span>Roof Profile</span>
            </div>
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
                Sloped Pitch
              </button>
            </div>
          </div>

          {/* Solar & Day/Night Lighting Simulation */}
          <div className="customizer-group">
            <div className="customizer-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sun size={14} color="var(--accent-blue)" />
              <span>Solar & Lighting</span>
            </div>
            <div className="button-toggle-group">
              {[
                { id: 'day', label: 'Day', icon: Sun },
                { id: 'golden', label: 'Golden', icon: Sunrise },
                { id: 'twilight', label: 'Twilight', icon: Sunset },
                { id: 'night', label: 'Night', icon: Moon }
              ].map((l) => {
                const IconComponent = l.icon;
                return (
                  <button
                    key={l.id}
                    className={`toggle-chip ${lightingMode === l.id ? 'active' : ''}`}
                    onClick={() => setLightingMode(l.id)}
                  >
                    <IconComponent size={13} />
                    <span>{l.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exterior Color */}
          <div className="customizer-group">
            <div className="customizer-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={14} color="var(--accent-blue)" />
              <span>Exterior Finish</span>
            </div>
            <div className="color-swatch-group">
              {[
                { name: 'Pure White', color: '#F8FAFC' },
                { name: 'Slate Gray', color: '#64748B' },
                { name: 'Tuscan Beige', color: '#D4B996' },
                { name: 'Horizon Blue', color: '#38BDF8' },
                { name: 'Charcoal Dark', color: '#1E293B' }
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

          {/* Environmental Modules */}
          <div className="customizer-group">
            <div className="customizer-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--accent-blue)" />
              <span>Amenities & Landscape</span>
            </div>
            <div className="button-toggle-group">
              <button
                className={`toggle-chip ${showGarden ? 'active' : ''}`}
                onClick={() => setShowGarden(!showGarden)}
              >
                <Trees size={13} />
                <span>Garden</span>
              </button>
              <button
                className={`toggle-chip ${showPool ? 'active' : ''}`}
                onClick={() => setShowPool(!showPool)}
              >
                <Waves size={13} />
                <span>Pool</span>
              </button>
              <button
                className={`toggle-chip ${showGarage ? 'active' : ''}`}
                onClick={() => setShowGarage(!showGarage)}
              >
                <Car size={13} />
                <span>Garage</span>
              </button>
              <button
                className={`toggle-chip ${showBalcony ? 'active' : ''}`}
                onClick={() => setShowBalcony(!showBalcony)}
              >
                <Layers size={13} />
                <span>Balcony</span>
              </button>
              <button
                className={`toggle-chip ${outdoorLights ? 'active' : ''}`}
                onClick={() => setOutdoorLights(!outdoorLights)}
              >
                <Lightbulb size={13} />
                <span>Lights</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
