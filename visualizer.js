// class Visualizer {
//   static drawNetwork(ctx, network) {
//     const margin = 50;
//     const left = margin;
//     const top = margin;
//     const width = ctx.canvas.width - margin * 2;
//     const height = ctx.canvas.height - margin * 2;

//     const levelHeight = height / network.levels.length;
//     for (let i = network.levels.length - 1; i >= 0; i--) {
//       const levelTop =
//         top +
//         lerp(
//           height - levelHeight,
//           0,
//           network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
//         );
//       ctx.setLineDash([7, 3]);
//       Visualizer.drawLevel(
//         ctx,
//         network.levels[i],
//         left,
//         levelTop,
//         width,
//         levelHeight,
//         i == network.levels.length - 1 ? ["F", "L", "R", "B"] : []
//       );
//     }
//   }
//   static drawLevel(ctx, level, left, top, width, height, outputsLabel) {
//     const right = left + width;
//     const bottom = top + height;

//     const { inputs, outputs, weights, biases } = level;

//     const nodeRadius = 16;
//     for (let i = 0; i < inputs.length; i++) {
//       for (let j = 0; j < outputs.length; j++) {
//         ctx.beginPath();
//         ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
//         ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
//         ctx.lineWidth = 2;
//         ctx.strokeStyle = getRGBA(weights[i][j]);
//         ctx.stroke();
//       }
//     }
//     for (let i = 0; i < inputs.length; i++) {
//       const x = Visualizer.#getNodeX(inputs, i, left, right);
//       ctx.beginPath();
//       ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
//       ctx.fillStyle = "black";
//       ctx.fill();

//       ctx.beginPath();
//       ctx.arc(x, bottom, nodeRadius * 0.8, 0, Math.PI * 2);
//       ctx.fillStyle = getRGBA(inputs[i]);
//       ctx.fill();
//     }
//     for (let i = 0; i < outputs.length; i++) {
//       const x = Visualizer.#getNodeX(outputs, i, left, right);
//       ctx.beginPath();
//       ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
//       ctx.fillStyle = "black";
//       ctx.fill();

//       ctx.beginPath();
//       ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
//       ctx.fillStyle = getRGBA(outputs[i]);
//       ctx.fill();

//       ctx.beginPath();
//       ctx.lineWidth = 2;
//       ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
//       ctx.strokeStyle = getRGBA(biases[i]);
//       ctx.setLineDash([3, 3]);
//       ctx.stroke();
//       ctx.setLineDash([]);

//       if (outputsLabel[i]) {
//         ctx.beginPath();
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillStyle = "white";
//         ctx.fillStroke = "black";
//         ctx.font = nodeRadius * 1.5 + "12px Arial";
//         ctx.fillText(outputsLabel[i], x, top + nodeRadius * 0.1);
//         ctx.lineWidth = 0.5;
//         ctx.strokeText(outputsLabel[i], x, top + nodeRadius * 0.1);
//       }
//     }
//   }
//   static #getNodeX(nodes, index, left, right) {
//     return lerp(
//       left,
//       right,
//       nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
//     );
//   }
// }
class Visualizer {
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;
    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
        );
      ctx.setLineDash([7, 3]);
      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? ["↑", "←", "→", "↓"] : []
      );
    }
  }
  static drawLevel(ctx, level, left, top, width, height, outputsLabel) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    const nodeRadius = 20;
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        const startX = Visualizer.#getNodeX(inputs, i, left, right);
        const endX = Visualizer.#getNodeX(outputs, j, left, right);
        const gradient = ctx.createLinearGradient(startX, bottom, endX, top);
        gradient.addColorStop(0, getRGBA(weights[i][j], 0.1));
        gradient.addColorStop(1, getRGBA(weights[i][j]));
        ctx.moveTo(startX, bottom);
        ctx.lineTo(endX, top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
    }
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow blur for next elements
    }
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow blur for next elements

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputsLabel[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.5;
        ctx.font = `bold ${nodeRadius}px Arial`;
        ctx.fillText(outputsLabel[i], x, top);
        ctx.strokeText(outputsLabel[i], x, top);
      }
    }
  }
  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}

// function lerp(a, b, t) {
//   return a + (b - a) * t;
// }

// function getRGBA(value, alpha = 1) {
//   const R = value >= 0 ? 0 : 255;
//   const G = R;
//   const B = value <= 0 ? 0 : 255;
//   const A = Math.abs(value) * alpha;
//   return `rgba(${R}, ${G}, ${B}, ${A})`;
// }
