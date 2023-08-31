import Obj from './Obj'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import Four from './Four'
export default class ModelObj extends Obj {
    constructor() {
        super(...arguments)
        const loader = new OBJLoader();
        // 2 加载obj模型
        loader.load("shelf.obj", (loadedMesh) => {
            console.log('loadedMesh', loadedMesh);
            
            loadedMesh.material = new THREE.MeshDepthMaterial({ color: 0xff0000 })
            console.log(loadedMesh);
            // 递归遍历 Group 内的所有子对象，提取缓冲几何体
            function extractBufferGeometries(object, bufferGeometries) {
                if (object instanceof THREE.Mesh && object.geometry instanceof THREE.BufferGeometry) {
                    bufferGeometries.push(object.geometry);
                }
                for (const child of object.children) {
                    extractBufferGeometries(child, bufferGeometries);
                }
            }
            const bufferGeometries = [];
            extractBufferGeometries(loadedMesh, bufferGeometries);
            const mergedGeometry = BufferGeometryUtils.mergeGeometries(bufferGeometries);
            mergedGeometry.center()
            const mergedMesh = new THREE.Mesh(mergedGeometry)
            const boundingBoxSize = Four.getBoundingSize(mergedMesh)
            const maxLen = Math.max(boundingBoxSize.x,boundingBoxSize.y,boundingBoxSize.z)
            if (maxLen > 10) {
                const scale = 10 / maxLen
                mergedMesh.scale.set(scale, scale, scale);
            }
            
            mergedMesh.position.set(0, 0, 0)
            mergedMesh.material = new THREE.MeshMatcapMaterial({ color: 0x4D515D })
            
            this.add(mergedMesh)
            this.initBoundingBox()
        })
    }
}