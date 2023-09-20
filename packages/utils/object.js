import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import TWEEN from "@tweenjs/tween.js"
// 获取包围盒的大小
export const getBoundingSize = (obj) => {
    let boundingBox = new THREE.Box3().setFromObject(obj);
    let size = new THREE.Vector3();
    boundingBox.getSize(size);
    return size;
}
// 获取没被缩放前的包围盒的大小
export const getOriginSize = (obj) => {
    const size = getBoundingSize(obj)
    size.x /= obj.scale.x
    size.y /= obj.scale.y
    size.z /= obj.scale.z
    return size
}
// 获取模型的Object scale: 是否缩放至10
export const getModel = (path, scale = true) => {
    return new Promise((resolve, reject) => {
        const loader = new OBJLoader()
        loader.load(path,
            (loadedMesh) => {
                console.log('loadedMesh', loadedMesh);
                loadedMesh.material = new THREE.MeshMatcapMaterial({ color: 0x4D515D })
                // 递归遍历 Group 内的所有子对象，提取缓冲几何体
                function extractBufferGeometries(object, bufferGeometries) {
                    if (object instanceof THREE.Mesh && object.geometry instanceof THREE.BufferGeometry) {
                        delete object.geometry.attributes.uv
                        bufferGeometries.push(object.geometry);
                    }
                    for (const child of object.children) {
                        extractBufferGeometries(child, bufferGeometries);
                    }
                }
                let bufferGeometries = [];
                extractBufferGeometries(loadedMesh, bufferGeometries);
                const mergedGeometry = BufferGeometryUtils.mergeGeometries(bufferGeometries);
                mergedGeometry.center()
                const mergedMesh = new THREE.Mesh(mergedGeometry)
                const boundingBoxSize = getBoundingSize(mergedMesh)
                const maxLen = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z)
                mergedMesh.position.set(0, 0, 0)
                mergedMesh.material = new THREE.MeshMatcapMaterial({ color: 0x4D515D })
                // mergedMesh.material = new THREE.MeshStandardMaterial({
                //     color: 0x4D515D,
                //     metalness: 0.1,
                //     roughness: 0.8,
                //   })
                // 根据3边的最长边缩放到10单位
                if (scale && maxLen > 10) {
                    const scale = 0.1 // 10 / maxLen
                    mergedMesh.scale.set(scale, scale, scale);
                }
                resolve(mergedMesh)
            }),
            () => { },
            () => { reject() }
    })
}
// 直线移动到指定坐标
const objLineMove = (obj, pos) => {
    pos = Object.assign({ x: obj.position.x, y: obj.position.y, z: obj.position.z }, pos)
    const moveLen = Math.abs(pos.x - obj.position.x) + Math.abs(pos.y - obj.position.y) + Math.abs(pos.z - obj.position.z)
    return new Promise((resolve) => {
        new TWEEN.Tween(obj.position)
            .to({ ...pos }, moveLen * 100)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start()
            .onComplete(() => { resolve() })
    })
}
// 世界坐标系根据指定轴顺序进行移动
export const moveObj = async (obj, toPosition = {}, options = {}) => {
    options = Object.assign({
        order: ['x', 'y', 'z']
    }, options)

    for (let axis of options.order) {
        if (toPosition[axis] !== undefined) {
            await objLineMove(obj, { [axis]: toPosition[axis] })
        }
    }
}
// 根据自身来进行相对运动
export const moveObjBySelf = async (obj, selfPosition = {}, options = {}) => {
    options = Object.assign({
        order: ['x', 'y', 'z']
    }, options)
    for (let axis of options.order) {
        if (selfPosition[axis] !== undefined) {
            await objLineMove(obj, { [axis]: obj.position[axis] + selfPosition[axis] })
        }
    }
}
export default { getBoundingSize, getOriginSize, getModel, moveObj, moveObjBySelf }