import * as THREE from 'three'
import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'

const redMaterial = new THREE.MeshBasicMaterial({ color: 'aquamarine' })

function ReuseMaterial(props: any) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[0.25, 64, 64]} />
      <primitive attach="material" object={redMaterial} />
    </mesh>
  )
}

function TestReuse() {
  const [i, set] = useState(true)
  useEffect(() => void setInterval(() => set((s) => !s), 1000), [])
  return (
    <>
      {i && <ReuseMaterial position={[-1.5, 0, 0]} />}
      <ReuseMaterial position={[1.5, 0, 0]} />
    </>
  )
}

function TestMultiMaterial(props: any) {
  const ref = useRef<THREE.Mesh>(null!)
  const [ok, set] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => set((ok) => !ok), 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    console.log(ref.current.material)
  }, [ok])
  return (
    <mesh ref={ref} material={useRef([]).current} {...props}>
      <boxGeometry args={[0.75, 0.75, 0.75]} />
      <meshBasicMaterial attach="material-0" color="hotpink" />
      <meshBasicMaterial attach="material-1" color="lightgreen" />
      {ok ? <meshBasicMaterial attach="material-2" color="lightblue" /> : <meshNormalMaterial attach="material-2" />}
      <meshBasicMaterial attach="material-3" color="pink" />
      <meshBasicMaterial attach="material-4" color="orange" />
      <meshBasicMaterial attach="material-5" color="lavender" />
    </mesh>
  )
}

function TestMultiDelete(props: any) {
  const ref = useRef<THREE.Mesh>(null!)
  const [ok, set] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => set((ok) => !ok), 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    console.log(ref.current.material)
  }, [ok])
  return (
    <mesh ref={ref} material={useRef([]).current} {...props}>
      <boxGeometry args={[0.75, 0.75, 0.75]} />
      <meshBasicMaterial attach="material-0" color="hotpink" side={THREE.DoubleSide} />
      <meshBasicMaterial attach="material-1" color="lightgreen" side={THREE.DoubleSide} />
      {ok && <meshBasicMaterial attach="material-2" color="lightblue" side={THREE.DoubleSide} />}
      <meshBasicMaterial attach="material-3" color="pink" side={THREE.DoubleSide} />
      <meshBasicMaterial attach="material-4" color="orange" side={THREE.DoubleSide} />
      <meshBasicMaterial attach="material-5" color="lavender" side={THREE.DoubleSide} />
    </mesh>
  )
}

function TestMix(props: any) {
  const [size, set] = useState(0.1)
  useEffect(() => {
    const timeout = setInterval(
      () =>
        set((s) => {
          return s < 0.4 ? s + 0.025 : 0
        }),
      1000,
    )
    return () => clearTimeout(timeout)
  }, [])
  let g = useMemo(() => new THREE.SphereGeometry(size, 64, 64), [size])
  return (
    <mesh args={[g]} {...props}>
      <meshBasicMaterial color="hotpink" />
    </mesh>
  )
}

export default function Test() {
  return (
    <Canvas camera={{ position: [2, 2, 2] }}>
      <TestMultiMaterial position={[0, 0, 0.5]} />
      <TestMultiDelete position={[0, 0, -0.5]} />
      <TestReuse />
      <TestMix position={[0, 1, 0]} />
    </Canvas>
  )
}
