/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Concrete bar implementation
 * 
 * @class Bar
 * @implements {IBar}
 */
class Bar implements IBar {

    private barNumber:number;
    private beats:number;
    private evCount:number;
    private events:IHarpEvent[];
    private startTime:number[];

    constructor(barDef:string,barNumber:number,beats:number) {

        var currentTime:number = 0;
        this.barNumber = barNumber;
        this.beats = beats;
        this.events = [];this.startTime = [];this.evCount = 0;

        for (var eventDef of barDef.split(";")) {
            var event:IHarpEvent = new HarpEvent(eventDef);
            this.events.push(event);
            this.startTime.push(currentTime);
            currentTime = currentTime + event.getLength();
        }
    }

    destroy(): void {
        this.events = this.startTime = null;
    }

    getBeats(): number {
        return this.beats;
    }
    getEventCount(): number {
        return this.evCount;
    }
    getEvent(n: number): IHarpEvent {
        return this.events[n];
    }
    getStartTime(n: number): number {
        return this.startTime[n];
    }
    getEndTime(n: number): number {
        return this.startTime[n] + this.events[n].getLength();
    }
    getBarNumber():number {
        return this.barNumber;
    }
}