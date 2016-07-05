 var PSController = {

	/* order for valuesArray:
	
	(joysticks)
	left joystick vertical, left joystick horizontal,	[0,1]
	right joystick vertical, right joystick horizontal,	[2,3]

	select button, start buttons 						[4,5]

	(d pad)
	dpad up, dpad right, dpad down, dpad left,			[6,7,8,9]

	(shape buttons)
	triangle, circle, x, square,						[10,11,12,13]

	(triggers)
	left trigger, right trigger,						[14,15]

	(bumpers)
	left bumber, right bumpers 							[16,17]

	*/

	PS3: [
		1,0,3,2,
		0,3,
		4,5,6,7,
		12,13,14,15,
		8,9,
		10,11
	],

	PS2: [],

	/* 
	running this method will start the the system using the given controller values.
	reference the controller values like so (inside your code):

	...
	
	PSController.startController(PSController.PS3); // starts controller
	pad1.axis(PSController.LEFT_JOYSTICK_VERTICAL); // returns that joystick value
	pad1.getButton(PSController.DPAD_UP); // returns that button value
	
	...

	*/

	
	startController: function(valuesArray) {
		this.LEFT_JOYSTICK_VERTICAL = valuesArray[0];
		this.LEFT_JOYSTICK_HORIZONTAL = valuesArray[1];
		this.RIGHT_JOYSTICK_VERTICAL = valuesArray[2];
		this.RIGHT_JOYSTICK_HORIZONTAL = valuesArray[3];

		this.SELECT = valuesArray[4];
		this.START = valuesArray[5];

		this.DPAD_UP = valuesArray[6];
		this.DPAD_RIGHT = valuesArray[7];
		this.DPAD_DOWN = valuesArray[8];
		this.DPAD_LEFT = valuesArray[9];

		this.TRIANGE = valuesArray[10];
		this.CIRCLE = valuesArray[11];
		this.X = valuesArray[12];
		this.SQUARE = valuesArray[13];

		this.LEFT_TRIGGER = valuesArray[14];
		this.RIGHT_TRIGGER = valuesArray[15];

		this.LEFT_BUMPER = valuesArray[16];
		this.RIGHT_BUMPER = valuesArray[17];

		
		return this;
	}

}