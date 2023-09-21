import * as THREE from "three";
import { Object3D } from 'three'
import TWEEN from "@tweenjs/tween.js"
export default class Obj extends Object3D {
  // position 位置信息 options：{}
  constructor(position, options = {}) {
    super()
    this.options = {
      id: Math.random(),
      speed: 1,
      ...options
    };
    this.isMoving = false
    // 设置形状材质
    const posInfo = {
      x: 0, y: 0, z: 0,
      scaleX: 1, scaleY: 1, scaleZ: 1,
      rotateX: 0, rotateY: 0, rotateZ: 0,
      ...position
    }
    const { x, y, z, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ } = posInfo
    // const size = this.getSize();
    this.position.set(x, y, z);
    this.scale.set(scaleX, scaleY, scaleZ)
    this.rotation.set(rotateX, rotateY, rotateZ)
    this.initBoundingBox();

    // 标识要在initBoundingBox后面，否则会触发到copy
    // 标识为可拖拽最外围
    this.isOuter = true;
    // this.initDrag();
  }
  getSize() {
    const boundingBox = new THREE.Box3().setFromObject(this);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    return size;
  }
  // 初始化hover和select的包围框
  initBoundingBox() {
    // 二次生成时对之前的先进行移除
    const removeList = [];
    for (let i of this.children) {
      if (i.isHoverBox || i.isSelectBox) {
        removeList.push(i);
      }
    }
    for (let i of removeList) {
      this.remove(i);
    }
    const cloneObj = new Object3D()
    cloneObj.copy(this);
    cloneObj.position.set(0, 0, 0);
    cloneObj.scale.set(1, 1, 1)
    cloneObj.rotation.set(0, 0, 0)
    // 包围盒
    const boundingBox = new THREE.Box3().setFromObject(cloneObj);
    // 接收hover事件的包围盒物体
    const size = boundingBox.getSize(new THREE.Vector3())
    const boundingBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    boundingBoxMesh.isBoundingBox = true
    this.add(boundingBoxMesh)
    // hover时触发的线框
    let hoverBoxHelper = new THREE.Box3Helper(boundingBox, 0x00eeff);
    hoverBoxHelper.visible = false;
    hoverBoxHelper.isHoverBox = true;
    this.add(hoverBoxHelper);
    // 选中时触发的线框
    let selectBoxHelper = new THREE.Box3Helper(boundingBox, 0x1890ff);
    selectBoxHelper.visible = false;
    selectBoxHelper.isSelectBox = true;
    this.add(selectBoxHelper);
  }
  initDrag() {
    // // 重复调用判定
    // this.dragControls?.deactivate();
    // this.arrowX && this.options.scene.remove(this.arrowX);
    // this.arrowZ && this.options.scene.remove(this.arrowZ);
    // this.arrowY && this.options.scene.remove(this.arrowY);

    // const size = this.getSize();
    // // z方向拖拽箭头
    // const { object: arrowZ } = new Arrow();
    // arrowZ.position.copy(this.object.position);
    // arrowZ.rotation.x = Math.PI / 2;
    // arrowZ.position.z += size.z + 0.5;
    // arrowZ.isZDirection = true;
    // this.options.scene.add(arrowZ);
    // // x方向拖拽箭头
    // const { object: arrowX } = new Arrow();
    // arrowX.position.copy(this.object.position);
    // arrowX.rotation.z = -Math.PI / 2;
    // arrowX.position.x += size.x + 0.5;
    // arrowX.isXDirection = true;
    // this.options.scene.add(arrowX);
    // // y方向拖拽箭头
    // const { object: arrowY } = new Arrow();
    // arrowY.position.copy(this.object.position);
    // arrowY.rotation.y = -Math.PI / 2;
    // arrowY.position.y += size.x + 0.5;
    // arrowY.isYDirection = true;
    // this.options.scene.add(arrowY);
    // // 生成物体运动的平面
    // const plane = new THREE.Plane();
    // const normal = new THREE.Vector3(0, 1, 0); // x-z平面的法线向量
    // const point = new THREE.Vector3(0, 0, 0); // 经过平面的点
    // plane.setFromNormalAndCoplanarPoint(normal, point);
    // // 此处第4个参数为修改源码添加的自定义参数，用于指定物体只能在某一个平面上运动
    // this.dragControls = new DragControls(
    //   [this.object, arrowZ, arrowX, arrowY],
    //   this.options.camera,
    //   this.options.renderer.domElement,
    //   plane,
    //   true
    // );
    // this.dragControls.transformGroup = true;
    // let xInit = null;
    // let zInit = null;
    // // 拖拽事件监听
    // this.dragControls.addEventListener("dragstart", (e) => {
    //   console.log("dragStart", e.intersections);
    //   const firstObj = e.intersections.find(val => val.object?.type !== 'Box3Helper' && !val.isChild)?.object
    //   if (firstObj?.isXDirection) {
    //     zInit = this.object.position.z;
    //   }
    //   if (firstObj?.isZDirection) {
    //     xInit = this.object.position.x;
    //   }
    //   this.options.controls.enabled = false;
    //   this.options.controls.enableZoom = false;
    //   typeof this.dragStart === "function" && this.dragStart(e);
    // });
    // this.dragControls.addEventListener("dragend", (e) => {
    //   this.options.controls.enabled = true;
    //   this.options.controls.enableZoom = true;
    //   xInit = null;
    //   zInit = null;
    //   typeof this.dragEnd === "function" && this.dragEnd(e);
    // });
    // this.dragControls.addEventListener("drag", (e) => {
    //   if (typeof xInit === "number") {
    //     e.object.position.x = xInit;
    //     arrowX.position.x = xInit + size.x + 0.5
    //     arrowZ.position.x = xInit
    //     arrowY.position.x = xInit
    //   }
    //   if (typeof zInit === "number") {
    //     e.object.position.z = zInit;
    //     arrowX.position.z = zInit
    //     arrowZ.position.z = zInit + size.x + 0.5
    //     arrowY.position.z = zInit
    //   }
    //   //arrowX.position.copy(e.object.position);
    //   // arrowX.position.x += size.x + 0.5;
    //   // arrowZ.position.copy(e.object.position);
    //   // arrowZ.position.z += size.z + 0.5;

    //   typeof this.drag === "function" && this.drag(e);
    // });
    // // hover
    // this.dragControls.addEventListener("hoveron", (e) => {
    //   if (e.object.isHoverBox) {
    //     e.object.visible = true;
    //   }
    //   typeof this.hoverOn === "function" && this.hoverOn(e);
    // });
    // this.dragControls.addEventListener("hoveroff", (e) => {
    //   if (e.object.isHoverBox) {
    //     e.object.visible = false;
    //   }
    //   typeof this.hoverOff === "function" && this.hoverOff(e);
    // });
    // this.arrowX = arrowX;
    // this.arrowY = arrowY;
    // this.arrowZ = arrowZ;
  }
  // 以绝对坐标系为基准移动
  async moveTo(toPosition = {}) {
    const { x, y, z } = toPosition
    const moveAxis = (pos) => {
      return new Promise((resolve) => {
        new TWEEN.Tween(this.position)
          .to({ ...pos }, 4000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
          .onComplete(() => { resolve() })
      })
    }
    if (x || x === 0) {
      await moveAxis({ x })
    }
    if (y || y === 0) {
      await moveAxis({ y })
    }
    if (z || z === 0) {
      await moveAxis({ z })
    }
  }
}
