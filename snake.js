/*instantiate snake
var snake = [{ top: 0, left: 0},{ top:0, left: 1 }, { top:0, left: 2 }, { top:0, left: 3 }, { top:0, left: 4 }]

var drawableSnake = { color: "green", pixels: snake };
CHUNK.draw([drawableSnake]);

var square = [ {top: 7, left: 11},{top: 7, left: 12}, {top: 6, left: 11}, {top: 6, left: 12} ]
var drawableSquare = {color: "red", pixels: square};
CHUNK.draw([drawableSquare]);
*/

var draw = function(snakeToDraw, apple) {
    var drawableSnake = {color:"green", pixels: snakeToDraw };
    var drawableApple = { color: "red", pixels: [apple] };
    var drawableObjects = [drawableSnake, drawableApple];
    CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) {
    if (segment.direction == "down") {
        return { top: segment.top+1, left:segment.left }
    } else if (segment.direction == "up") {
        return { top: segment.top-1, left:segment.left }
    } else if (segment.direction == "right") {
        return { top: segment.top, left:segment.left + 1 }
    } else if (segment.direction == "left") {
        return { top: segment.top, left:segment.left - 1 }
    }
    return segment;
}


var segmentFurtherForwardThan = function(index, snake) {
    if (snake[index -1] === undefined) {
        return snake[index];
    } else {
        return snake[index-1];
    }
}


var moveSnake = function(snake) {
    return snake.map(function(oldSegment, segmentIndex) {
        var newSegment = moveSegment(oldSegment); 
        newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
        return newSegment;
    });
}

var growSnake = function(snake) {
    var tipOfTailIndex = snake.length-1;
    var tipOfTail = snake[snake.length-1];
    snake.push( {top: tipOfTail.top, left: tipOfTail.left });
    return snake;
}

var ate = function(snake, otherThing) {
    var head = snake[0];
    return CHUNK.detectCollisionBetween([head], otherThing);
}


var advanceGame = function() {

    var newSnake = moveSnake(snake);
    if (ate(newSnake, [apple])) { 
        newSnake = growSnake(newSnake);
        apple = CHUNK.randomLocation();
    }
    if (ate(newSnake, snake)) { //mutually exclusive
        CHUNK.endGame();
        CHUNK.flashMessage("You ate yourself. WHY.");
    }
    else if (ate(newSnake, CHUNK.gameBoundaries())) { //mutually exclusive
        CHUNK.endGame();
        CHUNK.flashMessage("Whoops! You hit a wall!");
    } 
    else {
    snake = newSnake;
    draw(snake, apple);
    }
    
}

var changeDirection = function(direction) {
    snake[0].direction = direction;
}


var snake = [ {top:2, left:0, direction: "down"}, {top:1, left:0, direction: "down"}, {top:0, left:0, direction:"down"} ];

var apple = { top:8, left:10};


CHUNK.executeNTimesPerSecond(advanceGame, 1);
CHUNK.onArrowKey(changeDirection);


