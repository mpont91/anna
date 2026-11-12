import * as THREE from 'three'
import { loadGLTF } from './model'
import type { Animated } from './animated'
import { tableLevel } from './constants'

const url: string = '/31/bird.glb'

export async function createBird(): Promise<Animated> {
  const gltf = await loadGLTF(url)
  const avatar = gltf.scene

  avatar.position.set(5, tableLevel, 1)
  avatar.rotation.y = THREE.MathUtils.degToRad(-30)
  avatar.scale.set(0.3, 0.3, 0.3)

  const mixer = new THREE.AnimationMixer(avatar)
  gltf.animations.forEach((clip) => mixer.clipAction(clip).play())

  return { avatar, mixer }
}
