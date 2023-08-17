import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 )
const particleGeometry = new THREE.BufferGeometry;
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3)
//assign random location values to particles
for(let i =0; i<particlesCount * 3; i++){

    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));


// Materials
const material = new THREE.PointsMaterial({
    size: 0.005
})
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005
})

// Mesh
const torus = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particleGeometry, particlesMaterial)
scene.add(torus, particlesMesh)


// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: 700 //window.innerHeight //* 1.05 // control height of canvas 
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    //sizes.height = window.innerHeight //* 1.05 // control height of canvas on resize
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color("#21282a"), 1)



//Mouse event lisnter for mouse movement direction relative to previous movement of mouse
document.addEventListener('mousemove', animateParticles)

let mouseX = 0;
let mouseY = 0;
function animateParticles(event){
    mouseY = event.movementY;
    mouseX = event.movementX;
}



const oneDegree  = 0.0174533; /// ~1 degree in radians  = 0.0174533

//move mesh with mouse motion
function particleControl (mouseX,mouseY){
  // cap rotaion speed
  function speed (mouse){
    let capSpeed = 6;
    if ( Math.abs(mouse) > capSpeed  ){
      return capSpeed* Math.sign(mouse)
    }else{
      return mouse
    }
  }

  //set rotation 
  particlesMesh.rotateY(oneDegree * speed(mouseX) * -.015)
  particlesMesh.rotateX(oneDegree * speed(mouseY) * -.015)
}


/**
 * Animate
 */

const animationLoop = () =>
{
    // Update objects
    torus.rotateY(oneDegree * 0.5);
    particlesMesh.rotateY(oneDegree *.01)
    if (mouseX != 0 || mouseY !=0){
      //new roation based on mouse move
        particleControl (mouseX, mouseY);
    }else{
      //sets initial particle rotation
      
    }
    // Render
    renderer.render(scene, camera)

    // Call loop again on the next frame
    window.requestAnimationFrame(animationLoop)
}

animationLoop();
