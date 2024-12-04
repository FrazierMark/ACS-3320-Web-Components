import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';

class CanvasComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.clock = new THREE.Clock();
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    // Set renderer clear color to match body
    this.renderer.setClearColor(0xffffff, 1);

    // Bind the tick method to the class instance
    this.animate = this.animate.bind(this);
  }

  /**
   * Animate Function
   */
  animate() {
    const elapsedTime = this.clock.getElapsedTime();
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.animate);
  }

  connectedCallback() {
    this.renderer.setSize(
      this.getAttribute('width') || 300,
      this.getAttribute('height') || 150
    );

    this.shadowRoot.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.camera.position.z = 5;

    this.animate();
  }
}

customElements.define('canvas-component', CanvasComponent);
