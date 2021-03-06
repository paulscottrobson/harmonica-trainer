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
        this.tune = new Tune(music);
        this.createHarmonica();
        this.renderManager = new RenderManager(this.game, this.tune, this.guiHarmonica);
        this.renderManager.moveTo(0);
        this.y = 0;
        this.musicPlayer = new HarmonicaPlayer(this.game, this.tune);
    };
    MainState.prototype.destroy = function () {
        this.musicPlayer.destroy();
        this.renderManager.destroy();
        this.tune = null;
        this.guiHarmonica = null;
        this.musicPlayer = this.renderManager = null;
    };
    MainState.prototype.update = function () {
        this.y = this.y + 0.01;
        this.renderManager.moveTo(this.y);
        this.musicPlayer.update(this.y);
    };
    MainState.prototype.createHarmonica = function () {
        var hSize = this.tune.getHoleCount();
        var holeSize = Math.floor(this.game.width * 3 / 4 / (hSize + 1));
        this.guiHarmonica = new Harmonica(this.game, hSize, holeSize, holeSize);
        this.guiHarmonica.x = this.game.width / 2;
        this.guiHarmonica.y = this.game.height * 4 / 5;
    };
    return MainState;
}(Phaser.State));
var Harmonica = (function (_super) {
    __extends(Harmonica, _super);
    function Harmonica(game, count, hWidth, hHeight) {
        var _this = _super.call(this, game) || this;
        _this.holeWidth = hWidth;
        _this.holeCount = count;
        _this.holeHeight = hHeight;
        for (var n = 0; n < count; n++) {
            var img = _this.game.add.image((n - count / 2) * hWidth, -hHeight / 2, "sprites", "hole", _this);
            img.width = hWidth;
            img.height = hHeight;
            var txt = _this.game.add.bitmapText(img.x + hWidth / 2, -hHeight * 2 / 3, "font", (n + 1).toString(), hWidth * 2 / 3, _this);
            txt.anchor.x = 0.5;
            txt.anchor.y = 1;
            txt.tint = 0x004000;
        }
        var colour = 0x0040FF;
        for (var s = -1; s <= 1; s += 2) {
            var img;
            img = _this.game.add.image(0, s * hHeight / 2, "sprites", "rectangle", _this);
            img.width = count * hWidth;
            img.height = hHeight / 4;
            img.anchor.x = 0.5;
            img.anchor.y = 1 - (s + 1) / 2;
            img.tint = colour;
            img = _this.game.add.image(s * count / 2 * hWidth, 0, "sprites", "rectangle", _this);
            img.anchor.x = 1 - (s + 1) / 2;
            img.anchor.y = 0.5;
            img.height = hHeight * 3 / 2;
            img.width = hWidth / 4;
            img.tint = colour;
            img = _this.game.add.image(s * count / 2 * hWidth, 0, "sprites", "rectangle", _this);
            img.anchor.x = 1 - (s + 1) / 2;
            img.anchor.y = 0.5;
            img.height = hHeight * 2 / 3;
            img.width = hWidth;
            img.tint = colour;
        }
        _this.cacheAsBitmap = true;
        return _this;
    }
    Harmonica.prototype.getXHole = function (hole) {
        return this.x - this.holeCount * this.holeWidth / 2 +
            this.holeWidth * (hole - 1) + this.holeWidth / 2;
    };
    Harmonica.prototype.getYHole = function () {
        return this.y - this.holeHeight / 2;
    };
    Harmonica.prototype.getHoleWidth = function () {
        return Math.floor(this.holeWidth * 80 / 100);
    };
    Harmonica.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return Harmonica;
}(Phaser.Group));
var Breath;
(function (Breath) {
    Breath[Breath["BLOW"] = 0] = "BLOW";
    Breath[Breath["DRAW"] = 1] = "DRAW";
})(Breath || (Breath = {}));
;
var Bar = (function () {
    function Bar(barDef, barNumber, beats) {
        var currentTime = 0;
        this.barNumber = barNumber;
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
        this.evCount = this.events.length;
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
    Bar.prototype.getBarNumber = function () {
        return this.barNumber;
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
        this.qbLength = (match[4].charCodeAt(0) - 96);
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
        return this.qbLength;
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
            this.bars.push(new Bar(barDef, this.barCount, this.beats));
            this.barCount++;
        }
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
var HarmonicaPlayer = (function () {
    function HarmonicaPlayer(game, tune) {
        this.game = game;
        this.tune = tune;
        this.barLastTime = 0;
        this.qbLastTime = -1;
        this.sounds = [null];
        for (var n = 1; n <= PreloadState.NOTE_COUNT; n++) {
            var snd = this.game.add.audio(n.toString());
            this.sounds.push(snd);
            snd.allowMultiple = true;
        }
    }
    HarmonicaPlayer.prototype.destroy = function () {
        this.stopAllSounds();
        for (var _i = 0, _a = this.sounds; _i < _a.length; _i++) {
            var snd = _a[_i];
            snd.destroy();
        }
        this.game = this.tune = this.sounds = null;
    };
    HarmonicaPlayer.prototype.update = function (barPos) {
        var bar = Math.floor(barPos);
        var qbPos = Math.floor((barPos - bar) * this.tune.getBeats() * 4);
        if (qbPos != this.qbLastTime || bar != this.barLastTime) {
            if (bar >= 0 && bar < this.tune.getBarCount()) {
                var barInfo = this.tune.getBar(bar);
                for (var n = 0; n < barInfo.getEventCount(); n++) {
                    var t = barInfo.getStartTime(n);
                    var t2 = barInfo.getEndTime(n);
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
    };
    HarmonicaPlayer.prototype.playNotes = function (event) {
        for (var _i = 0, _a = event.getHoles(); _i < _a.length; _i++) {
            var n = _a[_i];
            var soundID = 0;
            if (event.getType() == Breath.BLOW) {
                soundID = HarmonicaPlayer.BLOW_NOTES[n];
            }
            else {
                soundID = HarmonicaPlayer.DRAW_NOTES[n];
            }
            soundID = soundID + event.getBends();
            this.sounds[soundID].play();
        }
    };
    HarmonicaPlayer.prototype.stopAllSounds = function () {
        for (var ns = 1; ns <= PreloadState.NOTE_COUNT; ns++) {
            if (this.sounds[ns].isPlaying) {
                this.sounds[ns].stop();
            }
        }
    };
    HarmonicaPlayer.BLOW_NOTES = [0, 1, 5, 8, 13, 17, 20, 25, 29, 32, 37];
    HarmonicaPlayer.DRAW_NOTES = [0, 3, 8, 12, 15, 18, 22, 24, 27, 31, 34];
    return HarmonicaPlayer;
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
var BarRenderer = (function (_super) {
    __extends(BarRenderer, _super);
    function BarRenderer(game, harmonica, bar) {
        var _this = _super.call(this, game) || this;
        _this.bar = bar;
        _this.isDrawn = false;
        _this.harmonica = harmonica;
        _this.evtImages = null;
        return _this;
    }
    BarRenderer.prototype.destroy = function () {
        this.erase();
        _super.prototype.destroy.call(this);
    };
    BarRenderer.prototype.move = function (y, height) {
        if (y + height < 0 || y > this.game.height) {
            this.erase();
            return;
        }
        if (!this.isDrawn) {
            this.draw(height);
        }
        var imgID = 0;
        for (var n = 0; n < this.bar.getEventCount(); n++) {
            var evt = this.bar.getEvent(n);
            var yPos = y + height - height * this.bar.getStartTime(n) / (4 * this.bar.getBeats());
            var holesUsed = evt.getHoles();
            for (var _i = 0, holesUsed_1 = holesUsed; _i < holesUsed_1.length; _i++) {
                var hole = holesUsed_1[_i];
                this.evtImages[imgID].y = yPos;
                imgID++;
            }
        }
        this.game.world.bringToTop(this.harmonica);
    };
    BarRenderer.prototype.draw = function (height) {
        if (!this.isDrawn) {
            this.isDrawn = true;
            this.evtImages = [];
            for (var n = 0; n < this.bar.getEventCount(); n++) {
                var evt = this.bar.getEvent(n);
                var holesUsed = evt.getHoles();
                var graphic = (evt.getType() == Breath.BLOW) ? "blowfrectangle" : "drawfrectangle";
                for (var _i = 0, holesUsed_2 = holesUsed; _i < holesUsed_2.length; _i++) {
                    var hole = holesUsed_2[_i];
                    var img = this.game.add.image(0, 0, "sprites", graphic, this);
                    img.width = this.harmonica.getHoleWidth();
                    img.height = Math.max(1, height * evt.getLength() / (4 * this.bar.getBeats()) - 8);
                    img.anchor.x = 0.5;
                    img.anchor.y = 1;
                    img.x = this.harmonica.getXHole(hole);
                    this.evtImages.push(img);
                    if (evt.getType() == Breath.DRAW) {
                        img.tint = BarRenderer.DRAW_COLOURS[Math.abs(evt.getBends())];
                    }
                    else {
                        img.tint = BarRenderer.BLOW_COLOURS[Math.abs(evt.getBends())];
                    }
                }
            }
        }
    };
    BarRenderer.prototype.erase = function () {
        if (this.isDrawn) {
            this.isDrawn = false;
            for (var _i = 0, _a = this.evtImages; _i < _a.length; _i++) {
                var img = _a[_i];
                img.destroy();
            }
            this.evtImages = null;
            this.bar = null;
        }
    };
    BarRenderer.DRAW_COLOURS = [
        0x00FFFF,
        0x0080FF,
        0x0000FF,
        0x7F00FF,
    ];
    BarRenderer.BLOW_COLOURS = [
        0xFF0000,
        0xFF8000,
        0x663300,
        0x660000
    ];
    return BarRenderer;
}(Phaser.Group));
var RenderManager = (function () {
    function RenderManager(game, tune, harmonica) {
        this.tune = tune;
        this.harmonica = harmonica;
        this.entryHeight = game.height / 3;
        this.renderers = [];
        this.lastYIntegerPos = [];
        for (var n = 0; n < tune.getBarCount(); n++) {
            var bar = tune.getBar(n);
            var rnd = new BarRenderer(game, harmonica, bar);
            this.renderers.push(rnd);
            this.lastYIntegerPos.push(9999999);
        }
    }
    RenderManager.prototype.destroy = function () {
        for (var _i = 0, _a = this.renderers; _i < _a.length; _i++) {
            var rnd = _a[_i];
            rnd.destroy();
        }
        this.tune = this.harmonica = this.renderers = this.lastYIntegerPos = null;
    };
    RenderManager.prototype.moveTo = function (barPos) {
        for (var n = 0; n < this.tune.getBarCount(); n++) {
            var y = this.harmonica.getYHole() - n * this.entryHeight - this.entryHeight;
            y = Math.round(y + this.entryHeight * barPos);
            if (y != this.lastYIntegerPos[n]) {
                this.renderers[n].move(y, this.entryHeight);
                this.lastYIntegerPos[n] = y;
            }
        }
    };
    return RenderManager;
}());
