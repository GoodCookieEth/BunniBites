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
            debug: true  // Enable debug mode for easier troubleshooting
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
    console.log("Preload started");
    // Load images
    this.load.image('bunny', 'assets/rabbit.png');
    this.load.image('carrot', 'assets/carrot.png');
    this.load.image('poop', 'assets/poop.png');
    this.load.image('background', 'assets/matrix_background.jpg'); 

    // Error handling for asset loading
    this.load.on('filecomplete', function (fileKey) {
        console.log('File loaded:', fileKey);
    });
    this.load.on('loaderror', function (fileKey) {
        console.error('Error loading file:', fileKey);
    });
}

function create() {
    console.log("Create function started");

    // Add the background and ensure it is behind everything
    background = this.add.tileSprite(400, 300, 800, 600, 'background');
    background.setDepth(-1);  // Ensure background is behind other objects

    // Add a debug rectangle to test rendering
    let debugRect = this.add.rectangle(400, 300, 100, 100, 0xff0000);
    debugRect.setDepth(1);  // Ensure this is on top for visibility
    console.log("Debug rectangle added to the scene");

    // Create a simple circle to represent the player for testing
    player = this.add.circle(50, 50, 15, 0x00ff00);
    player.setDepth(2);  // Ensure player is above the background
    console.log("Player (circle) added to the scene at position (50, 50)");

    // Create carrots (just logging for now)
    carrots = this.physics.add.group({
        key: 'carrot',
        repeat: totalDots - 1,
        setXY: { x: 100, y: 100, stepX: 70, stepY: 50 },
        setScale: { x: 0.05, y: 0.05 }
    });
    carrots.setDepth(2);  // Ensure carrots are above the background
    carrots.children.iterate(function (carrot) {
        carrot.setVisible(true);  // Ensure all carrots are visible
    });
    console.log("Carrots added to the scene");

    // Create poop emojis (just logging for now)
    poopEmojis = this.physics.add.group({
        key: 'poop',
        repeat: 3,
        setXY: { x: Phaser.Math.Between(200, 600), y: Phaser.Math.Between(100, 500), stepX: 100 },
        setScale: { x: 0.1, y: 0.1 }
    });
    poopEmojis.setDepth(2);  // Ensure poop emojis are above the background
    poopEmojis.children.iterate(function (poop) {
        poop.setVisible(true);  // Ensure all poop emojis are visible
    });
    console.log("Poop emojis added to the scene");

    // Add overlap between player and carrots
    this.physics.add.overlap(player, carrots, collectCarrot, null, this);

    // Add collision between player and poop emojis (game over)
    this.physics.add.collider(player, poopEmojis, hitPoop, null, this);

    // Add collision between player and walls
    this.physics.add.collider(player, walls);

    // Input keys
    cursors = this.input.keyboard.createCursorKeys();

    // Score display
    scoreText = this.add.text(16, 16, 'Dots Collected: 0/' + totalDots, { fontSize: '32px', fill: '#FFF' });
    scoreText.setDepth(2);  // Ensure score is above the background

    console.log("Create function completed");
}

function update() {
    if (gameOver || victory) {
        return;
    }

    // Handle player movement
    if (cursors.left.isDown) {
        player.x -= 5;  // Simple movement update
    } else if (cursors.right.isDown) {
        player.x += 5;
    } else if (cursors.up.isDown) {
        player.y -= 5;
    } else if (cursors.down.isDown) {
        player.y += 5;
    }

    // Log player position for debugging
    console.log(`Player position: (${player.x}, ${player.y})`);

    // Move poop emojis (ghosts) randomly
    poopEmojis.children.iterate(function (poop) {
        if (Phaser.Math.Between(0, 100) < 5) {
            poop.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        }
    });
}

// Create a basic maze layout using Graphics
function createMaze(scene) {
    console.log("Creating maze walls");

    let graphics = scene.add.graphics({ fillStyle: { color: 0x00ff00 } });
    graphics.fillRect(375, 0, 50, 600);  // Vertical wall in the center
    graphics.fillRect(0, 0, 800, 50);    // Horizontal wall at the top
    graphics.fillRect(0, 550, 800, 50);  // Horizontal wall at the bottom

    // Convert graphics to static bodies for physics
    walls = scene.physics.add.staticGroup();
    
    let verticalWall = scene.physics.add.staticImage(400, 300).setSize(50, 600).setVisible(false);
    let topWall = scene.physics.add.staticImage(400, 25).setSize(800, 50).setVisible(false);
    let bottomWall = scene.physics.add.staticImage(400, 575).setSize(800, 50).setVisible(false);

    walls.add(verticalWall);
    walls.add(topWall);
    walls.add(bottomWall);

    console.log("Maze walls created and physics bodies added");
}

// Collecting carrots (dots)
function collectCarrot(player, carrot) {
    carrot.disableBody(true, true);
    dotsCollected++;
    scoreText.setText('Dots Collected: ' + dotsCollected + '/' + totalDots);

    if (dotsCollected === totalDots) {
        victory = true;
        this.physics.pause();
        this.add.text(400, 300, 'Victory!', { fontSize: '48px', fill: '#FFF' }).setOrigin(0.5);
        let nextMapButton = this.add.text(400, 400, 'Next Level', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
        nextMapButton.setInteractive();
        nextMapButton.on('pointerdown', () => nextMap());
    }
}

// Hitting poop emoji (ghost)
function hitPoop(player, poop) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;

    let restartButton = this.add.text(400, 300, 'Restart', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
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
    this.scene.restart();
    scoreText.setText('Dots Collected: 0/' + totalDots);
}
