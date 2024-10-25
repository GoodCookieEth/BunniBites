const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: document.body, // Attach canvas to the body directly
    backgroundColor: 'rgba(0, 0, 0, 0)', // Ensure canvas is transparent
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
        create: create
    }
};

const game = new Phaser.Game(config);

function create() {
    // Log to confirm the create function is being called
    console.log("Create function started");

    // Add a simple shape (rectangle) to verify rendering
    let debugRect = this.add.rectangle(400, 300, 150, 100, 0xff0000); // Red rectangle
    debugRect.setDepth(1);  // Ensure this is rendered on top of everything

    // Log to confirm that the rectangle was added
    console.log("Debug rectangle added at (400, 300)");
}
