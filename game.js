let player;
let cursors;
let carrots;
let poopEmojis;
let walls;
let score = 0;
let scoreText;
let gameOver = false;
let victory = false;
let background;
let totalDots = 20;
let dotsCollected = 0;
let currentLevel = 1;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load images for bunny, carrots, poop emojis, and background
    this.load.image('bunny', 'assets/rabbit.png');
    this.load.image('carrot', 'assets/carrot.png');
    this.load.image('poop', 'assets/poop.png');
    this.load.image('background', 'assets/matrix_background.jpg'); // Updated to .jpg
}

function create() {
    // Add the background
    background = this.add.tileSprite(400, 300, 800, 600, 'background');

    // Create maze walls using Graphics
    walls = this.physics.add.staticGroup();
    createMaze(this);

    // Create the player (bunny)
    player = this.physics.add.sprite(50, 50, 'bunny').setScale(0.2);
    player.setCollideWorldBounds(true);

    // Create group of carrots (dots)
    carrots = this.physics.add.group({
        key: 'carrot',
        repeat: totalDots - 1,  // Total dots to collect
        setXY: { x: Phaser.Math.Between(100, 700), y: Phaser.Math.Between(100, 500), stepX: 70, stepY: 50 },
        setScale: { x: 0.05, y: 0.05 }
    });

    // Create poop emojis (ghosts)
    poopEmojis = this.physics.add.group({
        key: 'poop',
        repeat: 3,
        setXY: { x: Phaser.Math.Between(200, 600), y: Phaser.Math.Between(100, 500), stepX: 100 },
        setScale: { x: 0.1, y: 0.1 }
    });

    // Add overlap between bunny and carrots
    this.physics.add.overlap(player, carrots, collectCarrot, null, this);

    // Add collision between player and poop emojis (game over)
    this.physics.add.collider(player, poopEmojis, hitPoop, null, this);

    // Add collision between player and walls
    this.physics.add.collider(player, walls);

    // Add collision between poop emojis and walls
    this.physics.add.collider(poopEmojis, walls);

    // Input keys
    cursors = this.input.keyboard.createCursorKeys();

    // Score display
    scoreText = this.add.text(16, 16, 'Dots Collected: 0/' + totalDots, { fontSize: '32px', fill: '#FFF' });
}

function update() {
    if (gameOver || victory) {
        return;
    }

    // Handle player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    } else {
        player.setVelocity(0);
    }

    // Move poop emojis (ghosts) randomly
    poopEmojis.children.iterate(function (poop) {
        if (Phaser.Math.Between(0, 100) < 5) {
            poop.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        }
    });
}

// Create a basic maze layout using Graphics instead of rectangles
function createMaze(scene) {
    let graphics = scene.add.graphics({ fillStyle: { color: 0x00ff00 } });

    // Vertical wall in the center
    let verticalWall = scene.add.rectangle(400, 300, 50, 600);
    scene.physics.add.existing(verticalWall, true);
    graphics.fillRectShape(verticalWall);

    // Horizontal walls at top and bottom
    let topWall = scene.add.rectangle(400, 50, 800, 50);
    let bottomWall = scene.add.rectangle(400, 550, 800, 50);
    scene.physics.add.existing(topWall, true);
    scene.physics.add.existing(bottomWall, true);
    graphics.fillRectShape(topWall);
    graphics.fillRectShape(bottomWall);

    // Add the walls to the static group
    walls.add(verticalWall);
    walls.add(topWall);
    walls.add(bottomWall);
}

// Collecting carrots (dots)
function collectCarrot(player, carrot) {
    carrot.disableBody(true, true); // Remove the carrot (dot)
    dotsCollected++;  // Increase dots collected count
    scoreText.setText('Dots Collected: ' + dotsCollected + '/' + totalDots);

    // Check if all dots are collected
    if (dotsCollected === totalDots) {
        victory = true;
        this.physics.pause(); // Stop the game
        this.add.text(400, 300, 'TEST TEST TEST', { fontSize: '48px', fill: '#FFF' }).setOrigin(0.5).setDepth(1);

        // Add button to move to the next map
        let nextMapButton = this.add.text(400, 400, 'Move to Next Map', { fontSize: '32px', fill: '#FFF', backgroundColor: '#000' }).setOrigin(0.5).setDepth(1);
        nextMapButton.setInteractive();
        nextMapButton.on('pointerdown', () => {
            nextMap();
        });
    }
}

// Hitting poop emoji (ghost)
function hitPoop(player, poop) {
    this.physics.pause(); // Stop the game
    player.setTint(0xff0000); // Bunny turns red
    gameOver = true;

    // Add Restart button
    let restartButton = this.add.text(400, 300, 'Restart', { fontSize: '32px', fill: '#FFF', backgroundColor: '#000' }).setOrigin(0.5).setDepth(1);
    restartButton.setInteractive();
    restartButton.on('pointerdown', () => {
        this.scene.restart();
        gameOver = false;
        dotsCollected = 0;
    });
}

// Move to the next map (next level)
function nextMap() {
    currentLevel++;
    dotsCollected = 0;
    this.scene.restart();  // Restart with a new map
    scoreText.setText('Dots Collected: 0/' + totalDots);
}
