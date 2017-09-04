/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    private tune:ITune;

    create() : void {
        // Stretched background
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","background");
        bgr.width = this.game.width;bgr.height = this.game.height;

        var music:any = this.game.cache.getJSON("music")
        console.log(music);
        this.tune = new Tune(music);
    }

    destroy() : void {
    }

    update() : void {
    }
}    
