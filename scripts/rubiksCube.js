function Cube(data) {
  this.init(data);
}

Cube.prototype.init = function (data) {
  this.loadData(data);
};

Cube.prototype.loadData = function (data) {
  this.squares = this.getNewSquares();
  this.mapping = this.createMapping(data);
};

Cube.prototype.move = function (faceIndex, direction) {
  this.rotateFace(faceIndex, direction);
  this.rotateRing(faceIndex, direction);
};

Cube.prototype.createMapping = function (data) {
  // this will be used to map square data to <canvas>
  // currently incapable of drawing non-rectangular polygons
  if (data !== undefined) {
    // TODO: check for valid data
    return data;
  } else {
    // use standard mapping
    return this.getStandardMapping();
  };
};

Cube.prototype.getStandardMapping = function () {
  /*
     0  1  2  3  4  5  6  7  8  9  10 11
  0           0  0  0
  1           0  0  0
  2           0  0  0
  3  1  1  1  2  2  2  3  3  3  4  4  4
  4  1  1  1  2  2  2  3  3  3  4  4  4
  5  1  1  1  2  2  2  3  3  3  4  4  4
  6           5  5  5
  7           5  5  5
  8           5  5  5
  */
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
};

Cube.prototype.rotateFace = function (faceIndex, direction) {
  var corners = [[faceIndex, 0, 0], [faceIndex, 2, 0],
                 [faceIndex, 2, 2], [faceIndex, 0, 2]];
  var edges = [[faceIndex, 1, 0], [faceIndex, 2, 1],
               [faceIndex, 1, 2], [faceIndex, 0, 1]];
  this.shiftSquares(corners, direction);
  this.shiftSquares(edges, direction);
};

Cube.prototype.rotateRing = function (faceIndex, direction) {
  var ringVectors = this.getRingVectors(faceIndex);
  for (var i = 0; i < ringVectors.length; i++) {
    this.shiftSquares(ringVectors[i], direction);
  }
};

Cube.prototype.shiftSquares = function (squares, direction) {
  if (direction === 1) {
    // [0, 1, 2, 3] -> [1, 2, 3, 0]
    var firstValue = this.getSquareValue(
                       squares[0][0],
                       squares[0][1],
                       squares[0][2]);
    for (var i = 0; i < squares.length; i++) {
      if (i === squares.length - 1) {
        this.setSquareValue(squares[i][0],
                            squares[i][1],
                            squares[i][2],
                            firstValue);
      } else {
        var squareValue = this.getSquareValue(
                            squares[i+1][0],
                            squares[i+1][1],
                            squares[i+1][2]);

        this.setSquareValue(squares[i][0],
                            squares[i][1],
                            squares[i][2],
                            squareValue);
      }
    }
  } else if (direction === -1) {
    // [0, 1, 2, 3] -> [3, 0, 1, 2]
    var lastValue = this.getSquareValue(
                      squares[squares.length - 1][0],
                      squares[squares.length - 1][1],
                      squares[squares.length - 1][2]);

    for (var i = squares.length - 1; i >=0 ; i--) {
      if (i === 0) {
        this.setSquareValue(squares[i][0],
                            squares[i][1],
                            squares[i][2],
                            lastValue);
      } else {
        var squareValue = this.getSquareValue(
                            squares[i-1][0],
                            squares[i-1][1],
                            squares[i-1][2]);

        this.setSquareValue(squares[i][0],
                            squares[i][1],
                            squares[i][2],
                            squareValue);
      }
    }
  }
};

Cube.prototype.getRingVectors = function (faceIndex) {
  // get all squares that share an edge with the specified face
  // this does not return squares that lie ON the face
  // these will be fed into shiftSquares to make moves
  var rings = [
    // face 0
    [[ [1, 0, 0], [2, 0, 0], [3, 0, 0], [4, 0, 0] ],
     [ [1, 0, 1], [2, 0, 1], [3, 0, 1], [4, 0, 1] ],
     [ [1, 0, 2], [2, 0, 2], [3, 0, 2], [4, 0, 2] ]],
    // face 1
    [[ [0, 0, 0], [4, 2, 2], [5, 0, 0], [2, 0, 0] ],
     [ [0, 1, 0], [4, 1, 2], [5, 1, 0], [2, 1, 0] ],
     [ [0, 2, 0], [4, 0, 2], [5, 2, 0], [2, 2, 0] ]],
    // face 2
    [[ [0, 2, 0], [1, 2, 2], [5, 0, 2], [3, 0, 0] ],
     [ [0, 2, 1], [1, 1, 2], [5, 0, 1], [3, 1, 0] ],
     [ [0, 2, 2], [1, 0, 2], [5, 0, 0], [3, 2, 0] ]],
    // face 3
    [[ [0, 0, 2], [2, 0, 2], [5, 0, 2], [4, 2, 0] ],
     [ [0, 1, 2], [2, 1, 2], [5, 1, 2], [4, 1, 0] ],
     [ [0, 2, 2], [2, 2, 2], [5, 2, 2], [4, 0, 0] ]],
    // face 4
    [[ [3, 0, 2], [5, 2, 2], [1, 2, 0], [0, 0, 0] ],
     [ [3, 1, 2], [5, 2, 1], [1, 1, 0], [0, 0, 1] ],
     [ [3, 2, 2], [5, 2, 0], [1, 0, 0], [0, 0, 2] ]],
    // face 5
    [[ [1, 2, 0], [4, 2, 0], [3, 2, 0], [2, 2, 0] ],
     [ [1, 2, 1], [4, 2, 1], [3, 2, 1], [2, 2, 1] ],
     [ [1, 2, 2], [4, 2, 2], [3, 2, 2], [2, 2, 2] ]],
  ];
  return rings[faceIndex];
};

Cube.prototype.getSquareValue = function (face, row, col) {
  return this.squares[face][row][col];
};

Cube.prototype.getNewSquares = function () {
  // create 3d array [face][row][col]
  var colors = ['white', 'red', 'blue', 'orange', 'green', 'yellow'];
  var squares = [];

  for (var face = 0; face < 6; face++) {
    squares.push([]);
    for (var row = 0; row < 3; row++) {
      squares[face].push([]);
      for (var col = 0; col < 3; col++) {
        squares[face][row].push([]);
        squares[face][row][col] = colors[face];
        // squares[face][row][col] = 'rgb(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ')';
      }
    }
  };
  return squares;
};

Cube.prototype.setSquareValue = function (face, row, col, squareValue) {
  this.squares[face][row][col] = squareValue;
};
