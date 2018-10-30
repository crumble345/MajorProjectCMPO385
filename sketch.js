//setting up variables
var scene1;
var scene2;
var chosenPath = [];

var elevatorImg, rooftopImg, kitchenImg, alleyImg, poolRoomImg,
    bridgeImg, cableCarImg, overpassImg, gardensImg, waterfrontImg;

var carrier, modulator;
var freq1, freq2;
var notFirstTime = 0;

var getC;
var mouseClickX, mouseClickY;
var place1, place2, img1, img2;

function preload() {
    //loading all sounds and images - a fairly hefty preload. I have compressed the
    //images because of this, and would consider changing the audio to MP3 if necessary
    soundFormats('wav', 'mp3', 'ogg');

    elevatorFP = ('audio/elevator.wav');
    elevator = loadSound(elevatorFP);

    rooftopFP = ('audio/rooftop.wav');
    rooftop = loadSound(rooftopFP);

    kitchenFP = ('audio/kitchen.wav');
    kitchen = loadSound(kitchenFP);

    alleyFP = ('audio/alley.wav');
    alley = loadSound(alleyFP);

    poolRoomFP = ('audio/poolRoom.wav');
    poolRoom = loadSound(poolRoomFP);

    bridgeFP = ('audio/bridge.wav');
    bridge = loadSound(bridgeFP);

    cableCarFP = ('audio/cableCar.wav');
    cableCar = loadSound(cableCarFP);

    overpassFP = ('audio/overpass.wav');
    overpass = loadSound(overpassFP);

    gardensFP = ('audio/gardens.wav');
    gardens = loadSound(gardensFP);

    waterfrontFP = ('audio/waterfront.wav');
    waterfront = loadSound(waterfrontFP);

    elevatorImg = loadImage('images/elevator.jpg');
    rooftopImg = loadImage('images/rooftop.jpg');
    kitchenImg = loadImage('images/kitchen.jpg');
    cableCarImg = loadImage('images/cableCar.jpg');
    overpassImg = loadImage('images/overpass.jpg');
    alleyImg = loadImage('images/alley.jpg');
    poolRoomImg = loadImage('images/poolRoom.jpg');
    bridgeImg = loadImage('images/bridge.jpg');
    gardensImg = loadImage('images/gardens.jpg');
    waterfrontImg = loadImage('images/waterfront.jpg');
}

function setup() {
    //Not much in the setup because each scene has its own setup
    createCanvas(screen.width, screen.height - 4);
    mgr = new SceneManager();
    fft = new p5.FFT(.8, 256);
    textSize(46);

    //starting Oscillators
    env1 = new p5.Env();
    env1.setADSR(.2, .3, .4, 8);
    env2 = new p5.Env();
    env2.setADSR(2.5, .1, 0, .1);

    modulator = new p5.Oscillator();
      modulator.setType('sine');
      modulator.amp(50, 0.1);
      modulator.freq(25);
      modulator.disconnect();

    carrier = new p5.Oscillator();
      carrier.setType('sine');
      carrier.amp(env1);
      carrier.freq(freq1);
      carrier.freq(modulator);

    wetAtmost = new p5.Oscillator();
      wetAtmost.setType('triangle');
      wetAtmost.amp(env2);
      wetAtmost.freq(freq2);

    delay = new p5.Delay();
      delay.process(wetAtmost, .40, .6, 1500);
      delay.setType('pingPong');

    wetAtmost.start();
    carrier.start();
    modulator.start();
    //skips straight to show the first scene, Intro
    mgr.showScene(Intro);
}

function draw() {
    //just instantiating the scene manager's draw loop
    mgr.draw();
}

function Intro() {
    //the first screen that is shown, with some basic instructions
    this.setup = function() {
        playSynth();
    }
    this.draw = function() {
        background(0);
        fill(255);
        ellipse(width/2, height/2, width, height)
        fill(0);
        textSize(46);
        textAlign(CENTER)
        text("Press Any Button to Start Your 'Sonic Journey'", width*.5, height*.4);
        text("Enter FullScreen Mode (F11) for the Best Results", width*.5, height*.6);

    }
    //No matter what the user does, they will be shown the right screen
    this.keyPressed = function() {
        this.sceneManager.showScene(ElevatorSCN);
        carrier.stop();
        modulator.stop();
    }
    this.mouseClicked = function() {
        this.sceneManager.showScene(ElevatorSCN);
        carrier.stop();
        modulator.stop();
    }
}

function ElevatorSCN() {
    this.setup = function() {

        //does some simple things that only need doing once
        elevator.play();
        chosenPath = ["Elevator"];
        textAlign(LEFT)
        image(elevatorImg, 0, 0, width, height)
        //gets the colour in the centre of the image
        getC = get(width / 2, height / 2);

    }
    this.draw = function() {
        //displays the image and text needed
        image(elevatorImg, 0, 0, width, height)
        fill(255);
        text("Elevator", width * .7, 50)
            //displays text is someone is trying to change scene mid-scene
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }

      drawFFT(getC);
        if (elevator.isPlaying()) {
            //do nothing
        } else {
            //changing variables before the sceneSelector is launched
            place1 = 'Kitchen';
            place2 = 'Rooftop';
            img1 = kitchenImg;
            img2 = rooftopImg;
            scene1 = KitchenSCN;
            scene2 = RooftopSCN;
            this.sceneManager.showScene(SceneSelectionDisplay);
        }
    }
}

function RooftopSCN() {
    this.setup = function() {
        rooftop.play();
        chosenPath = [chosenPath + ", Rooftop"];
        image(rooftopImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(rooftopImg, 0, 0, width, height)
        fill(255);
        text("Rooftop", width * .7, 50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (rooftop.isPlaying()) {
            //do nothing
        } else {
            place1 = 'Alley';
            place2 = 'Pool Room';
            img1 = alleyImg;
            img2 = poolRoomImg;
            scene1 = AlleySCN;
            scene2 = PoolRoomSCN;
            this.sceneManager.showScene(SceneSelectionDisplay);
        }
    }
}

function KitchenSCN() {
    this.setup = function() {
        kitchen.play();
        chosenPath = [chosenPath + ", Kitchen"];
        image(kitchenImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(kitchenImg, 0, 0, width, height)
        fill(255);
        text("Kitchen", width * .7, 50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (kitchen.isPlaying()) {
            //do nothing
        } else {
            this.draw = function() {
                place1 = 'Alley';
                place2 = 'Pool Room';
                img1 = alleyImg;
                img2 = poolRoomImg;
                scene1 = AlleySCN;
                scene2 = PoolRoomSCN;
                this.sceneManager.showScene(SceneSelectionDisplay);
            }
        }
    }
}

function AlleySCN() {
    this.setup = function() {
        alley.play();
        chosenPath = [chosenPath + ", Alley"];
        image(alleyImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(alleyImg, 0, 0, width, height)
        fill(255);
        text("Alley", width * .7, 50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (alley.isPlaying()) {
            //do nothing
        } else {
            this.draw = function() {
                place1 = 'Cable Car';
                place2 = 'Bridge';
                img1 = cableCarImg;
                img2 = bridgeImg;
                scene1 = CableCarSCN;
                scene2 = BridgeSCN;
                this.sceneManager.showScene(SceneSelectionDisplay);
            }
        }
    }
}

function PoolRoomSCN() {
    this.setup = function() {
        poolRoom.play();
        chosenPath = [chosenPath + ", Pool Room"];
        image(poolRoomImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(poolRoomImg, 0, 0, width, height)
        fill(255);
        text("Pool Room", width * .7, 50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (poolRoom.isPlaying()) {
            //do nothing
        } else {
            this.draw = function() {
                place1 = 'Overpass';
                place2 = 'Cable Car';
                img1 = overpassImg;
                img2 = cableCarImg;
                scene1 = OverpassSCN;
                scene2 = CableCarSCN;
                this.sceneManager.showScene(SceneSelectionDisplay);
            }
        }
    }
}

function BridgeSCN() {
    this.setup = function() {
        bridge.play();
        chosenPath = [chosenPath + ", Bridge"];
        image(bridgeImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(bridgeImg, 0, 0, width, height)
        fill(255);
        text("Bridge", width * .7,50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (bridge.isPlaying()) {
            //do nothing
        } else {
            this.draw = function() {
                place1 = 'Gardens';
                place2 = 'Waterfront';
                img1 = gardensImg;
                img2 = waterfrontImg;
                scene1 = GardensSCN;
                scene2 = WaterfrontSCN;
                this.sceneManager.showScene(SceneSelectionDisplay);
            }
        }
    }
}

function CableCarSCN() {
    this.setup = function() {
        cableCar.play();
        chosenPath = [chosenPath + ", Cable Car"];
        image(cableCarImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(cableCarImg, 0, 0, width, height)
        fill(255);
        text("Cable Car", width * .8, 50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (cableCar.isPlaying()) {
            //do nothing
        } else {
            this.draw = function() {
                place1 = 'Gardens';
                place2 = 'Waterfront';
                img1 = gardensImg;
                img2 = waterfrontImg;
                scene1 = GardensSCN;
                scene2 = WaterfrontSCN;
                this.sceneManager.showScene(SceneSelectionDisplay);
            }
        }
    }
}

function OverpassSCN() {
    this.setup = function() {
        overpass.play();
        chosenPath = [chosenPath + ", Overpass"];
        image(overpassImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(overpassImg, 0, 0, width, height)
        fill(255);
        text("Overpass", width * .8, 50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (overpass.isPlaying()) {
            //do nothing
        } else {
            this.draw = function() {
                place1 = 'Gardens';
                place2 = 'Waterfront';
                img1 = gardensImg;
                img2 = waterfrontImg;
                scene1 = GardensSCN;
                scene2 = WaterfrontSCN;
                this.sceneManager.showScene(SceneSelectionDisplay);
            }
        }
    }
}

function WaterfrontSCN() {
    this.setup = function() {
        waterfront.play();
        chosenPath = [chosenPath + ", Waterfront"];
        image(waterfrontImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(waterfrontImg, 0, 0, width, height)
        fill(255);
        text("Waterfront", width * .8, 50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (waterfront.isPlaying()) {} else {
            this.sceneManager.showScene(Outro);
        }
    }
}

function GardensSCN() {
    this.setup = function() {
        gardens.play();
        chosenPath = [chosenPath + ", Gardens"];
        image(gardensImg, 0, 0, width, height)
        getC = get(width / 2, height / 2);
    }
    this.draw = function() {
        image(gardensImg, 0, 0, width, height)
        fill(255);
        text("Gardens", width * .8, 50);
        if (keyIsPressed === true) {
            text("Please Wait", 50, 50);
        }
        drawFFT(getC);
        if (gardens.isPlaying()) {} else {
            this.sceneManager.showScene(Outro);
        }
    }
}

function Outro() {
  //A screen congratulating the user on their Journey
  this.setup = function() {
    carrier.start();
    modulator.start();
  }
  this.draw = function() {
    background(0);
    fill(255);
    ellipse(width/2, height/2, width, height)
    fill(0);
    textSize(46);
    textAlign(CENTER)
      textStyle(NORMAL)
    text("Thank You! For Taking Part in My 'Sonic Journey'", width*.5, height*.2);
    text("Your Chosen Path Was:", width*.5, height*.45);
      textStyle(ITALIC)
    text(chosenPath, width*.5, height*.55)
        textStyle(NORMAL)
    text("Refresh the Page to Start Again", width*.5, height*.8);
  }
  //no matter what the user does they will be taken to the correct screen
  this.keyPressed = function() {
    endSynth();
  }
  this.mouseClicked = function() {
    endSynth();
  }
}

//the Scene Manager needs to handle events like KeyPressed and MouseClicked
function keyPressed() {
    mgr.handleEvent("keyPressed");
}

function mouseClicked() {
    mgr.handleEvent("mouseClicked");
    mouseClickX = mouseX;
    mouseClickY = mouseY;

    //leftover easter egg code
    // if(mouseClickX > buttonX && mouseClickX < buttonX+buttonWidth){
    //   if(mouseClickY > buttonY && mouseClickY < buttonY+buttonHeight){
    //     checkCustomButton();
    //   }
    //}
}

function SceneSelectionDisplay() {

    //Code that displays the image and text for the scene selection screens
    //initially I had all of this code at the end of each individual scene
    //but in the interest of experimenting with order, and to keep things tidy,
    //I decided to make it a scene of its own, changing global variables to dictate the action

    this.setup = function() {}

        //I only needed this code to run once each time the scene was called -
        //there's no need drawing a high-res image every frame.
        //But, the setup would only run once the first time it was called.
        //Also, the draw loop still needs to be checking if buttonClicked.
        //I had to use the untidy workaround of a simple ++counter

    this.draw = function() {

        if (notFirstTime === 0) {

          background(0);
            playSynth();
            tint(255,200)
            image(img1, 0, 0, width, height)
            image(img2, 0, height / 2, width, height)
            filter(GRAY)

            //filter(BLUR, 6);
            //I really like how the BLUR looks but my computer doesn't like loading it

            noTint();
            textSize(100);
            fill(255);
            text(place1, width * .01, height / 8)
            text(place2, width * .01, height * .6)
        }
        notFirstTime = (notFirstTime + 1);
        this.mouseClicked = function() {
            endSynth();
            notFirstTime = 0;
            this.sceneManager.showScene(SceneSelection);
        }
    }
}

function SceneSelection() {
    // this code, which is called at the completion of SceneSelectionDisplay (avove)
    //actually changes the screen to the next scene.
    //each half dictates the scene chosen
    this.draw = function() {
        textSize(46);
        if (mouseClickX < width && mouseClickY < (height / 2)) {
            this.sceneManager.showScene(scene1)
        } else if (mouseClickX < width && mouseClickY > (height / 2)) {
            this.sceneManager.showScene(scene2)
        }
    }
}

function drawFFT(imageColour) {
    //a function to draw the FFT of each sound, so that the user can look at something
    //other than a static image
    var spectrum = fft.analyze();
    noStroke();
    fill(imageColour);
    //the colour at the centre of the image is used to draw the FFT

    for (var i = 0; i < spectrum.length; i++) {
        var x = map(i, 0, spectrum.length, 0, width);
        var h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h)
    }
}

//basic functions to turn on and off the synthesised tones in the scene selection
function playSynth() {
    masterVolume(.6);
    delay.delayTime(.40);
    freq1 = random(55,220);
    freq2 = random(880, 1760)
    carrier.freq(freq1);
    wetAtmost.freq(freq2);
    carrier.start();
    modulator.start();
    wetAtmost.start();
    env1.play();
    env2.play();
}

function endSynth() {
    masterVolume(0);
    delay.delayTime(0);
    carrier.stop();
    modulator.stop();
    wetAtmost.stop();
    masterVolume(1);
}

//below (commented out) is the code for the easter eggs
//it is not fully functional, and the below is not the final version that I made
//before deciding against the idea. My decision to remove the easter egg Code
//was not one of programming or time, but was simply a user-experience decision

// var buttonState = true;
// var buttonX = 50;
// var buttonY = 50;
// var buttonWidth = 50;
// var buttonHeight = 50;

// function drawCustomButton(){
//   strokeWeight(1);
//   if (buttonState === true) {
//     fill(0,255,75);
//   }  else{
//     fill(getC);
//   }
//     ellipse(buttonWidth, buttonHeight, buttonX, buttonY);
//   //create text label
//   textSize(20);
//   fill(1);
//   text("egg", buttonX+buttonWidth/2-20, buttonY+70);
// }
//
// function checkCustomButton(){
//   buttonState = !buttonState; //flips between states
//
//   if(buttonState === false){
//     console.log("button is off")
//   }
//   else {
//     console.log("button is on")
//   }
// }
//
// function easterEgg(){
//   this.setup = function(){
//
//     adsr = new p5.Env();
//     adsr.setADSR(5,5,1,1);
//     //instantiate an osc object
//     sineOsc = new p5.Oscillator();
//     sineOsc.setType('sine');
//     //set some parameters
//     sineOsc.freq(440);
//     sineOsc.amp(1);
//     sineOsc.start();
//     console.log("easterEgg")
//   }
//   this.draw = function(){
//     if(frameCount % 60 < 60){
//
//     }
//   }
// }
