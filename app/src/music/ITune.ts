/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * This interface represents a single piece of music
 * 
 * @interface ITune
 */
interface ITune {
    /**
     * Get the number of bars
     * 
     * @returns {number} 
     * @memberof ITune
     */
    getBarCount():number;
    /**
     * Get a reference to a specific bar.
     * 
     * @param {number} n 
     * @returns {IBar} 
     * @memberof ITune
     */
    getBar(n:number):IBar;
    /**
     * Get the number of beats in each bar.
     * 
     * @returns {number} 
     * @memberof ITune
     */
    getBeats():number;
    /**
     * Get the tempo
     * 
     * @returns {number} tempo in beats/minute
     * @memberof ITune
     */
    getDefaultTempo():number;
    /**
     * Get tune information
     * 
     * @param {string} key information key
     * @returns {string} associated information
     * @memberof ITune
     */
    getInformation(key:string):string;
    /**
     * Get the number of holes in the harmonica.
     * 
     * @returns {number} 
     * @memberof ITune
     */
    getHoleCount():number;
}