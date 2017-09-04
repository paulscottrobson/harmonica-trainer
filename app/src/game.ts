/// <reference path="../lib/phaser.comments.d.ts"/>

class MainState extends Phaser.State {

    private tune:ITune;
    private guiHarmonica:IHarmonica;
    private renderManager:RenderManager;
    private musicPlayer:HarmonicaPlayer;
    private y:number;

    create() : void {
        // Stretched background
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","background");
        bgr.width = this.game.width;bgr.height = this.game.height;
        // Load music from JSON
        var music:any = this.game.cache.getJSON("music")
        this.tune = new Tune(music);
        // Create the harmonica graphic.
        this.createHarmonica();

        this.renderManager = new RenderManager(this.game,this.tune,this.guiHarmonica);
        this.renderManager.moveTo(0);
        this.y = 0;
        this.musicPlayer = new HarmonicaPlayer(this.game,this.tune);
    }

    destroy() : void {
        this.musicPlayer.destroy();
        this.renderManager.destroy();
        this.tune = null;this.guiHarmonica = null;
        this.musicPlayer = this.renderManager = null;
    }

    update() : void {
        this.y = this.y + 0.01;
        this.renderManager.moveTo(this.y);
        this.musicPlayer.update(this.y);
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
        /*
            for (var n:number = 1;n <= hSize;n++) {
                var img:Phaser.Image = this.game.add.image(0,0,"sprites","rectangle");
                img.x = this.guiHarmonica.getXHole(n);img.y = this.guiHarmonica.getYHole();
                img.anchor.x = 0.5;img.width = 4;img.height = 150;img.tint = 0x800000;
                img.angle = -25;
            }
        */   
    }
}    
