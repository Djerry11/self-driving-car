class NeuralNetworks {
  // Constructor to initialize the neural network with the specified neuron counts for each layer
  constructor(neuronCounts) {
    // Array to hold each level (layer) of the neural network
    this.levels = [];
    // Create levels by iterating through neuronCounts, connecting each layer to the next
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  // Static method to feedforward the inputs through the entire network
  static feedforward(givenInputs, network) {
    // Feedforward through the first level using the given inputs
    let outputs = Level.feedforward(givenInputs, network.levels[0]);
    // Feedforward through the remaining levels using the outputs of the previous level as inputs
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedforward(outputs, network.levels[i]);
    }
    // Return the final outputs after processing through all levels
    return outputs;
  }

  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

//Single level or layer of the neural network
class Level {
  // Constructor to initialize a level with a specified number of input and output neurons
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount); // Array to store inputs to the level
    this.outputs = new Array(outputCount); // Array to store outputs from the level
    this.biases = new Array(outputCount); // Array to store biases for each output neuron

    // Initialize the weights array to store the weights for connections between inputs and outputs
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }
    // Randomize the weights and biases
    Level.#randomize(this);
  }

  // Private static method to randomize weights and biases for a level
  static #randomize(level) {
    // Randomize weights between -1 and 1
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }
    // Randomize biases between -1 and 1
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  // Static method to feedforward the inputs through a single level
  static feedforward(givenInputs, level) {
    // Assign the given inputs to the level's inputs array
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    // Calculate the outputs for each neuron in the level
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      // Compute the weighted sum of inputs for the current output neuron
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      // Apply bias and activation function (simple threshold function)
      if (sum > level.biases[i]) {
        level.outputs[i] = 1; // Neuron activated (output is 1)
      } else {
        level.outputs[i] = 0; // Neuron not activated (output is 0)
      }
    }

    // Return the outputs of the level
    return level.outputs;
  }
}
