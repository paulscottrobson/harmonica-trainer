/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    private tune:ITune;
    private guiHarmonica:IHarmonica;

    create() : void {
        // Stretched background
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","background");
        bgr.width = this.game.width;bgr.height = this.game.height;
        // Load music from JSON
        var music:any = this.game.cache.getJSON("music")
        this.tune = new Tune(music);
        this.createHarmonica();

    }

    destroy() : void {
        this.tune = null;this.guiHarmonica = null;
    }

    update() : void {
    }

    /**
     * Create the harmonica graphic.
     * 
     * @private
     * @memberof MainState
     */
    private createHarmonica() : void {
        var hSize:number = this.tune.getHoleCount();
        var holeSize:number = Math.floor(this.game.width * 3 / 4 / (hSize+1));
        this.guiHarmonica = new Harmonica(this.game,hSize,holeSize,holeSize);
        this.guiHarmonica.x = this.game.width/2;
        this.guiHarmonica.y = this.game.height*4/5;
        if (true) {
            for (var n:number = 1;n <= hSize;n++) {
                var img:Phaser.Image = this.game.add.image(0,0,"sprites","rectangle");
                img.x = this.guiHarmonica.getXHole(n);img.y = this.guiHarmonica.getYHole();
                img.anchor.x = 0.5;img.width = 4;img.height = 200;img.tint = 0x800000;
                img.angle = -225;
            }
        }    
    }
}    
