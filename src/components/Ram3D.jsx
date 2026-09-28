import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

const tracePaths = [
  [[-1.9, .42], [-1.45, .42], [-1.2, .2], [-.82, .2]],
  [[-1.35, -.38], [-1.05, -.38], [-.82, -.14], [-.53, -.14]],
  [[-.74, .48], [-.55, .48], [-.32, .23], [.05, .23]],
  [[-.24, -.45], [.08, -.45], [.32, -.2], [.72, -.2]],
  [[.58, .42], [.88, .42], [1.12, .16], [1.48, .16]],
  [[1.24, -.42], [1.5, -.42], [1.72, -.2], [2.05, -.2]],
];
const focusLabels = {
  all: "MÓDULO COMPLETO",
  pcb: "PLACA PCB",
  chips: "CHIPS DE MEMORIA",
  heatsinks: "DISIPADORES",
  contacts: "CONTACTOS",
};

function createBoardGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-2.55, -.86);
  shape.lineTo(-2.55, .68);
  shape.lineTo(-2.38, .86);
  shape.lineTo(2.38, .86);
  shape.lineTo(2.55, .68);
  shape.lineTo(2.55, -.86);
  shape.lineTo(2.42, -.98);
  shape.lineTo(.25, -.98);
  shape.lineTo(.25, -.69);
  shape.lineTo(-.12, -.69);
  shape.lineTo(-.12, -.98);
  shape.lineTo(-2.42, -.98);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: .1,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: .025,
    bevelThickness: .018,
  });
}

function CircuitTrace({ points, index }) {
  const { curve, geometry } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y]) => new THREE.Vector3(x, y, .115)),
    );
    return {
      curve,
      geometry: new THREE.TubeGeometry(curve, 32, .009, 5, false),
    };
  }, [points]);
  const pulse = useRef();

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const progress = (clock.elapsedTime * .18 + index * .19) % 1;
    pulse.current.position.copy(curve.getPointAt(progress));
  });

  return <>
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#3c916f" emissive="#0b392d" emissiveIntensity={.65} metalness={.4} roughness={.38}/>
    </mesh>
    <mesh ref={pulse}>
      <sphereGeometry args={[.028, 12, 12]}/>
      <meshBasicMaterial color="#b6fff0" toneMapped={false}/>
    </mesh>
  </>;
}

function MemoryChip({ x, index }) {
  return <group position={[x, .04, .16]}>
    <RoundedBox args={[.48, .66, .17]} radius={.035} smoothness={4}>
      <meshStandardMaterial color="#10151a" metalness={.52} roughness={.27}/>
    </RoundedBox>
    <mesh position={[0, 0, .088]}>
      <boxGeometry args={[.36, .53, .008]}/>
      <meshStandardMaterial color="#202a31" metalness={.38} roughness={.3}/>
    </mesh>
    <mesh position={[0, -.24, .094]}>
      <boxGeometry args={[.18, .012, .006]}/>
      <meshBasicMaterial color="#8b9aa0"/>
    </mesh>
    <mesh position={[0, .23, .094]}>
      <boxGeometry args={[.23, .012, .006]}/>
      <meshBasicMaterial color="#68777d"/>
    </mesh>
    <mesh position={[0, .34, .01]}>
      <boxGeometry args={[.32, .025, .025]}/>
      <meshStandardMaterial color="#c6a45e" metalness={.82} roughness={.24}/>
    </mesh>
    <mesh position={[-.19, 0, .09]}>
      <boxGeometry args={[.018, .42, .012]}/>
      <meshStandardMaterial color="#99844f" metalness={.78} roughness={.27}/>
    </mesh>
    <mesh position={[.19, 0, .09]}>
      <boxGeometry args={[.018, .42, .012]}/>
      <meshStandardMaterial color="#99844f" metalness={.78} roughness={.27}/>
    </mesh>
    <group position={[0, 0, .105]}>
      {[-.13, -.065, 0, .065, .13].map((offset) => (
        <mesh key={offset} position={[offset, -.3, 0]}>
          <boxGeometry args={[.012, .035, .006]}/>
          <meshStandardMaterial color="#b79a60" metalness={.8} roughness={.25}/>
        </mesh>
      ))}
    </group>
    {index === 3 && <mesh position={[0, -.4, .13]}>
      <boxGeometry args={[.13, .012, .008]}/>
      <meshBasicMaterial color="#b5c1c3"/>
    </mesh>}
  </group>;
}

function HeatSpreaders() {
  const fins = useMemo(() => Array.from({ length: 17 }, (_, index) => -1.8 + index * .225), []);
  return <group>
    {[-1, 1].map((side) => (
      <group key={side} position={[0, 0, side * .24]}>
        <RoundedBox args={[4.65, .82, .1]} radius={.07} smoothness={5}>
          <meshStandardMaterial color="#6d7a7c" metalness={.88} roughness={.23}/>
        </RoundedBox>
        <mesh position={[0, 0, side * .052]}>
          <boxGeometry args={[3.75, .035, .012]}/>
          <meshStandardMaterial color="#c2b17f" metalness={.86} roughness={.25}/>
        </mesh>
        {fins.map((x) => (
          <mesh key={x} position={[x, 0, side * .052]}>
            <boxGeometry args={[.012, .58, .008]}/>
            <meshStandardMaterial color="#4c585b" metalness={.78} roughness={.3}/>
          </mesh>
        ))}
        {[-2.12, 2.12].map((x) => (
          <mesh key={x} position={[x, 0, side * .058]}>
            <boxGeometry args={[.12, .7, .025]}/>
            <meshStandardMaterial color="#303a3c" metalness={.82} roughness={.26}/>
          </mesh>
        ))}
      </group>
    ))}
  </group>;
}

function RamModule({ focus }) {
  const boardGeometry = useMemo(createBoardGeometry, []);
  const focusScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const group = useRef();
  const contacts = useMemo(
    () => Array.from({ length: 54 }, (_, index) => -2.43 + index * .09)
      .filter((x) => x < -.2 || x > .31),
    [],
  );
  const chips = useMemo(() => Array.from({ length: 8 }, (_, index) => -1.96 + index * .56), []);
  const showBoard = focus === "all" || focus === "pcb";

  useFrame((_, delta) => {
    if (!group.current) return;
    focusScale.setScalar(focus === "all" ? 1 : 1.1);
    group.current.scale.lerp(focusScale, 1 - Math.exp(-delta * 4));
  });

  return <group ref={group} rotation={[.035, -.1, -.015]}>
    <group visible={showBoard}>
      <mesh geometry={boardGeometry}>
        <meshStandardMaterial color="#174b3b" metalness={.24} roughness={.46}/>
      </mesh>
      {tracePaths.map((points, index) => <CircuitTrace key={index} points={points} index={index}/>)}
      <mesh position={[0, .04, .122]}>
        <boxGeometry args={[.28, .78, .025]}/>
        <meshStandardMaterial color="#14231f" metalness={.5} roughness={.34}/>
      </mesh>
      <mesh position={[0, .04, .14]}>
        <boxGeometry args={[.18, .62, .012]}/>
        <meshStandardMaterial color="#273732" metalness={.6} roughness={.24}/>
      </mesh>
      <group position={[-2.19, .66, .13]}>
        <RoundedBox args={[.36, .22, .04]} radius={.025} smoothness={3}>
          <meshStandardMaterial color="#20272a" metalness={.35} roughness={.42}/>
        </RoundedBox>
        <mesh position={[0, 0, .024]}>
          <boxGeometry args={[.19, .1, .008]}/>
          <meshStandardMaterial color="#8a9a91" metalness={.66} roughness={.3}/>
        </mesh>
      </group>
      {[-2.28, 2.28].map((x) => [-.56, .68].map((y) => (
        <mesh key={`${x}-${y}`} position={[x, y, .12]}>
          <circleGeometry args={[.035, 16]}/>
          <meshStandardMaterial color="#c6a45e" metalness={.9} roughness={.22}/>
        </mesh>
      )))}
      <group position={[-2.28, -.18, .13]}>
        <mesh>
          <boxGeometry args={[.06, .12, .02]}/>
          <meshStandardMaterial color="#d9b45f" metalness={.85} roughness={.2} emissive="#493814" emissiveIntensity={.3}/>
        </mesh>
        <StatusLight/>
      </group>
    </group>

    <group visible={focus === "all" || focus === "chips"}>
      {chips.map((x, index) => <MemoryChip key={x} x={x} index={index}/>)}
    </group>
    <group visible={focus === "all" || focus === "contacts"}>
      {contacts.map((x) => (
        <mesh key={x} position={[x, -.87, .11]}>
          <boxGeometry args={[.052, .2, .025]}/>
          <meshStandardMaterial color="#d7b15c" metalness={.94} roughness={.2}/>
        </mesh>
      ))}
    </group>
    <group visible={focus === "heatsinks"}>
      <HeatSpreaders/>
    </group>
  </group>;
}

function StatusLight() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = .45 + (Math.sin(clock.elapsedTime * 3.2) + 1) * .65;
    }
  });
  return <mesh ref={ref} position={[0, .1, .025]}>
    <sphereGeometry args={[.025, 12, 12]}/>
    <meshStandardMaterial color="#85ffe0" emissive="#44ffd1" emissiveIntensity={1}/>
  </mesh>;
}

export default function Ram3D({ focus = "all" }) {
  const stage = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!stage.current) return;
    if (!("IntersectionObserver" in window)) {
      setHasEntered(true);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting) setHasEntered(true);
    }, { rootMargin: "120px" });

    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={stage} className="ram-stage">
    {hasEntered && <Canvas dpr={[1, 1.25]} frameloop={isVisible ? "always" : "never"} camera={{ position: [0, .5, 7.9], fov: 39 }} gl={{ antialias: true, powerPreference: "low-power" }}>
        <color attach="background" args={["#07100f"]}/>
        <fog attach="fog" args={["#07100f", 8, 15]}/>
        <ambientLight intensity={1.15}/>
        <directionalLight position={[3, 5, 6]} intensity={3.2}/>
        <pointLight position={[-4, 1, 3]} intensity={27} distance={9} color="#48d7bd"/>
        <pointLight position={[4, 2, -3]} intensity={20} distance={8} color="#e2b761"/>
        <Environment preset="studio"/>
        <Float speed={1.4} rotationIntensity={.12} floatIntensity={.13}>
          <RamModule focus={focus}/>
        </Float>
        <Sparkles count={35} scale={[7, 4, 3]} size={1.15} speed={.25} color="#8df4d8"/>
        <ContactShadows position={[0, -1.1, 0]} opacity={.48} scale={8} blur={2.5} far={5}/>
        <OrbitControls enablePan={false} minDistance={5} maxDistance={10} autoRotate autoRotateSpeed={.55}/>
    </Canvas>}
    <div className="ram-focus-label">{focusLabels[focus] ?? focusLabels.all}</div>
    <div className="ram-hint">ARRASTRA · ROTACIÓN &nbsp; • &nbsp; RUEDA · ZOOM</div>
  </div>;
}
