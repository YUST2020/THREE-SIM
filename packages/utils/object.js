import * as THREE from 'three'
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