const gridSize = 500;
const cellsInRow = 25;
const cellSize = gridSize / cellsInRow;
let gameRunning = false;
let speed = 1000;

randomizeGrid = () => {
    const grid = new Array(cellsInRow);

    for (let i = 0; i < grid.length; i++){
        grid[i] = new Array(cellsInRow);
        for (let j = 0; j < grid.length; j++){
            grid[i][j] = Math.floor(Math.random() *2);
        }
    }

    return grid;
}


getNeighbours = (grid, x, y) => {

    let count = 0;
    const rowCount = grid.length;
    const colCount = grid[0].length;

    for (let i = -1; i < 2; i++){
        for (let j = -1; j < 2; j++){
            const row = (x + i + rowCount) % rowCount;
            const col = (y + j + colCount) % colCount;
            count += grid[row][col];
        }
    }

    count -= grid[x][y];
    return count;
}




drawGrid = (ctx, grid) => {
    ctx.strokeStyle = '#999';
    for (let i = 0; i < grid.length; i++){
        for (let j = 0; j < grid.length; j++){
            
            const value = grid[i][j];

            if (value === 1){
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }

            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}


getNextGeneration = (grid) => {
    const nextGrid = new Array(grid.length);
    
    for (let i = 0; i < grid.length; i++){
        nextGrid[i] = new Array(grid.length);
        
        for (let j = 0; j < grid.length; j++){
            const currentValue = grid[i][j];
            const neighbours = getNeighbours(grid, i, j);

            if ((currentValue === 0) && (neighbours === 3)){
                nextGrid[i][j] = 1;
            } else if ((currentValue === 1) && (neighbours < 2 || neighbours > 3 )) {
                nextGrid[i][j] = 0;
            } else {
                nextGrid[i][j] = currentValue;
            }
        }

    }

    return nextGrid;
}


generation = (ctx, grid) => {
    ctx.clearRect(0, 0, gridSize, gridSize);
    drawGrid(ctx, grid);
    const nextGenGrid = getNextGeneration(grid);

    if (gameRunning === false){
        setTimeout(() => {
            generation(ctx, grid);
        }, speed);
    } else {
        setTimeout(() => {
            addIteration();
            requestAnimationFrame(() => generation(ctx, nextGenGrid));
        }, speed);   
    }
     
    
}



let startButton = document.getElementById('start-button');

startButton.addEventListener('click', function(){
    gameRunning = !gameRunning;
    startButton.innerHTML = gameRunning ? 'Stop' : 'Start';
});


addEventListener('click', function(e){
    // update the speed of the generations, depending on which button was clicked
    const newSpeed = e.target.id;

    if (document.getElementById(newSpeed) === startButton){
        return;
    }

    switch(newSpeed){
        case 'slow':
            speed = 1000;
            document.getElementById(newSpeed).classList.add('selected');
            document.getElementById('medium').classList.remove('selected');
            document.getElementById('fast').classList.remove('selected');
            break;
        case 'medium':
            speed = 100;
            document.getElementById(newSpeed).classList.add('selected');
            document.getElementById('slow').classList.remove('selected');
            document.getElementById('fast').classList.remove('selected');
            break;
        case 'fast':
            speed = 10;
            document.getElementById(newSpeed).classList.add('selected');
            document.getElementById('slow').classList.remove('selected');
            document.getElementById('medium').classList.remove('selected');
            break;
        default:
            break;
    }

});

document.getElementById('reset').addEventListener('click', function(){
    location.reload();    
});


// every time a new generation is created, increase the displayed number by one
addIteration = () => {
    document.getElementById('generation').innerHTML = parseInt((document.getElementById('generation').innerHTML))+1;
}

resize = () => {
    const board = document.getElementById('board');
    const ctx = board.getContext('2d');
    const grid = randomizeGrid();
    generation(ctx, grid);
}

window.onload = () => {
    const board = document.getElementById('board');
    const ctx = board.getContext('2d');
    const grid = randomizeGrid();
    generation(ctx, grid);
}
