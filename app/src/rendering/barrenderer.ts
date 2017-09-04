/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Concrete implementation of the bar renderer.
 * 
 * @class BarRenderer
 * @extends {Phaser.Group}
 * @implements {IBarRenderer}
 */

class BarRenderer extends Phaser.Group implements IBarRenderer {

    private bar:IBar;
    private isDrawn:boolean;
    private harmonica:IHarmonica;
    private evtImages:Phaser.Image[];

    constructor(game:Phaser.Game,harmonica:IHarmonica,bar:IBar) {
        super(game);
        this.bar = bar;
        this.isDrawn = false;
        this.harmonica = harmonica;
        this.evtImages = null;
    }

    destroy() : void {
        this.erase();
        super.destroy();
    }

    move(y:number,height:number) : void {
        // If off top or bottom erase it, not needed.
        if (y+height < 0 || y > this.game.height) {
            this.erase();
            return;
        }
        // Create the bars if required.
        if (!this.isDrawn) {
            this.draw(height);
        }
        // Position them all according to the time. Note, this requires the evtImages[]
        // member to be in the same order they are drawn.
        var imgID:number = 0;
        for (var n:number = 0;n < this.bar.getEventCount();n++) {
            var evt:IHarpEvent = this.bar.getEvent(n);
            var yPos:number = y + height - height * this.bar.getStartTime(n) / (4 * this.bar.getBeats());
            var holesUsed:number[] = evt.getHoles();
            for (var hole of holesUsed) {
                this.evtImages[imgID].y = yPos;
                imgID++;
            }
        }
        this.game.world.bringToTop(this.harmonica);
    }

    /**
     * Draw all bars, position them horizontally but not vertically 
     * 
     * @param {number} height overall height space for bar
     * @memberof BarRenderer
     */
    private draw(height:number) : void {
        if (!this.isDrawn) {
            this.isDrawn = true;
            // For each music event, create a rectangle and set it up horizontally,size,colour            
            this.evtImages = [];
            for (var n:number = 0; n < this.bar.getEventCount();n++) {
                var evt:IHarpEvent = this.bar.getEvent(n);
                var holesUsed:number[] = evt.getHoles();
                var graphic:string = (evt.getType() == Breath.BLOW) ? "blowfrectangle" : "drawfrectangle";
                for (var hole of holesUsed) {
                    var img:Phaser.Image = this.game.add.image(0,0,"sprites",graphic,this);
                    img.width = this.harmonica.getHoleWidth();
                    img.height = Math.max(1,height * evt.getLength() / (4 * this.bar.getBeats())-8);
                    img.anchor.x = 0.5;img.anchor.y = 1;
                    img.x = this.harmonica.getXHole(hole);
                    this.evtImages.push(img);
                    // Colour according to blow draw.
                    if (evt.getType() == Breath.DRAW) {
                        img.tint = BarRenderer.DRAW_COLOURS[Math.abs(evt.getBends())]
                    } else {
                        img.tint = BarRenderer.BLOW_COLOURS[Math.abs(evt.getBends())]
                    }
                }
            }
        }
    }

    private static DRAW_COLOURS:number[] = [
        0x00FFFF,       // Cyan Draw
        0x0080FF,       // Mid Blue Draw Bend 1
        0x0000FF,       // Blue Draw Bend 2
        0x7F00FF,       // Purple Draw Bend 3
    ];

    private static BLOW_COLOURS:number[] = [
        0xFF0000,       // Red Blow
        0xFF8000,       // Orange Blow over 1
        0x663300,       // Brown Blow over 2
        0x660000        // Dark Brown Blow over 3
    ];

    /**
     * Erase all bars use and mark as not drawn.
     * 
     * @memberof BarRenderer
     */
    private erase() : void {
        if (this.isDrawn) {
            this.isDrawn = false;
            for (var img of this.evtImages) {
                img.destroy();
            }
            this.evtImages = null;
            this.bar = null;
        }
    }
}