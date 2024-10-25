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

    // Scale the background to fit the full canvas size (800x600)
    let background = this.add.image(400, 300, 'background');
    background.setDisplaySize(800, 600); // Scale background to fit the canvas
    background.setDepth(-1);  // Ensure background is behind everything

    // Add the bunny sprite (player)
    let player = this.add.sprite(100, 100, 'bunny');
    player.setScale(0.2);
    player.setDepth(1); // Ensure bunny is above the background

    // Add a carrot
    let carrot = this.add.image(200, 200, 'carrot');
    carrot.setScale(0.1);
    carrot.setDepth(1); // Ensure carrot is above the background

    // Add a poop emoji
    let poop = this.add.image(300, 300, 'poop');
    poop.setScale(0.1);
    poop.setDepth(1); // Ensure poop is above the background

    console.log("Assets added to the scene");
}
