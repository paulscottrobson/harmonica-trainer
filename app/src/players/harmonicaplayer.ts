/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * This object actually plays the music.
 * 
 * @class HarmonicaPlayer
 */
class HarmonicaPlayer {

    private game:Phaser.Game;
    private tune:ITune;
    private qbLastTime:number;
    private barLastTime:number;
    private sounds:Phaser.Sound[];


    /**
     * Create a harmonica playing object
     * 
     * @param {Phaser.Game} game 
     * @param {ITune} tune 
     * @memberof HarmonicaPlayer
     */
    constructor(game:Phaser.Game,tune:ITune) {
        this.game = game;this.tune = tune;
        this.barLastTime = 0;
        this.qbLastTime = -1;
        this.sounds = [ null ];
        for (var n = 1;n <= PreloadState.NOTE_COUNT;n++) {
            var snd:Phaser.Sound = this.game.add.audio(n.toString());
            this.sounds.push(snd);
            snd.allowMultiple = true;
        }
    }

    /**
     * Destroys the playing object and tidies up.
     * 
     * @memberof HarmonicaPlayer
     */
    destroy() : void {
        this.stopAllSounds();
        for (var snd of this.sounds) {
            snd.destroy();
        }
        this.game = this.tune = this.sounds = null;
    }

    /**
     * Sets the new playing position.
     * 
     * @param {number} barPos 
     * @memberof HarmonicaPlayer
     */
    update(barPos:number): void {
        var bar:number = Math.floor(barPos);
        var qbPos = Math.floor((barPos - bar) * this.tune.getBeats() * 4);
        if (qbPos != this.qbLastTime || bar != this.barLastTime) {

            if (bar >= 0 && bar < this.tune.getBarCount()) {
                var barInfo:IBar = this.tune.getBar(bar);
                for (var n:number = 0;n < barInfo.getEventCount();n++) {
                    var t:number = barInfo.getStartTime(n);
                    var t2:number = barInfo.getEndTime(n);
                    if (t == qbPos || t2 == qbPos) {
                        this.stopAllSounds();
                    }
                    if (t == qbPos) {
                        if (!barInfo.getEvent(n).isRest()) {
                            this.playNotes(barInfo.getEvent(n));
                        }
                    }                    
                }
            }
            this.qbLastTime = qbPos;
            this.barLastTime = bar;            
        }
    }

    /**
     * Play the notes associated with the given event.
     * 
     * @private
     * @param {IHarpEvent} event 
     * @memberof HarmonicaPlayer
     */
    private playNotes(event:IHarpEvent): void {
        console.log(event.getHoles())
    }

    /**
     * Stop all sounds playing.
     * 
     * @private
     * @memberof HarmonicaPlayer
     */
    private stopAllSounds(): void {
        for (var ns = 1;ns <= PreloadState.NOTE_COUNT;ns++) {
            if (this.sounds[ns].isPlaying) { 
                this.sounds[ns].stop(); 
            }
        }
    }
}