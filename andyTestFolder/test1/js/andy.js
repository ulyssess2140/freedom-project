var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        // map tiles
        this.load.image('tiles', 'assets/map/spritesheet.png');

        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');

        // our two characters
        // this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('player','assets/robePlayer.png',{ frameWidth: 32, frameHeight: 32.1 });
    },

    create: function ()
    {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
});

var heathbar =[]

heathbar.push(src='assets/heath/0Hit_healthbar.png');
// let heath1hit = this.add.image(75, 25, 'heath1hit');
heathbar.push(src='assets/heath/1Hit_healthbar.png');
// let heath2hit = this.add.image(75, 25, 'heath2hit');
heathbar.push(src='assets/heath/2Hit_healthbar.png');
// let heath3hit = this.add.image(75, 25, 'heath3hit');
heathbar.push(src='assets/heath/3Hit_healthbar.png');
// let heath4hit = this.add.image(75, 25, 'heath4hit');
heathbar.push(src='assets/heath/4Hit_healthbar.png');
// let heath5hit = this.add.image(75, 25, 'heath5hit');
heathbar.push(src='assets/heath/5Hit_healthbar.png');
// let heath6hit = this.add.image(75, 25, 'heath6hit');
heathbar.push(src='assets/heath/6Hit_healthbar.png');
// let heath7hit = this.add.image(75, 25, 'heath7hit');
heathbar.push(src='assets/heath/7Hit_healthbar.png');
// let heath8hit = this.add.image(75, 25, 'heath8hit');
heathbar.push(src='assets/heath/8Hit_healthbar.png');
var playerHit = 0
var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function ()
    {
        // this.load.image('tiles','./assets/RPG Nature Tileset.png');
        // this.load.tilemapTiledJSON('map1','./assets/map1.json');
        this.load.image('sky', 'assets/backupPng/sky.png');
        // this.load.image('ground', 'assets/platform.png');
        // this.load.image('star', 'assets/orb2.png');
        // this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('player','assets/robePlayer.png',{ frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy','assets/enemy.png',{ frameWidth: 32, frameHeight: 32 });
        this.load.image('heathempty','assets/heath/empty2.png');
        this.load.image('heath0hit',heathbar[0]);
        this.load.image('heath1hit',heathbar[1]);
        this.load.image('heath2hit',heathbar[2]);
        this.load.image('heath3hit',heathbar[3]);
        this.load.image('heath4hit',heathbar[4]);
        this.load.image('heath5hit',heathbar[5]);
        this.load.image('heath6hit',heathbar[6]);
        this.load.image('heath7hit',heathbar[7]);
        this.load.image('heath8hit',heathbar[8]);
        console.log(heathbar[0])
    },

    create: function ()
    {
        // create the map
        var map = this.make.tilemap({ key: 'map' });

        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('spritesheet', 'tiles');

        // creating the layers
        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);

        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 100, 'player', 6);
        this.player.setScale(0.75);

        // enemy assets
        const enemies = this.physics.add.group();
        enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'enemy')


        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;
        // user input
        this.cursors = this.input.keyboard.createCursorKeys();

        //heathbar
        const container0 = this.add.container(0, 0);
        container0.add(this.add.image(75, 0, 'heathempty'));
        container0.setScrollFactor(0);


        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 8,0,1, 9 ]}),
            frameRate: 1.5,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {frames: [ 16,17,18,19]}),
            frameRate: 0.5,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {frames: [ 16,17,18,19]}),
            frameRate: 0.5,
            repeat: -1
        });
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('player', {frames: [65,66,67,68,69,70]}),
            frameRate: 0.5,
            repeat: -1

        })

        // where the enemies will be
        // this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });


        for(var i = 0; i < 20; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            enemies.create(x, y, 'enemy');
            this.enemy = this.physics.add.sprite(x, y, 'enemy');
        }
        // add collider
        // this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
        this.physics.add.overlap(this.player, enemies, this.onMeetEnemy, false, this);
        this.physics.add.overlap(this.player, this.enemy, this.onMeetEnemy, false, this);

        // this.physics.moveToObject(enemies, this.player, 100 )

    },
    onMeetEnemy: function(player, zone) {
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        playerHit+=1
        this.cameras.main.flash(500);
    },
    enemyFollows: function () {
        this.physics.moveToObject(this.enemy, this.player, 80);
    },
    update: function (time, delta)
    {
    this.enemyFollows();
    //    this.controls.update(delta);
    keys = this.input.keyboard.addKeys("W,A,S,D,N");
    this.player.body.setVelocity(0);
    if (keys.A.isDown) {
        this.player.body.setVelocityX(-80) // move left
        this.player.flipX = true;
    } else if (keys.D.isDown) {
        this.player.body.setVelocityX(80); // move right
        this.player.flipX = false;
    }
    if (keys.W.isDown) {
        this.player.body.setVelocityY(-80); // move up
    } else if (keys.S.isDown) {
        this.player.body.setVelocityY(80); // move down
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (keys.A.isDown)
    {
        this.player.anims.play('left', true);
        this.player.flipX = true;
    }
    else if (keys.D.isDown)
    {
        this.player.anims.play('right', true);
        this.player.flipX = false;
    }
    else
    {
        this.player.anims.play('idle', true)
    }
    //newheath system
    const container0 = this.add.container(0, 0);
    container0.add(this.add.image(75, 0, 'heathempty'));
    container0.setScrollFactor(0);
    let heath0hit = this.add.image(75, 12.5, 'heath0hit');
    heath0hit.visible = false;
    heath0hit.setScrollFactor(0);

    testheal = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);

    if (Phaser.Input.Keyboard.JustDown (testheal)){
        playerHit = 0
    }
    console.log(playerHit)
    if (playerHit == 0){
        heath0hit.visible = true;
        heath0hit.setScrollFactor(0);
    }
    else if (playerHit == 1){
        heath0hit.visible = false;
        heath = this.add.image(75, 0, 'heathempty');
        let heath1hit = this.add.image(75, 12.5, 'heath1hit');
        heath1hit.setScrollFactor(0);
        heath.setScrollFactor(0);
    }
    else if (playerHit == 2){
        heath = this.add.image(75, 0, 'heathempty');
        let heath2hit = this.add.image(75, 12.5, 'heath2hit');
        heath2hit.setScrollFactor(0);
        heath.setScrollFactor(0);
    }
    else if (playerHit == 3){
        heath = this.add.image(75, 0, 'heathempty');
        let heath3hit = this.add.image(75, 12.5, 'heath3hit');
        heath3hit.setScrollFactor(0);
        heath.setScrollFactor(0);
    }
    else if (playerHit == 4){
        heath = this.add.image(75, 0, 'heathempty');
        let heath4hit = this.add.image(75, 12.5, 'heath4hit');
        heath4hit.setScrollFactor(0);
        heath.setScrollFactor(0);
    }
    else if (playerHit == 5){
        heath = this.add.image(75, 0, 'heathempty');
        let heath5hit = this.add.image(75, 12.5, 'heath5hit');
        heath5hit.setScrollFactor(0);
        heath.setScrollFactor(0);
    }
    else if (playerHit == 6){
        heath = this.add.image(75, 0, 'heathempty');
        let heath6hit = this.add.image(75, 12.5, 'heath6hit');
        heath6hit.setScrollFactor(0);
        heath.setScrollFactor(0);
    }
    else if (playerHit == 7){
        heath = this.add.image(75, 0, 'heathempty');
        let heath7hit = this.add.image(75, 12.5, 'heath7hit');
        heath7hit.setScrollFactor(0);
        heath.setScrollFactor(0);
    }
    else if (playerHit == 8){
        heath = this.add.image(75, 0, 'heathempty');
        let heath8hit = this.add.image(75, 12.5, 'heath8hit');
        heath8hit.setScrollFactor(0);
        heath.setScrollFactor(0);
    }
    else if (playerHit == 9){
        heath0hit.visible = false;
        heath = this.add.image(75, 0, 'heathempty');
        heath.setScrollFactor(0);
    }
    }

});
var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
var game = new Phaser.Game(config);