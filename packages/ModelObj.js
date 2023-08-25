import Obj from './Obj'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three'
export default class ModelObj extends Obj {
    constructor() {
        super(...arguments)
        const loader = new OBJLoader();
        // 2 加载obj模型
        loader.load("shelf.obj", (loadedMesh) => {
            loadedMesh.scale.set(0.1, 0.1, 0.1);
            this.add(loadedMesh)
            loadedMesh.material = new THREE.MeshMatcapMaterial({ color: 0xff0000 })
            loadedMesh.rotation.x = Math.PI / 2
            loadedMesh.isObj = true
            this.initBoundingBox()
        })
    }
}