var map = {
    cols: 12,
    rows: 12,
    tsize: 42,
    tiles: [
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 3, 3, 1, 3, 1, 3,
        3, 1, 3, 3, 3, 1, 3, 1, 1, 3, 1, 3,
        3, 1, 1, 1, 3, 1, 3, 1, 3, 3, 1, 3,
        3, 1, 1, 1, 3, 1, 3, 1, 3, 1, 1, 3,
        3, 1, 1, 1, 3, 1, 3, 1, 3, 1, 1, 3,
        3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 3,
        3, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ],
    getTile: function (col, row) {
        return this.tiles[row * map.cols + col];
    }
};

function Hero(map, x, y) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tsize;
    this.height = map.tsize;

    this.image = Loader.getImage('hero');
}

Hero.SPEED = 256; // pixels per second

Hero.prototype.move = function (delta, dirx, diry) {
    // move hero
    this.x += dirx * Hero.SPEED * delta;
    this.y += diry * Hero.SPEED * delta;

    // check if we walked into a non-walkable tile
    // this._collide(dirx, diry);

    // clamp values
    var maxX = this.map.cols * this.map.tsize;
    var maxY = this.map.rows * this.map.tsize;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
};

Game.load = function () {
    return [
        Loader.loadImage('tiles', '../assets/tiles.png'),
        Loader.loadImage('hero', '../assets/character.png')
    ];
};

Game.init = function () {
    Keyboard.listenForEvents(
        [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
    this.tileAtlas = Loader.getImage('tiles');
    this.hero = new Hero(map, 126, 126);
};

Game.update = function (delta) {
    console.log('updating');
    // handle hero movement with arrow keys
    var dirx = 0;
    var diry = 0;
    if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
    else if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
    else if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
    else if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }
    console.log(dirx, diry);
    this.hero.move(delta, dirx, diry);
};

Game._drawGrid = function () {
    var width = map.cols * map.tsize;
    var height = map.rows * map.tsize;
    var x, y;
    for (var r = 0; r < map.rows; r++) {
        x = - 0;
        y = r * map.tsize;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
    }
    for (var c = 0; c < map.cols; c++) {
        x = c * map.tsize;
        y = - 0;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
    }
};

Game.render = function () {
    for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(c, r);
            if (tile !== 0) { // 0 => empty tile
                this.ctx.drawImage(
                    this.tileAtlas, // image
                    (tile - 1) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    c * map.tsize,  // target x
                    r * map.tsize, // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
            }
        }
    }

    this.ctx.drawImage(
        this.hero.image,
        this.hero.x - this.hero.width,
        this.hero.y - this.hero.height,
        map.tsize,
        map.tsize
    );

    this._drawGrid();
};
