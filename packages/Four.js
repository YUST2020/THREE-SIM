import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "./TransformControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
export default class Four {
  constructor(dom) {
    this.dom = dom; // 外围dom元素
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.css2dRenderer = null;
    this.css3dRenderer = null;
    this.controls = null; // 场景拖动控制器
    this.transformControls = null;
    this.curObj = null; // 当前选中object
    this.keyboard = {}; // 记录当前已按下的按钮
    this.direction = new THREE.Vector3(); // 当前朝向的向量
    this.init();
    this.initEvent();
    this.animate();
  }

  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfdf5e6); // 添加背景颜色

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.dom.clientWidth / this.dom.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 10, 10);
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.up.set(0, 0, 1)

    let ambient = new THREE.AmbientLight(0x444444, 3); // 添加光源  颜色和光照强度
    let axisHelper = new THREE.AxesHelper(600); // 添加辅助坐标系 参数位辅助坐标系的长度
    this.scene.add(ambient, axisHelper); // 向场景中添加光源 和 辅助坐标系

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); // 加入去除锯齿功能
    this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
    this.dom.appendChild(this.renderer.domElement);

    const initRenderer = (renderer) => {
      renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0px";
      renderer.domElement.style.left = "0px";
      renderer.domElement.style["pointer-events"] = "none";
      this.dom.appendChild(renderer.domElement);
    };
    // css2d渲染器
    this.css2dRenderer = new CSS2DRenderer();
    initRenderer(this.css2dRenderer);
    // css3d渲染器
    this.css3dRenderer = new CSS3DRenderer();
    initRenderer(this.css3dRenderer);
    // 添加鼠标控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    this.controls.enableKeys = true;
    this.controls.dampingFactor = true;

    // 添加变换控制器
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.controls.enabled = !event.value;
      this.controls.enableZoom = !event.value;
    });
    this.scene.add(this.transformControls);

    // 添加地面
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0xf1f3f4, side: THREE.DoubleSide })
    );
    // plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);
  }

  initEvent() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // 鼠标移动事件处理函数
    const onDocumentMouseMove = (event) => {
      // 得到鼠标相对于容器的坐标
      mouse.x = (event.clientX / this.dom.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / this.dom.clientHeight) * 2 + 1;
    };
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    const onDocumentClick = () => {
      // 执行射线检测
      raycaster.setFromCamera(mouse, this.camera);
      let intersects = raycaster.intersectObjects(this.scene.children, true);
      // 判断是否成功
      if (intersects.length > 0) {
        // 选取第一个可拖拽物体并对其执行交互
        let object = intersects.find((val) => val.object.isObj)?.object;
        console.log("objects:", intersects, object);
        // 设置边框，选中标签显示状态
        const batchSetChildrenVisible = (obj, show) => {
          if (!obj) return
          const removeList = [];
          for (let child of obj.children) {
            // 设置选中时外边框的显隐
            if (child.isSelectBox) {
              child.visible = show;
            }
            if (!show && child.type === "Object3D") {
              removeList.push(child);
            }
          }
          for (let rObj of removeList) {
            obj.remove(rObj);
          }
        };
        console.log(object, this.curObj, this.curObj === object);
        if (this.curObj && object && this.curObj !== object) {
          batchSetChildrenVisible(this.curObj, false);
        }
        // 判断是否点击了空地 待修改，感觉这个判断逻辑可能翻车
        if (intersects?.[0]?.object.type === 'TransformControlsPlane') {
          this.transformControls.detach()
          batchSetChildrenVisible(this.curObj, false);
          this.curObj = null
        }
        if (object) {
          batchSetChildrenVisible(object, true);
          this.curObj = object;
          this.transformControls.attach(this.curObj);
          // 2d
          const labelDiv = document.createElement("div");
          labelDiv.innerHTML = "2d标签";
          labelDiv.style.pointerEvents = "none";
          labelDiv.style.backgroundColor = "#888888";
          const labelObject = new CSS2DObject(labelDiv);
          labelObject.position.set(0, 2, 0);
          this.curObj.add(labelObject);
        }
        
      }
    };
    document.addEventListener("click", onDocumentClick, false);
    // 监听当前按下的按键，用于控制相机移动
    document.addEventListener('keydown', (event) => {
      this.keyboard[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
      this.keyboard[event.code] = false;
    })
  }
  // 添加obj到场景内
  add(obj) {
    this.scene.add(obj);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const initZ = this.camera.position.z
    this.camera.getWorldDirection(this.direction);
    this.direction.normalize();
    const moveSpeed = 0.5
    if (this.keyboard['KeyW']) this.camera.position.addScaledVector(this.direction, moveSpeed)
    if (this.keyboard['KeyS']) this.camera.position.addScaledVector(this.direction, -moveSpeed)
    const vertical = new THREE.Vector3();
    vertical.crossVectors(this.direction, this.camera.up).normalize();
    if (this.keyboard['KeyA']) this.camera.position.addScaledVector(vertical, -moveSpeed);
    if (this.keyboard['KeyD']) this.camera.position.addScaledVector(vertical, moveSpeed);
    this.camera.position.z = initZ
    if (this.keyboard['Space']) this.camera.position.z += moveSpeed;
    if (this.keyboard['ControlShift']) this.camera.position.z += moveSpeed;
    if (this.keyboard['ControlLeft']) this.camera.position.z -= moveSpeed;

    // this.controls.update()
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
    this.css2dRenderer.render(this.scene, this.camera);
    this.css3dRenderer.render(this.scene, this.camera);
  }
  static getBoundingSize(obj) {
    let boundingBox = new THREE.Box3().setFromObject(obj);
    let size = new THREE.Vector3();
    boundingBox.getSize(size);
    return size;
  }
}
