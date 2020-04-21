const p5 = require("p5");
const Tone = require("tone");
const StartAudioContext = require("startaudiocontext");

const synth = new Tone.OmniOscillator("C3", "sine").toMaster(); //same as oscillator
StartAudioContext(Tone.context);

// Model URL
// If you make your own model, this is where you'd link to it. This is a model
// that I trained on making "heart hands", like this
// https://image.shutterstock.com/image-photo/woman-making-heart-her-hands-600w-1211985307.jpg
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/CdVet8-At/';

// Whether or not you want to flip the video horizontally. If you trained your model
// using your webcam, then you'll want to enable this
const flipVideo = true;
const width = 800;
const height = 600;

const p5draw = (p) => {
    
    let classifier;
    let p5video;
    let offscreenGraphics;
    let label = "";

	p.setup = () => {
		p.createCanvas(width, height);
		p.background(255);

		p5video = p.createCapture(p.VIDEO);
		p5video.size(width, height);
        p5video.hide();

        // We'll use this offscreen canvas to store the video, in case we
        // want to transform it before classifying it
        offscreenGraphics = p.createGraphics(width, height);
        offscreenGraphics2 = p.createGraphics(width, height);
        
        classifier = ml5.imageClassifier(imageModelURL + 'model.json', classifyVideo);
	}

	p.draw = () => {
        // This draws the video with X and Y flipped
        offscreenGraphics.push();
        if (flipVideo) {
            offscreenGraphics.translate(width, 0);
            offscreenGraphics.scale(-1, 1);
        }
        offscreenGraphics.image(p5video, 0, 0, width, height);
        offscreenGraphics.pop();

        p.image(offscreenGraphics, 0, 0, p.width, p.height);

        // Draw the label
        p.fill(255);
        p.textSize(16);
        p.textAlign(p.CENTER);
        p.text(label, width / 2, height - 4);
    }

      // Get a prediction for the current video frame
    function classifyVideo() {
        classifier.classify(offscreenGraphics, gotResult);
    }
    
    function gotResult(error, results) {
        if (error) {
            console.error(error);
            return;
        }

        //tone.js here

        label = results[0].label;

        if (label === "Low"){
            synth.frequency.value = "C5";
            synth.start();
        }else if (label === "Middle"){
            synth.frequency.value = "D5";
            synth.start();
        }else if (label === "High"){
            synth.frequency.value = "E5";
            synth.start();
        }else if (label === "Sine"){
            synth.type = "sine";
        }else if (label === "Saw"){
            synth.type = "fatsawtooth";
            synth.count = 6;
            synth.spread = 40;
            synth.volume.value = -4;
            synth.partials = [1, 0.5, 0.2, 0.1];
        }else{
            synth.frequency.value = "0";
            synth.stop();
        }

        classifyVideo();
    }
}

module.exports = function setup() {
	const myp5 = new p5(p5draw, "main");
}

