var fs = require('fs');
var synaptic = require('synaptic');
const { normalize } = require('path');

function AIEngine() {
    const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const NUMBERS = '0123456789';

    var Neuron = synaptic.Neuron,
        Layer = synaptic.Layer,
        Network = synaptic.Network,
        Trainer = synaptic.Trainer,
        Architect = synaptic.Architect;

    function Perceptron(input, hidden1, hidden2, output) {
        // create the layers
        var inputLayer = new Layer(input);
        var hiddenLayer1 = new Layer(hidden1);
        var hiddenLayer2 = new Layer(hidden2);
        var outputLayer = new Layer(output);

        // connect the layers
        inputLayer.project(hiddenLayer1);
        hiddenLayer1.project(hiddenLayer2);
        hiddenLayer2.project(outputLayer);

        // set the layers
        this.set({
            input: inputLayer,
            hidden: [hiddenLayer1, hiddenLayer2],
            output: outputLayer
        });
    }

    // extend the prototype chain
    Perceptron.prototype = new Network();
    Perceptron.prototype.constructor = Perceptron;

    function normalize(value) {
        return value / Number.MAX_VALUE;
    }
    function getHighestConfidenceIndex(list) {
        let MAX_VALUE = 0;
        let MAX_INDEX = -1;
        list.map((item, index) => {
            if (MAX_VALUE < item) {
                MAX_VALUE = item;
                MAX_INDEX = index;
            }
        });
        return {
            index: MAX_INDEX,
            confidence: MAX_VALUE
        }
    }
    function input(userId) {
        const time = normalize(new Date().getTime());
        const random = Math.random();
        return [time, random, userId];
    }
    function getPerceptron(mode) {
        var myPerceptron = null;
        if (mode == 'alpha') {
            var data = fs.readFileSync(process.cwd()+`/src/data/train-${mode}.data`);
            if (data.toString()) {
                myPerceptron = Network.fromJSON(JSON.parse(data));
            } else {
                myPerceptron = new Perceptron(3, 52, 52, 26);
            }
        } else {
            var data = fs.readFileSync(process.cwd()+`/src/data/train-${mode}.data`);
            if (data.toString()) {
                myPerceptron = Network.fromJSON(JSON.parse(data));
            } else {
                myPerceptron =  new Perceptron(3, 20, 20, 10);
            }
        }
        return myPerceptron;
    }
    function saveTrainingData(network, mode) {
        fs.writeFile(process.cwd()+`/src/data/train-${mode}.data`,JSON.stringify(network.toJSON()),function(data){
            console.log("feedback written ");
        });
    }
    function predictAlphabet(userId) {
        var myPerceptron = getPerceptron('alpha');
        const myInput = input(userId);
        const confList = myPerceptron.activate(myInput);
        const p = getHighestConfidenceIndex(confList);
        let pred = {
            text: ALPHABETS[p.index],
            confidence: p.confidence,
            data: myInput.join("|")
        };
        return pred;

    }
    function predictNumber(userId) {
        var myPerceptron = getPerceptron('number');
        const myInput = input(userId);
        const confList = myPerceptron.activate(myInput);
        const p = getHighestConfidenceIndex(confList);
        let pred = {
            text: NUMBERS[p.index],
            confidence: p.confidence,
            data: myInput.join("|")
        };
        return pred;

    }
    function getNumberConfidenceList(text) {
        return NUMBERS.split("").map((item, key) => {
            return item == text ? 1 : 0;
        });
    }
    function getAlphaConfidenceList(text) {
        return ALPHABETS.split("").map((item, key) => {
            return item == text ? 1 : 0;
        });
    }
    function recordFeedbackAlpha(pText, pActual, pData, userId) {
        var myPerceptron = getPerceptron('alpha');
        var myTrainer = new Trainer(myPerceptron);
        myTrainer.train([{ input: pData.split("|"), output: getAlphaConfidenceList(pActual) }]);
        saveTrainingData(myPerceptron, 'alpha');
    }
    function recordFeedbackNumber(pText, pActual, pData, userId) {
        var myPerceptron = getPerceptron('number');
        var myTrainer = new Trainer(myPerceptron);
        myTrainer.train([{ input: pData.split("|"), output: getNumberConfidenceList(pActual) }]);
        saveTrainingData(myPerceptron, 'number');
    }
    return {
        predict: function (mode, userId) {
            if (mode == 'alpha') {
                const pred = predictAlphabet(userId) || {};
                return {
                    prediction: {
                        text: pred.text,
                        confidence: pred.confidence,
                        data: pred.data
                    },
                    code: 0,
                    msg: 'Successfully Predicted Alphabet !'
                };
            }
            else if (mode == 'number') {
                const pred = predictNumber(userId) || {};
                return {
                    prediction: {
                        text: pred.text,
                        confidence: pred.confidence,
                        data: pred.data
                    },
                    code: 0,
                    msg: 'Successfully Predicted Number !'
                };
            } else {
                return {
                    prediction: {},
                    code: -1,
                    msg: 'Prediction Failed !'
                };
            }
        },
        feedback: function (mode, feedback, userId) {
            //feedback = prediction:actual:time
            feedback = feedback.split("|");
            const pText = feedback[0];
            const pActual = feedback[1];
            const pData = feedback[2];
            if (mode == 'alpha') {
                recordFeedbackAlpha(pText, pActual, pData, userId);
                return {
                    code: 0,
                    msg: 'Successfully Registered Feedback !'
                };
            }
            else if (mode == 'number') {
                recordFeedbackNumber(pText, pActual, pData, userId);
                return {
                    code: 0,
                    msg: 'Successfully Registered Feedback !'
                };
            } else {
                return {
                    code: -1,
                    msg: 'Feedback Failed To Register!'
                };
            }
        },
    }
}

module.exports = AIEngine;