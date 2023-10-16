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
// 将add了多个物体的Object居中
export const centerObject3D = (object) => {
    // 获取包围盒
    const box = new THREE.Box3().setFromObject(object);
    // 获取中心点坐标
    const center = box.getCenter(new THREE.Vector3());
    // 获取差
    const diff = center.sub(object.position)
    // 遍历子对象
    object.traverse((child) => {
      // 减去中心点坐标
      child.position.sub(diff);
    });
  }
const loadedMeshCache = {}
const loader = new OBJLoader()
// 获取模型的Object scale: 缩放值
export const getModel = (path, scale = 1,  color= 0xB1B1B1 ) => {
    return new Promise((resolve) => {
        const cacheMesh = loadedMeshCache[path]
        // 有缓存过的就不重新加载
        if (cacheMesh) {
            resolve(cacheMesh.clone())
        } else {
            console.log('模型loader解析中...', path);
            loader.load(path,
                (loadedMesh) => {
                    loadedMesh.material = new THREE.MeshMatcapMaterial({ color: 0xB1B1B1 })
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
                    
                    mergedMesh.position.set(0, 0, 0)
                    mergedMesh.material = new THREE.MeshMatcapMaterial({ color })
                    // mergedMesh.material = new THREE.MeshStandardMaterial({
                    //     color: 0x4D515D,
                    //     metalness: 0.1,
                    //     roughness: 0.8,
                    //   })
                    scale = typeof scale === 'number' ? scale : 1
                    mergedMesh.scale.set(scale, scale, scale); 
                    loadedMeshCache[path] = mergedMesh.clone()
                    console.log('模型加载完毕', path);
                    resolve(mergedMesh)
                })
        }
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
// 设置物体底部中心的坐标
export const setBottomPosition = (obj, pos={}) => {
    const {z} = getBoundingSize(obj)
    const position = Object.assign({...obj.position},pos)
    position.z += z / 2
    obj.position.set(position.x, position.y, position.z)
}
// 设置物体顶部中心的坐标
export const setTopPosition = (obj, pos={}) => {
    const {z} = getBoundingSize(obj)
    const position = Object.assign({...obj.position},pos)
    position.z -= z / 2
    obj.position.set(position.x, position.y, position.z)
}
// 将一个物体移动到另一个物体的某个方向上方
export const moveToObjectTop = (moveObj, targetObj, axis = 'z') => {
    const targetBound = getBoundingSize(targetObj)
    const moveBound = getBoundingSize(moveObj)
    const worldPosition = new THREE.Vector3();
    targetObj.getWorldPosition(worldPosition);
    worldPosition[axis] += (targetBound[axis] + moveBound[axis]) / 2
    moveObj(moveObj)
}
// 将一个模型的xyz缩放到指定长宽高
export const scaleToSize = (obj, size={ x: 10, y: 10, z: 10} ) => {
    const arr = ['x','y','z']
    for (let axis of arr) {
        if (typeof size[axis] === 'number') {
            obj.scale[axis] = 1
            const boundSize = getBoundingSize(obj)
            obj.scale[axis] = size[axis] / boundSize[axis]
        }
    }
}
export default { getBoundingSize, getOriginSize, getModel, moveObj, moveObjBySelf,
     centerObject3D, setBottomPosition, moveToObjectTop, scaleToSize, setTopPosition }