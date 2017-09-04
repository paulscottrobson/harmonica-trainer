var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainState.prototype.create = function () {
        var bgr = this.game.add.image(0, 0, "sprites", "background");
        bgr.width = this.game.width;
        bgr.height = this.game.height;
        var music = this.game.cache.getJSON("music");
        console.log(music);
        this.tune = new Tune(music);
    };
    MainState.prototype.destroy = function () {
    };
    MainState.prototype.update = function () {
    };
    return MainState;
}(Phaser.State));
var Breath;
(function (Breath) {
    Breath[Breath["BLOW"] = 0] = "BLOW";
    Breath[Breath["DRAW"] = 1] = "DRAW";
})(Breath || (Breath = {}));
;
var Bar = (function () {
    function Bar(barDef, beats) {
        var currentTime = 0;
        this.beats = beats;
        this.events = [];
        this.startTime = [];
        this.evCount = 0;
        for (var _i = 0, _a = barDef.split(";"); _i < _a.length; _i++) {
            var eventDef = _a[_i];
            var event = new HarpEvent(eventDef);
            this.events.push(event);
            this.startTime.push(currentTime);
            currentTime = currentTime + event.getLength();
        }
    }
    Bar.prototype.destroy = function () {
        this.events = this.startTime = null;
    };
    Bar.prototype.getBeats = function () {
        return this.beats;
    };
    Bar.prototype.getEventCount = function () {
        return this.evCount;
    };
    Bar.prototype.getEvent = function (n) {
        return this.events[n];
    };
    Bar.prototype.getStartTime = function (n) {
        return this.startTime[n];
    };
    Bar.prototype.getEndTime = function (n) {
        return this.startTime[n] + this.events[n].getLength();
    };
    return Bar;
}());
var HarpEvent = (function () {
    function HarpEvent(evDef) {
        if (HarpEvent.regExp == null) {
            HarpEvent.regExp = new RegExp("^([\>\<])([0-9]*)([\+\-]*)([a-z])$");
        }
        if (!HarpEvent.regExp.test(evDef)) {
            throw new Error("Bad internal format '" + evDef + "'");
        }
        var match = HarpEvent.regExp.exec(evDef);
        this.type = (match[1] == '>') ? Breath.BLOW : Breath.DRAW;
        this.holes = [];
        for (var _i = 0, _a = match[2]; _i < _a.length; _i++) {
            var hole = _a[_i];
            this.holes.push(parseInt(hole, 10) + 1);
        }
        this.noteCount = this.holes.length;
        this.bends = 0;
        for (var _b = 0, _c = match[3]; _b < _c.length; _b++) {
            var bend = _c[_b];
            if (bend == '+')
                this.bends++;
            if (bend == '-')
                this.bends--;
        }
        this.mbLength = (match[4].charCodeAt(0) - 96) * 250;
    }
    HarpEvent.prototype.getType = function () {
        return this.type;
    };
    HarpEvent.prototype.isRest = function () {
        return (this.noteCount == 0);
    };
    HarpEvent.prototype.getHoles = function () {
        return this.holes;
    };
    HarpEvent.prototype.getLength = function () {
        return this.mbLength;
    };
    HarpEvent.prototype.getBends = function () {
        return this.bends;
    };
    HarpEvent.regExp = null;
    return HarpEvent;
}());
var Tune = (function () {
    function Tune(json) {
        this.bars = [];
        this.barCount = 0;
        this.musicJSON = json;
        this.beats = parseInt(json["beats"]);
        this.tempo = parseInt(json["speed"]);
        for (var _i = 0, _a = json["bars"]; _i < _a.length; _i++) {
            var barDef = _a[_i];
            this.bars.push(new Bar(barDef, this.beats));
        }
        this.barCount = this.bars.length;
    }
    Tune.prototype.destroy = function () {
        this.bars = this.musicJSON = null;
    };
    Tune.prototype.getBarCount = function () {
        return this.barCount;
    };
    Tune.prototype.getBar = function (n) {
        return this.bars[n];
    };
    Tune.prototype.getBeats = function () {
        return this.beats;
    };
    Tune.prototype.getDefaultTempo = function () {
        return this.tempo;
    };
    Tune.prototype.getInformation = function (key) {
        return this.musicJSON(key.toLowerCase());
    };
    Tune.prototype.getHoleCount = function () {
        return 10;
    };
    return Tune;
}());
window.onload = function () {
    var game = new HarmonicaTabApplication();
};
var HarmonicaTabApplication = (function (_super) {
    __extends(HarmonicaTabApplication, _super);
    function HarmonicaTabApplication() {
        var _this = _super.call(this, 1280, 800, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Boot", new BootState());
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Main", new MainState());
        _this.state.start("Boot");
        return _this;
    }
    HarmonicaTabApplication.getURLName = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ""; }
        var name = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key.toLowerCase()).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        return (name == "") ? defaultValue : name;
    };
    return HarmonicaTabApplication;
}(Phaser.Game));
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        var _this = this;
        this.game.load.image("loader", "assets/sprites/loader.png");
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Preload", true, false, 1); }, this);
    };
    BootState.prototype.create = function () {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    return BootState;
}(Phaser.State));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        var _this = this;
        this.game.stage.backgroundColor = "#000000";
        var loader = this.add.sprite(this.game.width / 2, this.game.height / 2, "loader");
        loader.width = this.game.width * 9 / 10;
        loader.height = this.game.height / 8;
        loader.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loader);
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        for (var _i = 0, _a = ["7seg", "font"]; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        for (var i = 1; i <= PreloadState.NOTE_COUNT; i++) {
            var sound = i.toString();
            this.game.load.audio(sound, ["assets/sounds/" + sound + ".mp3",
                "assets/sounds/" + sound + ".ogg"]);
        }
        this.game.load.audio("metronome", ["assets/sounds/metronome.mp3",
            "assets/sounds/metronome.ogg"]);
        var src = HarmonicaTabApplication.getURLName("music", "music.json");
        this.game.load.json("music", HarmonicaTabApplication.getURLName("music", src));
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, 1); }, this);
    };
    PreloadState.NOTE_COUNT = 37;
    return PreloadState;
}(Phaser.State));
