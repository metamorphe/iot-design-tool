# This imports all the layers for "symbiot_2.0" into symbiot_20Layers
symbiot_20Layers = Framer.Importer.load "imported/symbiot_2.0"

defaultX = {}
defaultY = {}

for layerName of symbiot_20Layers
	window[layerName] = symbiot_20Layers[layerName]
	defaultX[window[layerName].name] = window[layerName].x
	defaultY[window[layerName].name] = window[layerName].y

for layerName of symbiot_20Layers
	symbiot_20Layers[layerName].originalFrame = window[layerName].frame
	
SCREEN_WIDTH = 1440
SCREEN_HEIGHT = 900


### Utility functions ###

stage = (screen) ->
	for layer in screen
		layer.x = defaultX[layer.name]
		layer.y = defaultY[layer.name]
	
destage = (screen) ->
	for layer in screen
		layer.x = -SCREEN_WIDTH
		layer.y = defaultY[layer.name]

animateOff = (screen, direction) ->
	for layer in screen
		xVal = layer.x
		yVal = layer.y
		switch direction
			when "left" then xVal = -SCREEN_WIDTH
			when "right" then xVal = SCREEN_WIDTH
			when "up" then yVal = -SCREEN_HEIGHT
			when "down" then yVal = SCREEN_HEIGHT
			else null
			
		layer.animate
			properties:
				x: xVal
				y: yVal
			curve: "ease"
			time: 1
			
animateOn = (screen, direction) ->
	switch direction
		when "left" then rightStage screen
		when "right" then destage screen
		when "up" then throw Exception("Not yet implemented.")
		when "down" then throw Exception("Not yet implemented.")
	for layer in screen			
		layer.animate
			properties:
				x: defaultX[layer.name]
				y: defaultY[layer.name]
			curve: "ease"
			time: 1
			
makeScreen = (layerList) ->
	return layerList
			
### Screen setup ###

perspectiveScreen = makeScreen [bgPerspective]
planScreen = makeScreen [bgPlan]
controlScreen = [ctrlBg, ctrlBtnPerspective, ctrlBtnPlan, ctrlList,
					ctrlCurrent, ctrlRun]
scriptScreen = makeScreen [script]

destage planScreen

### Handlers ###

deviceList = []

ctrlBtnPerspective.on Events.Click, ->
	destage planScreen
	stage perspectiveScreen

ctrlBtnPlan.on Events.Click, ->
	destage perspectiveScreen
	stage planScreen
	

script.draggable.enabled = true
script.draggable.momentum = false
script.draggable.overdrag = false
script.draggable.constraints = {
	x: 0
	y: 0
	width: 1188
	height: 900
}

ctrlList.on Events.Click, ->
	device = new Layer
		width: 50
		height: 50
		backgroundColor: '#28affa'
		borderRadius: 25
	device.style =
		'text-align' : 'center'
		'font-size' : '20px'
	device.html = device.id
	device.draggable.enabled = true
	device.draggable.momentum = false
	device.draggable.overdrag = false
	device.draggable.constraints = {
		x: 0
		y: 0
		width: 1188
		height: 900
	}
	deviceList.append device
	
# TODO: actuation/run
		
	