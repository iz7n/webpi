const ip = 'nolimits.ga';
const port = 3499;
const socket = io.connect(ip + ':' + port);

const users = [];
const ids = () => users.map(u => u.id);

socket.on('delUser', id => {
    let idx = ids().indexOf(id);
    users.splice(idx, 1);
});

socket.on('mouse', user => {
    if (!ids().includes(user.id))
        users.push(user);

    let u = users[ids().indexOf(user.id)];
    u.x = user.x;
    u.y = user.y;
    let c = user.color;
    u.color = color(c.r, c.g, c.b);
});

let col;

let grid;
let cols;
let rows;
let w = 40;

let totalBees = 20;

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function setup() {
    createCanvas(401, 401);

    col = color(random(100, 255), random(100, 255), random(100, 255));

    cols = floor(width / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j, w);
        }
    }

    let options = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            options.push([i, j]);
        }
    }

    for (let n = 0; n < totalBees; n++) {
        let index = floor(random(options.length));
        let choice = options[index];
        let i = choice[0];
        let j = choice[1];

        options.splice(index, 1);
        grid[i][j].bee = true;
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].countBees();
        }
    }
}

function gameOver() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
        }
    }
}

function mousePressed() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                grid[i][j].reveal();

                if (grid[i][j].bee)
                    gameOver();
            }
        }
    }
}

function draw() {
    background(255);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    socket.emit('mouse', {
        x: mouseX,
        y: mouseY,
        color: {
            r: red(col),
            g: green(col),
            b: blue(col)
        }
    });

    stroke(0);
    users.forEach(u => {
        fill(u.color);
        ellipse(u.x, u.y, 15);
    });

    fill(col);
    ellipse(mouseX, mouseY, 15);
}