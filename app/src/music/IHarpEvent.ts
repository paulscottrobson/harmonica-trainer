/// <reference path="../../lib/phaser.comments.d.ts"/>

enum Breath { BLOW, DRAW };

/**
 * A HarpEvent is simply a blow or draw event through one or more, or none 
 * (for a rest) holes.
 * 
 * @interface IHarpEvent
 */
interface IHarpEvent {
    /**
     * Is this a blow or a draw ?
     * 
     * @returns {Breath} Breath.BLOW or Breath.DRAW accordingly.
     * @memberof IHarpEvent
     */
    getType(): Breath;
    /**
     * Check if event is a rest
     * 
     * @returns {boolean} true if a rest
     * @memberof IHarpEvent
     */
    isRest(): boolean;
    /**
     * Return a list of holes that are being blown or drawn through. 
     * These are in the harmonica format 1-10 not the data format 0-9.
     * 
     * @returns {number[]} list of holes being blown or drawn through.
     * @memberof IHarpEvent
     */
    getHoles():number[];
    /**
     * Get length of note in Millibeats.
     * 
     * @returns {number} 
     * @memberof IHarpEvent
     */
    getLength():number;
    /**
     * Get the number of semitone bends applied. + is overblow - is draw bend.
     * 
     * @returns {number} bend count.
     * @memberof IHarpEvent
     */
    getBends():number;
}