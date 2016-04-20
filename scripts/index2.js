var renderer, camera, scene, controls;
var squares;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const VIEW_ANGLE = 20;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

const SQUARE_SIZE = 20;

setupWebGL();

var cubeMapping = getWebGLMapping();
var cube = new Cube(cubeMapping);

var squareGeometry = new THREE.BoxGeometry(SQUARE_SIZE, SQUARE_SIZE, 1);
var squares = getSquares();
for (var i = 0; i < squares.length; i++) {
  scene.add(squares[i]);
}

draw();

function draw() {
  for (var face = 0; face < 6; face++) {
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        var currentSquare = cube.squares[face][row][col];
        var squareId = getSquareIdByFaceRowCol(face, row, col);
        squares[squareId].material.color.setStyle(currentSquare);
      }
    }
  }
  renderer.render(scene, camera);
}

function setupWebGL() {
  var container = document.getElementById('container');

  scene = new THREE.Scene();

  // CAMERA
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.z = 300;

  // ORBIT CONTROLS
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', draw );

  // REDNERER
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  container.appendChild(renderer.domElement);

  // LIGHTING
  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 300;
  pointLight.position.y = 0;
  pointLight.position.z = 300;
  scene.add(pointLight);
  var light = new THREE.AmbientLight( 0xC0C0C0 );
  scene.add(light);
}

function getSquares() {
  var squares = [];
  var square;

  for (var face = 0; face < 6; face++) {
    var currentRotation = cube.mapping.rotation[face];
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        var currentSquare = cube.squares[face][row][col];

        if (face === 0) {
          var geometry = new THREE.BoxGeometry(SQUARE_SIZE/2, SQUARE_SIZE/2, 1);
          square = new THREE.Mesh(geometry,
                                  getSquareMaterial(currentSquare));
        } else {
          square = new THREE.Mesh(squareGeometry,
                                  getSquareMaterial(currentSquare));
        }

        var currentPosition = cube.mapping.position[face][row][col];
        square.position.set(currentPosition.x,
                            currentPosition.y,
                            currentPosition.z);
        square.rotation.set(currentRotation.x,
                            currentRotation.y,
                            currentRotation.z);

        squares.push(square);
      }
    }
  }
  return squares;
}

function getSquareIdByFaceRowCol(face, row, col) {
  return col + face * 9 + row * 3;
}

function getSquareMaterial(color) {
  return new THREE.MeshLambertMaterial({ color: color });
}

function getWebGLMapping() {
  var size = SQUARE_SIZE * 1.2;
  return {
    'position': [
      // face 0
      [[{ x:-size, y:size, z:0 }, { x:0, y:size, z:0 }, { x:size, y:size, z:0 }],
       [{ x:-size, y:0, z:0 }, { x:0, y:0, z:0 }, { x:size, y:0, z:0 }],
       [{ x:-size, y:-size, z:0 }, { x:0, y:-size, z:0 }, { x:size, y:-size, z:0 }]],
      // face 1
      [[{ x:-size*1.5, y:size, z:-size/2 }, { x:-size*1.5, y:0, z:-size/2 }, { x:-size*1.5, y:-size, z:-size/2 }],
       [{ x:-size*1.5, y:size, z:-size*1.5 }, { x:-size*1.5, y:0, z:-size*1.5 }, { x:-size*1.5, y:-size, z:-size*1.5 }],
       [{ x:-size*1.5, y:size, z:-size*2.5 }, { x:-size*1.5, y:0, z:-size*2.5 }, { x:-size*1.5, y:-size, z:-size*2.5 }]],
      // face 2
      [[{ x:-size, y:-size*1.5, z:-size/2 }, { x:0, y:-size*1.5, z:-size/2 }, { x:size, y:-size*1.5, z:-size/2 }],
       [{ x:-size, y:-size*1.5, z:-size*1.5 }, { x:0, y:-size*1.5, z:-size*1.5 }, { x:size, y:-size*1.5, z:-size*1.5 }],
       [{ x:-size, y:-size*1.5, z:-size*2.5 }, { x:0, y:-size*1.5, z:-size*2.5 }, { x:size, y:-size*1.5, z:-size*2.5 }]],
      // face 3
      [[{ x:size*1.5, y:-size, z:-size/2 }, { x:size*1.5, y:0, z:-size/2 }, { x:size*1.5, y:size, z:-size/2 }],
       [{ x:size*1.5, y:-size, z:-size*1.5 }, { x:size*1.5, y:0, z:-size*1.5 }, { x:size*1.5, y:size, z:-size*1.5 }],
       [{ x:size*1.5, y:-size, z:-size*2.5 }, { x:size*1.5, y:0, z:-size*2.5 }, { x:size*1.5, y:size, z:-size*2.5 }]],
      // face 4
      [[{ x:size, y:size*1.5, z:-size/2 }, { x:0, y:size*1.5, z:-size/2 }, { x:-size, y:size*1.5, z:-size/2 }],
       [{ x:size, y:size*1.5, z:-size*1.5 }, { x:0, y:size*1.5, z:-size*1.5 }, { x:-size, y:size*1.5, z:-size*1.5 }],
       [{ x:size, y:size*1.5, z:-size*2.5 }, { x:0, y:size*1.5, z:-size*2.5 }, { x:-size, y:size*1.5, z:-size*2.5 }]],
      // face 5
      [[{ x:-size, y:-size, z:-size*3 }, { x:0, y:-size, z:-size*3 }, { x:size, y:-size, z:-size*3 }],
       [{ x:-size, y:0, z:-size*3 }, { x:0, y:0, z:-size*3 }, { x:size, y:0, z:-size*3 }],
       [{ x:-size, y:size, z:-size*3 }, { x:0, y:size, z:-size*3 }, { x:size, y:size, z:-size*3 }]]
     ],
     'rotation': [
       { x:0, y:0, z:0 },
       { x:0, y:Math.PI/2, z:0 },
       { x:Math.PI/2, y:0, z:0 },
       { x:0, y:Math.PI/2, z:0 },
       { x:Math.PI/2, y:0, z:0 },
       { x:0, y:0, z:0 }
     ]
  }
}

window.onkeypress = function (event) {
  switch (event.key) {
    case 'w':
      cube.move(1, -1);
      draw();
      break;
    case 's':
      cube.move(1, 1);
      draw();
      break;
    case 'a':
      cube.move(2, -1);
      draw();
      break;
    case 'd':
      cube.move(2, 1);
      draw();
      break;
    case 'q':
      cube.move(0, -1);
      draw();
      break;
    case 'e':
      cube.move(0, 1);
      draw();
      break;
    case 'i':
      cube.move(3, 1);
      draw();
      break;
    case 'k':
      cube.move(3, -1);
      draw();
      break;
    case 'j':
      cube.move(4, 1);
      draw();
      break;
    case 'l':
      cube.move(4, -1);
      draw();
      break;
    case 'u':
      cube.move(5, 1);
      draw();
      break;
    case 'o':
      cube.move(5, -1);
      draw();
      break;
  }
}
