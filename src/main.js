define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    
    var GridLayout = require('famous/views/GridLayout');
    
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    Transitionable.registerMethod('spring', SpringTransition);

    var mainContext = Engine.createContext();

    var gridSize = [5, 5];
    //var buttonSize = Math.floor(100 / (gridSize[0] + gridSize[1])) + Math.floor((gridSize[0] * gridSize[1]) / (gridSize[0]));
    var buttonSize = 128;
    var grid = new GridLayout({
        dimensions: [gridSize[0], gridSize[1]],
        transition: {
            curve: 'easeInOut',
            duration: 0
        }
    });

    var surfaces = [];
    grid.sequenceFrom(surfaces);

    for(var i = 0; i < (gridSize[0] * gridSize[1]); i++) {

        // Generate a random color
        // Famo.us doesn't like colors under images, though >_<
        var bgColor = "#" + Math.random().toString(16).slice(2, 8);

        surfaces.push(new ImageSurface({
            size: [buttonSize, buttonSize],
            properties: {
                backgroundColor: bgColor,
                borderRadius: (buttonSize) + "px",
                boxShadow: '4px 4px 5px #888888'
            }
        }));


        // Generate seed for buttons to vary images from placeholder service
        var seed = Math.floor(Math.random() * ((gridSize[0] + gridSize[1]) / 2)) + 1;

        // Scatter photo types
        if ((i + 1) % 3 == 0)
            surfaces[i].setContent("http://fillmurray.com/" + (buttonSize + seed) + "/" + (buttonSize + seed));
        else if ((i + 1) % 2 == 0)
            surfaces[i].setContent("http://placebear.com/" + (buttonSize + seed) + "/" + (buttonSize + seed));
        else
            surfaces[i].setContent("http://placecorgi.com/" + (buttonSize + seed) + "/" + (buttonSize + seed));

        
    }

    // Springy Entrance
    var spring = {
        method: 'spring',
        period: 400,
        dampingRatio: 0.3
    };
    
    var stateModifier = new StateModifier({
        origin: [0.5, 0]
    });

    // Parent this modifier to the grid on the render tree
    mainContext.add(stateModifier).add(grid);

    // Set intitial position
    stateModifier.setTransform(
        Transform.translate(0, -300, 0)
    );

    // Set end position with spring bounce
    stateModifier.setTransform(
        Transform.translate(0, 0, 0), spring
    );

    /* When clicked, transpose the layout
    var toggle = false;
    Engine.on('click', function() {
        if (toggle) {
            grid.setOptions({dimensions: [gridSize[0], gridSize[1]]});
        }
        else {
            grid.setOptions({dimensions: [gridSize[1], gridSize[0]]});
        }

        toggle = !toggle;

    });

    */
});
