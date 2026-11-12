import * as THREE from 'three'
import { loadGLTF } from './model'
import type { Animated } from './animated'
import { tableLevel } from './constants'

const url: string = '/31/ducks.glb'

export async function createDucks(): Promise<Animated> {
  const gltf = await loadGLTF(url)
  const avatar = gltf.scene

  avatar.position.set(-5, tableLevel, 2)
  avatar.rotation.y = THREE.MathUtils.degToRad(30)
  avatar.scale.set(0.5, 0.5, 0.5)

  const mixer = new THREE.AnimationMixer(avatar)
  gltf.animations.forEach((clip) => mixer.clipAction(clip).play())

  return { avatar, mixer }
}
