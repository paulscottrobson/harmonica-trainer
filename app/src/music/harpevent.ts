/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Concrete implementation of a HarpEvent e.g. blowing or drawing through
 * one or more holes (or none if it is a rest)
 * 
 * @class HarpEvent
 * @implements {IHarpEvent}
 */
class HarpEvent implements IHarpEvent {

    private static regExp:RegExp = null;
    private type:Breath;
    private holes:number[];
    private noteCount:number;
    private qbLength:number;
    private bends:number;

    constructor(evDef:string) {
        // Check format matches
        if (HarpEvent.regExp == null) {
            HarpEvent.regExp = new RegExp("^([\>\<])([0-9]*)([\+\-]*)([a-z])$")
        }
        if (!HarpEvent.regExp.test(evDef)) {
            throw new Error("Bad internal format '"+evDef+"'")
        }
        // Get the parts
        var match:string[] = HarpEvent.regExp.exec(evDef);
        // console.log(match);
        // Draw or Blow ?
        this.type = (match[1] == '>') ? Breath.BLOW : Breath.DRAW;
        // Holes covered.
        this.holes = [];
        for (var hole of match[2]) {
            this.holes.push(parseInt(hole,10)+1);
        }
        this.noteCount = this.holes.length;
        // Bends
        this.bends = 0;
        for (var bend of match[3]) {
            if (bend == '+') this.bends++;
            if (bend == '-') this.bends--;
        }
        // Length
        this.qbLength = (match[4].charCodeAt(0)-96);
        // console.log(this.holes,this.noteCount,this.type,this.bends,this.mbLength);
}

    getType(): Breath {
        return this.type;
    }
    isRest(): boolean {
        return (this.noteCount == 0);
    }
    getHoles(): number[] {
        return this.holes;
    }
    getLength(): number {
        return this.qbLength;
    }
    getBends(): number {
        return this.bends;
    }
}