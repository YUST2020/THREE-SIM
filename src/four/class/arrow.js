import * as THREE from "three";

const material = new THREE.MeshBasicMaterial({ color: 0xfff44f });
export default class Arrow {
  object;
  constructor(direction) {
    this.object = new THREE.Group();
    // 设置形状材质
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1, 4), material);
    arrow.isChild = true
    this.object.add(arrow);
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 1, 32),
      material
    );
    cylinder.isChild = true
    cylinder.position.y = -1;
    this.object.add(cylinder);
  }
  getSize() {
    const boundingBox = new THREE.Box3().setFromObject(this.object);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    return size;
  }
}
