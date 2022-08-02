import * as THREE from "three";
import { OrbitControls } from "@three/controls/OrbitControls";
import { Noise } from "../Sea";
import Boat from "../Boat";

export default class Camera extends THREE.PerspectiveCamera {
  private controls: OrbitControls;
  waterPlane: THREE.Plane;
  ray: THREE.Ray;
  constructor(
    public readonly fov: number,
    public aspect: number,
    public readonly domElement: HTMLElement
  ) {
    super(fov, aspect, 1e-2, 1e2);

    this.controls = new OrbitControls(this, this.domElement);
    this.controls.enableDamping = false;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = THREE.MathUtils.degToRad(0);
    this.controls.maxPolarAngle = THREE.MathUtils.degToRad(90);

    this.controls.minAzimuthAngle = THREE.MathUtils.degToRad(180);
    this.controls.maxAzimuthAngle  = THREE.MathUtils.degToRad(360);

    this.controls.maxDistance = 1;
    this.controls.maxZoom = 1;

    this.controls.target.set(-0.680,0.09,0);
    // this.controls.minDistance = 2;
    // this.controls.maxDistance = 3;
    this.position.set(3, 1, 0);

    /**
     * Math representation of sea's surface
     */
    this.waterPlane = new THREE.Plane(
      new THREE.Vector3(0, -1, 0),
      0
    );
    /**
     * Ray from controls target to camera's current position
     */
    this.ray = new THREE.Ray();
  }

  dummyVector = new THREE.Vector3();

  static zeroVector = new THREE.Vector3();
  update(boat: Boat) {
    this.ray.set(
      this.controls.target,
      this.dummyVector
        .subVectors(this.controls.target, this.position)
        .normalize()
        .negate()
    );

    // this.controls.maxDistance = Math.min(
    //   3,
    //   this.ray.distanceToPlane(this.waterPlane) || Infinity
    // );
    this.controls.maxDistance = 1;

    this.ray.set(
      this.position,
      this.dummyVector
        .subVectors(this.controls.target, this.position)
        .normalize()
    );
    //  this.controls.minDistance = Math.min(
    //    this.controls.maxDistance,
    //    this.ray
    //      .intersectBox(this.boatBoundingBox, this.dummyVector)
    //      .distanceTo(this.controls.target)
    //  );
    this.controls.minDistance = 0.5;

    this.controls.update();
  }

  boatBoundingBox = new THREE.Box3();
  adjustToBoat(boat: Boat) {
   this.controls.target.copy(boat.center);
   this.boatBoundingBox.setFromCenterAndSize(boat.center, boat.size);
  }
  adjustToPoint(point: THREE.Vector3,boat: Boat) {
    this.controls.target.copy(point);

    //var f = 2;
   //this.boatBoundingBox.setFromCenterAndSize(point, new THREE.Vector3(boat.size.x/f,boat.size.y/f,boat.size.z/f));
   this.boatBoundingBox.setFromCenterAndSize(point, new THREE.Vector3(1,1,1));

  
  }

  handleResize(width: number, height: number, pixelRatio: number) {
    this.aspect = width / height;
    this.updateProjectionMatrix();
  }
  get target() {
    return this.controls.target;
  }
}
