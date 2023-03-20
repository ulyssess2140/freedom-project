this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown)
    {
        this.player.body.setVelocityX(-80);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.setVelocityX(80);
    }

    // Vertical movement
    if (this.cursors.up.isDown)
    {
        this.player.body.setVelocityY(-80);
    }
    else if (this.cursors.down.isDown)
    {
        this.player.body.setVelocityY(80);
    }