import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Torus() {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.005
            meshRef.current.rotation.y += 0.005
            meshRef.current.rotation.z += 0.002
        }
    })

    return (
        <mesh ref={meshRef} position={[-5, 0, -3]}>
            <torusGeometry args={[3, 1, 16, 100]} />
            <meshStandardMaterial color="#8a2be2" wireframe opacity={0.3} transparent />
        </mesh>
    )
}

function Icosahedron() {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.003
            meshRef.current.rotation.y += 0.007
        }
    })

    return (
        <mesh ref={meshRef} position={[5, -3, -5]}>
            <icosahedronGeometry args={[3, 0]} />
            <meshStandardMaterial color="#00bfff" wireframe opacity={0.3} transparent />
        </mesh>
    )
}

function Octahedron() {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.006
            meshRef.current.rotation.z += 0.003
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 5, -6]}>
            <octahedronGeometry args={[2.5, 0]} />
            <meshStandardMaterial color="#ff1493" wireframe opacity={0.2} transparent />
        </mesh>
    )
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 opacity-60">
            <Canvas camera={{ position: [0, 0, 10] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Torus />
                <Icosahedron />
                <Octahedron />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    )
}
