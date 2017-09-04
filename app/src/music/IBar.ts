/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * A bar is a collection of Harp Events.
 * 
 * @interface IBar
 */
interface IBar {
    /**
     * Get the number of beats in the bar
     * 
     * @returns {number} 
     * @memberof IBar
     */
    getBeats():number;
    /**
     * Get the number of events in the bar
     * 
     * @returns {number} 
     * @memberof IBar
     */
    getEventCount():number;
    /**
     * Extract a specific event
     * 
     * @param {number} n 
     * @returns {IHarpEvent} 
     * @memberof IBar
     */
    getEvent(n:number):IHarpEvent;
    /**
     * Get start time in bar in millibeats
     * 
     * @param {number} n note to get time of.
     * @returns {number} 
     * @memberof IBar
     */
    getStartTime(n:number):number;
    /**
     * Get end time in bar in millibeats
     * 
     * @param {number} n note to get time of
     * @returns {number} 
     * @memberof IBar
     */
    getEndTime(n:number):number;
    /**
     * Get the current bar number (indexed from zero)
     * 
     * @returns {number} 
     * @memberof IBar
     */
    getBarNumber():number;
}