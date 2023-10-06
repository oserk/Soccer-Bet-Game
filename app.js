//Application Settings
const Application = PIXI.Application;
const app = new Application({
  transparent: false,
  antialias: true,
});
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = "absolute";
document.body.appendChild(app.view);

/*//Sound Part
const sound = new Howl({
  src: ["./sounds/yelling.wav"],
});
sound.play();*/

//Background Settings
const background = PIXI.Sprite.from("./images/blackBackground.png");
background.width = 1024;
background.height = 1024;
background.position.set(0, 0);
background.eventMode = "static";
background.interactive = true;
app.stage.addChild(background);

const zeroMultiplier = 0.004;
const firstMultiplierConst = 0.012;
const secondMultiplierConst = 0.16;
const thirdMultiplierConst = 0.024;
let text;
let rectangleScoreBoard;
let BGAnimation;
let BGTexture;
let BGTextures = [];
let RonaldoAnimation;
let RonaldoTexture;
let RonaldoTextures = [];
let CarlosAnimation;
let CarlosTexture;
let CarlosTextures = [];
let waitAnimation;
let waitAnimationTexture;
let waitAnimationTextures = [];
let tapped3 = true;
let increment = true;
let multiplierIncrementStopped = false;
let multiplier = 1.0;
let flowCheck = false;

const loaderAll = new PIXI.Loader();
loaderAll
  .add("tileset0", "./images/BGJsonspritesheet.json")
  .add("tileset3", "./images/waitJsonNew.json")
  .add("tileset4", "./images/JsonSoccers.json")
  .load(setup);

function setup() {
  //BACKGROUND ANIMATION
  for (var i = 0; i < 20; i++) {
    BGTexture = PIXI.Texture.from(`BG00${i}.png`);
    BGTextures.push(BGTexture);
  }

  BGAnimation = new PIXI.AnimatedSprite(BGTextures);
  BGAnimation.position.set(0, 0);
  BGAnimation.scale.set(1, 1);
  BGAnimation.animationSpeed = 0.45;
  app.stage.addChild(BGAnimation);
  BGAnimation.play();

  //RONALDO ANIMATION
  for (let k = 0; k < 20; k++) {
    RonaldoTexture = PIXI.Texture.from(`Soccer00${k}.png`);
    RonaldoTextures.push(RonaldoTexture);
  }
  RonaldoAnimation = new PIXI.AnimatedSprite(RonaldoTextures);
  RonaldoAnimation.position.set(0, 0);
  RonaldoAnimation.scale.set(1, 1);
  RonaldoAnimation.animationSpeed = 0.5;
  app.stage.addChild(RonaldoAnimation);
  RonaldoAnimation.play();

  //RONALDA FALLING AND CARLOS TACKLE
  for (let l = 20; l < 90; l++) {
    CarlosTexture = PIXI.Texture.from(`Soccer00${l}.png`);
    CarlosTextures.push(CarlosTexture);
  }
  CarlosAnimation = new PIXI.AnimatedSprite(CarlosTextures);
  CarlosAnimation.position.set(0, 0);
  CarlosAnimation.scale.set(1, 1);
  CarlosAnimation.animationSpeed = 0.45;

  //Wait Animation
  for (let m = 0; m < 122; m++) {
    waitAnimationTexture = PIXI.Texture.from(`${m}.png`);
    waitAnimationTextures.push(waitAnimationTexture);
  }
  waitAnimation = new PIXI.AnimatedSprite(waitAnimationTextures);
  waitAnimation.position.set(0, 0);
  waitAnimation.scale.set(1, 1);
  waitAnimation.animationSpeed = 0.45;
  app.stage.addChild(waitAnimation);

  //Rectangle Scoreboard Part
  const Graphics = PIXI.Graphics;
  rectangleScoreBoard = new Graphics();
  rectangleScoreBoard
    .beginFill(0x000000)
    .lineStyle(5, 0xffffff, 1)
    .drawRect(760, 278, 210, 105).endFill;
  app.stage.addChild(rectangleScoreBoard);

  //text part
  text = new PIXI.Text(`${multiplier}`, {
    fontSize: 40,
    fill: 0xffffff,
    stroke: 0x00ff00,
    strokeThickness: 4,
  });
  text.position.set(805, 305);
  app.stage.addChild(text);
  app.ticker.add(() => {
    if (multiplier >= 1 && multiplier < 3 && !multiplierIncrementStopped) {
      multiplier += zeroMultiplier;
      RonaldoAnimation.animationSpeed = 0.6;
      BGAnimation.animationSpeed = 0.55;
    } else if (
      multiplier >= 3 &&
      multiplier < 10 &&
      !multiplierIncrementStopped
    ) {
      multiplier += firstMultiplierConst;
      RonaldoAnimation.animationSpeed = 0.7;
      BGAnimation.animationSpeed = 0.6;
    } else if (
      multiplier >= 10 &&
      multiplier < 30 &&
      !multiplierIncrementStopped
    ) {
      multiplier += secondMultiplierConst;
      RonaldoAnimation.animationSpeed = 0.8;
      BGAnimation.animationSpeed = 0.65;
    } else if (multiplier >= 30 && !multiplierIncrementStopped) {
      multiplier += thirdMultiplierConst;
      RonaldoAnimation.animationSpeed = 0.9;
      BGAnimation.animationSpeed = 0.75;
    }
    text.text = `${multiplier.toFixed(2)}x`;
  });
}

// Game Flow Logic
background.on("pointerdown", (event) => {
  RonaldoAnimation.onFrameChange = function () {
    if (RonaldoAnimation.currentFrame === 19 && !flowCheck) {
      flowCheck = true;
      setTimeout(() => {
        BGAnimation.stop();
      }, 450);
      RonaldoAnimation.gotoAndStop(0);
      app.stage.removeChild(RonaldoAnimation);
      app.stage.addChild(CarlosAnimation);
      CarlosAnimation.play();
      CarlosAnimation.loop = false;
    }
  };
  setTimeout(() => {
    flowCheck = false;
  }, 1);

  setTimeout(() => {
    CarlosAnimation.gotoAndStop(0);
    app.stage.removeChild(CarlosAnimation);
    app.stage.removeChild(text);
    app.stage.removeChild(rectangleScoreBoard);
    waitAnimation.gotoAndPlay(0);
    waitAnimation.loop = false;
    waitAnimation.animationSpeed = 0.45;
    BGAnimation.animationSpeed = 0.45;
    RonaldoAnimation.animationSpeed = 0.5;
  }, 2500);

  waitAnimation.onFrameChange = function () {
    if (waitAnimation.currentFrame === 120) {
      app.stage.addChild(RonaldoAnimation);
      RonaldoAnimation.gotoAndPlay(0);
      multiplier = 1;
      tapped3 = true;
      multiplierIncrementStopped = false;
      app.stage.addChild(rectangleScoreBoard);
      app.stage.addChild(text);
      BGAnimation.play();
    }
  };
  setTimeout(() => {
    if (tapped3) {
      tapped3 = false;
      multiplierIncrementStopped = true;
    }
  }, 400);
});

//.add("tileset2", "./images/SoccersJsonspritesheet.json")
