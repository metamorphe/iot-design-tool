'use strict';

/* Global Constants */
const CANVAS_HEIGHT = 900;
const CANVAS_WIDTH = 1440;
const DEFAULT_COLOR = '#e9e9ff';
const DEFAULT_COLOR_2= '#e74c3c';
const GREY = '#7f8c8d';
const MAX_DISTANCE = 350;
const MAX_CIRCLE_INTERVAL = 10;
const MIN_CIRCLE_INTERVAL = 10;

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

var onKeyDown = function(event) {
    switch (event.key) {
        case 'a':
            project.selectAll();
            break;
        case 'backspace':
            event.preventDefault();
            event.stopPropagation();
            project.selectedItems.forEach(function(v) {
                v.remove();
            });
            break;
        case 'escape':
            project.deselectAll();
            break;
        default:
            break;
    }
}

/* Node Tool */
var nodeTool = new paper.Tool();

nodeTool.recent = null;
nodeTool.recentCenter = null;
nodeTool.recentGroup = null;
nodeTool.recentPath = null;

nodeTool.minDistance = MAX_CIRCLE_INTERVAL;
nodeTool.maxDistance = MIN_CIRCLE_INTERVAL;
nodeTool.onKeyDown = onKeyDown;

nodeTool.onMouseDown = function(event) {
    this.recent = null;
    project.activeLayer.selected = false;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) {
        this.createNode(event.point);
    } else {
        hitResult.item.selected = true;
        this.recent = hitResult.item;
        this.recentPath = new Path();
        this.recentPath.strokeColor = '#000000';
        this.recentPath.add(event.point);
    }
    this.recentCenter = event.point;
}

nodeTool.onMouseDrag = function(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    // Draw lines on shift
    if (event.modifiers.shift && this.recentCenter) {
        var radius = this.recentCenter.getDistance(event.point);
        if (radius <= MAX_DISTANCE) {
            this.createEnergyCircle(radius);
        }
    }
    else if (recent) {
        recent.position = recent.position.add(event.delta);
    }
}

/* Utility Functions */

nodeTool.createNode = function(center) {
    var point = new Point(center);
    var circle = new Path.Circle({
        center: point,
        radius: 20,
        fillColor: DEFAULT_COLOR_2,
    });
    circle.selected = true;
    this.recent = circle;
    this.recentGroup = new Group();
}

nodeTool.createEnergyCircle = function(radius) {
    var circle = new Path.Circle({
        center: this.recentCenter,
        radius: radius,
        fillColor: { alpha: 0.0 },
        strokeColor: DEFAULT_COLOR_2,
        strokeWidth: 2
    });
    circle.strokeColor.alpha = easeAlpha(radius);

    this.recentGroup.addChild(circle);
}

/* Maps from a distance returns an alpha value from 0.0 to 1.0
 * according to an ease in ease out curve (cubic) */
var easeAlpha = function(distance) {
    return (distance <= MAX_DISTANCE)
        ? Math.pow((distance / MAX_DISTANCE), 3)
        : 0.0;
}

/* Main */
window.onload = function() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('main-canvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    paper.install(window);
    nodeTool.activate();
    paper.view.draw();

    // Load plan SVG
    project.importSVG('../assets/symbiot_plan.svg');
}
