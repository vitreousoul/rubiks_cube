var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = '#000000';
canvas.focus();

var cube = new Cube();
var cubeSize = 20;
drawCube();

// animate random moves cause it's fun
// setInterval(function () {
//   var randomFace = Math.floor(Math.random() * 6);
//   if (Math.random() < 0.5) {
//     cube.move(randomFace, -1);
//   } else {
//     cube.move(randomFace, 1);
//   }
//   drawCube();
// }, 1000);

window.onkeypress = function (event) {
  switch (event.key) {
    case 'w':
      cube.move(1, -1);
      drawCube();
      break;
    case 's':
      cube.move(1, 1);
      drawCube();
      break;
    case 'a':
      cube.move(5, -1);
      drawCube();
      break;
    case 'd':
      cube.move(5, 1);
      drawCube();
      break;
    case 'q':
      cube.move(2, -1);
      drawCube();
      break;
    case 'e':
      cube.move(2, 1);
      drawCube();
      break;
    case 'i':
      cube.move(3, 1);
      drawCube();
      break;
    case 'k':
      cube.move(3, -1);
      drawCube();
      break;
    case 'j':
      cube.move(0, 1);
      drawCube();
      break;
    case 'l':
      cube.move(0, -1);
      drawCube();
      break;
    case 'u':
      cube.move(4, -1);
      drawCube();
      break;
    case 'o':
      cube.move(4, 1);
      drawCube();
      break;

  }
}

function drawCube() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var mappedRect = {};

  for (var face = 0; face < 6; face++) {
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        context.fillStyle = cube.squares[face][row][col];

        mappedRect.x = cube.mapping[face][row][col][0];
        mappedRect.y = cube.mapping[face][row][col][1];

        context.fillRect(mappedRect.x * cubeSize,
                         mappedRect.y * cubeSize,
                         cubeSize,
                         cubeSize);
      };
    };
  };
}

function getWebGLMapping() {
  return [
    // face 0
    [[[3, 0], [4, 0], [5, 0]],
     [[3, 1], [4, 1], [5, 1]],
     [[3, 2], [4, 2], [5, 2]]],
    // face 1
    [[[0, 3], [1, 3], [2, 3]],
     [[0, 4], [1, 4], [2, 4]],
     [[0, 5], [1, 5], [2, 5]]],
    // face 2
    [[[3, 3], [4, 3], [5, 3]],
     [[3, 4], [4, 4], [5, 4]],
     [[3, 5], [4, 5], [5, 5]]],
    // face 3
    [[[6, 3], [7, 3], [8, 3]],
     [[6, 4], [7, 4], [8, 4]],
     [[6, 5], [7, 5], [8, 5]]],
    // face 4
    [[[9, 3], [10, 3], [11, 3]],
     [[9, 4], [10, 4], [11, 4]],
     [[9, 5], [10, 5], [11, 5]]],
    // face 5
    [[[3, 6], [4, 6], [5, 6]],
     [[3, 7], [4, 7], [5, 7]],
     [[3, 8], [4, 8], [5, 8]]]
  ]
}
