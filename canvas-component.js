import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import vertexShader from './shaders/vertexShader.js';
import fragmentShader from './shaders/fragmentShader.js';

class CanvasBackground extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
        style.textContent = `
            :host {
                position: fixed;
                z-index: -1;
                top: 0;
                left: 0;
            }
        `;
        this.shadowRoot.appendChild(style);

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			this.sizes.width / this.sizes.height,
			0.1,
			1000
		);
		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.clock = new THREE.Clock();
		this.orbitControls = new OrbitControls(
			this.camera,
			this.renderer.domElement
		);

		this.orbitControls.enableDamping = true;
		this.renderer.setClearColor(0xffffff, 1);
		this.animate = this.animate.bind(this);
		window.addEventListener('resize', this.handleResize.bind(this));
		this.backgroundMaterial = null;
	}

	/**
	 * Animate / Update
	 */
	animate() {
		const elapsedTime = this.clock.getElapsedTime();
		this.backgroundMaterial.uniforms.u_time.value = elapsedTime;
		this.orbitControls.update();
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.animate);
	}

	handleResize() {
		this.sizes.width = window.innerWidth;
		this.sizes.height = window.innerHeight;

		this.camera.aspect = this.sizes.width / this.sizes.height;

		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

	connectedCallback() {
		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		this.shadowRoot.appendChild(this.renderer.domElement);
		this.camera.position.set(0, 0.45, 0);
		this.camera.aspect = this.sizes.width / this.sizes.height
		this.camera.updateProjectionMatrix()


		const backgroundGeometry = new THREE.PlaneGeometry(2, 2, 256, 256);

		const colorA = this.getAttribute('color_a');
		const colorB = this.getAttribute('color_b');

		this.backgroundMaterial = new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				u_time: { value: 0 },
				u_colorA: { value: new THREE.Color(colorA) },
				u_colorB: { value: new THREE.Color(colorB) },
				u_noiseStrength: { value: 0.13 },
				u_noiseDensity: { value: 2.9 },
			},
		});


		const background = new THREE.Mesh(
			backgroundGeometry,
			this.backgroundMaterial
		);
		background.position.set(0, 0, 0);
		background.rotation.set(-Math.PI / 2, 0, 0);
		background.scale.set(1.5, 1.5, 1.5);

		this.scene.add(background);

		this.animate();
	}
}

customElements.define('canvas-background', CanvasBackground);
