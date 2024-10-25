const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: document.body, // Attach canvas to the body directly
    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
    scale: {
        mode: Phaser.Scale.NONE, // Disable automatic scaling
        autoCenter: Phaser.Scale.CENTER_BOTH // Center the game on the screen
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload() {
    console.log("Preloading assets...");

    // Load assets and add logging
    this.load.image('bunny', 'assets/rabbit.png');
    this.load.image('background', 'assets/matrix_background.jpg');
    this.load.image('carrot', 'assets/carrot.png');
    this.load.image('poop', 'assets/poop.png');

    this.load.on('filecomplete', function (fileKey) {
        console.log(`File loaded: ${fileKey}`);
    });
    
    this.load.on('loaderror', function (fileKey) {
        console.error(`Error loading file: ${fileKey}`);
    });
}

function create() {
    console.log("Create function started");

    // Add background first to avoid overlapping issues
    let background = this.add.image(400, 300, 'background');
    background.setDepth(-1);  // Ensure background is behind everything

    // Add the bunny sprite (player)
    let player = this.add.sprite(100, 100, 'bunny');
    player.setScale(0.2);

    // Add a carrot
    let carrot = this.add.image(200, 200, 'carrot');
    carrot.setScale(0.1);

    // Add a poop emoji
    let poop = this.add.image(300, 300, 'poop');
    poop.setScale(0.1);

    console.log("Assets added to the scene");
}
