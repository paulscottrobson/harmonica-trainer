/// <reference path="../../lib/phaser.comments.d.ts"/>

class RenderManager {

    private entryHeight:number;
    private tune:ITune;
    private harmonica:IHarmonica;
    private renderers:IBarRenderer[];
    private lastYIntegerPos:number[];

    constructor(game:Phaser.Game,tune:ITune,harmonica:IHarmonica) {
        this.tune = tune;this.harmonica = harmonica;
        this.entryHeight = game.height / 3;
        this.renderers = [];this.lastYIntegerPos = [];
        for (var n:number = 0;n < tune.getBarCount();n++) {
            var bar:IBar = tune.getBar(n);
            var rnd:IBarRenderer = new BarRenderer(game,harmonica,bar);
            this.renderers.push(rnd);
            this.lastYIntegerPos.push(9999999);
        }
    }

    destroy() : void {
        for (var rnd of this.renderers) {
            rnd.destroy();
        }
        this.tune = this.harmonica = this.renderers = this.lastYIntegerPos = null;
    }

    moveTo(barPos:number) : void {
        for (var n:number = 0;n < this.tune.getBarCount();n++) {
            // This is for offset from zero.
            var y:number = this.harmonica.getYHole() - n * this.entryHeight - this.entryHeight;
            // Now add for the bar Pos which is a fractional bar position.
            y = Math.round(y + this.entryHeight * barPos);
            // Move this bar there if the integer y position has changed.
            if (y != this.lastYIntegerPos[n]) {
                this.renderers[n].move(y,this.entryHeight);
                this.lastYIntegerPos[n] = y;
            }
        }
    }
}