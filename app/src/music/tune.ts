/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Concrete implementation of tune representation.
 * 
 * @class Tune
 * @implements {ITune}
 */
class Tune implements ITune {

    private beats:number;
    private tempo:number;
    private barCount:number;
    private bars:IBar[];
    private musicJSON:any;

    constructor(json:any) {
        this.bars = [];this.barCount = 0;
        this.musicJSON = json;
        this.beats = parseInt(json["beats"]);
        this.tempo = parseInt(json["speed"]);
        for (var barDef of json["bars"]) {
            this.bars.push(new Bar(barDef,this.barCount,this.beats));
            this.barCount++;
        }
    }

    destroy() {
        this.bars = this.musicJSON = null;
    }

    getBarCount(): number {
        return this.barCount;
    }
    getBar(n: number): IBar {
        return this.bars[n];
    }
    getBeats(): number {
        return this.beats;
    }
    getDefaultTempo(): number {
        return this.tempo;
    }
    getInformation(key: string): string {
        return this.musicJSON(key.toLowerCase());
    }    
    getHoleCount():number {
        return 10;
    }
}