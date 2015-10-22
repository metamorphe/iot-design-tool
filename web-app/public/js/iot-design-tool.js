/* Constants and Globals */
DEFAULT_COLOR = '#e9e9ff';

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

var recent;
var recentCenter;

/* Node Tool */
var nodeTool = new paper.Tool();
nodeTool.onMouseDown = function(event) {
    recent = null;
    project.activeLayer.selected = false;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (true) { // was if (!hitResult)
        var point = new Point(event.point);
        var circle = new Path.Circle({
            center: point,
            radius: 20,
            fillColor: DEFAULT_COLOR,
        });
        circle.selected = true;
        recent = circle;
        //$scope.nodeGroup.addChild(circle);
    } else {
        hitResult.item.selected = true;
        recent = hitResult.item;
        recentPath = new Path();
        recentPath.strokeColor = '#000000';
        recentPath.add(event.point);
    }
    recentCenter = event.point;
}

nodeTool.onMouseDrag = function(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    // Draw lines on shift
    if (event.modifiers.shift && recentCenter) {
        var circle = new Path.Circle({
            center: recentCenter,
            radius: recentCenter.getDistance(event.point),
            fillColor: {alpha: 0.0 },
            strokeColor: DEFAULT_COLOR,
            strokeWidth: 1
        });
    }
    else if (recent) {
        recent.position = recent.position.add(event.delta);
    }
}
nodeTool.minDistance = 20;
nodeTool.onKeyDown = onKeyDown;

/* Main */
window.onload = function() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('main-canvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    paper.install(window);
    nodeTool.activate();
    paper.view.draw();
}
