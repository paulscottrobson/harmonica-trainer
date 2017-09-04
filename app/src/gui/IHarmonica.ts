/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Harmonica GUI Interface
 * 
 * @interface IHarmonica
 * @extends {Phaser.Group}
 */

interface IHarmonica extends Phaser.Group {
    /**
     * Return the x position of the centre of the given hole
     * 
     * @param {number} hole hole number from 1
     * @returns {number} hole x coordinate
     * @memberof IHarmonica
     */
    getXHole(hole:number):number;
    /**
     * Return the y position of the centre of the given hole
     * 
     * @returns {number} hole y coordinate
     * @memberof IHarmonica
     */
    getYHole():number;
    /**
     * Get the hole width in pixels
     * 
     * @returns {number} 
     * @memberof IHarmonica
     */
    getHoleWidth():number;
}