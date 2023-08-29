import Obj from './Obj'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three'
export default class ModelObj extends Obj {
    constructor() {
        super(...arguments)
        const loader = new OBJLoader();
        // 2 加载obj模型
        loader.load("shelf.obj", (loadedMesh) => {
            console.log('loadedMesh', loadedMesh);
            loadedMesh.scale.set(0.1, 0.1, 0.1);
            loadedMesh.position.set(0,0,0)
            loadedMesh.material = new THREE.MeshDepthMaterial({ color: 0xff0000 })
           // loadedMesh.rotation.x = Math.PI / 2
            this.add(loadedMesh)
            this.initBoundingBox()
        })
    }
}