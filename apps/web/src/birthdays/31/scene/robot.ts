import * as THREE from 'three'
import { loadGLTF } from './model'
import type { Animated } from './animated'
import { tableLevel } from './constants'

const url: string = '/31/robot.glb'

export async function createRobot(): Promise<Animated> {
  const gltf = await loadGLTF(url)
  const avatar = gltf.scene

  avatar.position.set(-7, tableLevel, -3)
  avatar.rotation.y = THREE.MathUtils.degToRad(-45)
  avatar.scale.set(2, 2, 2)

  const mixer = new THREE.AnimationMixer(avatar)
  gltf.animations.forEach((clip) => mixer.clipAction(clip).play())

  return { avatar, mixer }
}
