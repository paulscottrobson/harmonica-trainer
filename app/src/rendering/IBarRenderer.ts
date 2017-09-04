/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IBarRenderer extends Phaser.Group {
    /**
     * Move the given bar into the given space, erasing / drawing it as required.
     * 
     * @param {number} y 
     * @param {number} height overall height space for bar
     * @returns {void} 
     * @memberof BarRenderer
     */
    move(y:number,height:number) : void;
}
