Lander = function() { 
	
	var vel = this.vel = new Vector2(0, 0),
		pos = this.pos = new Vector2(0,0),
		bottomLeft = this.bottomLeft = new Vector2(0,0),
		bottomRight = this.bottomRight = new Vector2(0,0), 
		centerPos = this.centerPos = new Vector2(0, 0),
		thrustVec = new Vector2(0,0),
		gravity = 0.0005,
		thrustAcceleration = 0.0015,
		thrustBuild = 0,
		topSpeed = 0.35, 
		drag = 0.9997, 
		bouncing = 0, 
		exploding = false, 
		targetRotation = 0,
		
		lastRotationTime = 0, 
		animation_offset = 0,
		abortCounter = -1;  
	this.isthrusting = false;
	this.socketImg = new Image();
	this.socketImg.src="Assets/SpaceXShuttle/SpaceXShuttle.png";
	this.socket_noflameImg = new Image();
	this.socket_noflameImg.src = "Assets/SpaceXShuttle/SpaceXShuttle_noflame.png"
	this.rotation = 0; 
	this.thrusting = 0;
	this.width = 0;
	this.altitude = 0;
	this.active = true; 
	this.fuel = 0; 
	this.scale = 0.8; 
	this.left = 0; 
	this.right = 0; 
	this.bottom = 0; 
	this.top = 0; 
	this.colour = 'white';
	var shapes = this.shapes = [],
		shapePos = this.shapePos = [],
		shapeVels = this.shapeVels = []; 
	this.thrustLevel=0; 
	this.flameImg = [];
	
	var reset = this.reset = function () { 
	
		abortCounter = -1; 
		lastAbort = Date.now(); 
		vel.reset(0.415, 0); 
		pos.reset(110,150); 
		this.rotation = targetRotation = -90; 
		scale = 1; 
		thrustBuild = 0; 
		bouncing = 0; 
		this.active = true; 
		exploding = false; 
		for(var i=0; i<shapePos.length; i++) { 
			shapePos[i].reset(0,0); 
		}
		this.thrusting = 0; 
		
	};
		
	reset(); 
	for(i = 0; i < 30; i++){
		this.flameImg[i] = new Image();
		this.flameImg[i].src =  "Assets/SpaceXShuttle/Animation type2/SpaceXShuttle"+(i+1)+".png";
	}

	
	this.rotate = function(direction) { 
		var now = new Date().getTime(); 
		if(now - lastRotationTime > 80) {
			
			targetRotation+=direction*15; 
			targetRotation = clamp(targetRotation, -90, 90); 
			
			lastRotationTime = now; 
		}
		
	};
	this.setRotation = function(angle) { 
		
		targetRotation = Math.round(clamp(angle, -90, 90)/10)*10; 
		
		
	}
	
	this.thrust = function (power) { 
		this.thrusting = power; 
		
		//this.thrustBuild = power; 
		
	};
	this.abort = function() {
		var now = Date.now(); 
		
		if(now-lastAbort > 10000) { 
		 
			abortCounter = 100;
			lastAbort = now; 
		} 
	}
	//drop a bomb
	this.shoot = function(){

		if(missiles.length == 0){
			missiles[0] = new Missile(vel.x, vel.y, pos.x, pos.y);
			
		}else if(missiles.length == 1){
			missiles[1] = new Missile(vel.x, vel.y, pos.x, pos.y);
		}
		
		
	}

	this.update = function() { 

		this.centerPos.x = (this.pos.x + this.bottomRight.x) / 2;
		this.centerPos.y = (this.pos.y + this.bottomRight.y) / 2;
		this.width = Math.abs(this.pos.x - this.bottomRight.x);
	
		counter++; 
		
		this.rotation += (	targetRotation-this.rotation)*0.3;
		if(Math.abs(this.rotation-targetRotation)<0.1) this.rotation = targetRotation; 
		
		if(exploding) this.updateShapesAnimation(); 
		
		if(this.active) { 
			
			if(abortCounter>-1) { 
				 
				targetRotation = 0; 
					
				
				if(this.fuel>0) thrustBuild = 3; 
				abortCounter --; 
				this.fuel-=1; 
				
			}
			
			if(this.fuel<=0) this.thrusting = 0; 
		
			thrustBuild += ((this.thrusting-thrustBuild)*0.2);
		
			if(thrustBuild>0) { 
				thrustVec.reset(0,-thrustAcceleration*thrustBuild*20); 
				thrustVec.rotate(this.rotation); 
				vel.plusEq(thrustVec); 
				this.fuel -= (0.2 * thrustBuild);
			}
	
			pos.plusEq(vel); 
			vel.x*=drag; 
			vel.y+=gravity*12; 
			if(vel.y>topSpeed) velY=topSpeed; 
			else if (vel.y<-topSpeed) velY=-topSpeed; 
		
			this.left = pos.x-(10*this.scale); 
			this.right = pos.x+(10*this.scale); 
			this.bottom = pos.y+(14*this.scale); 
			this.top = pos.y-(5*this.scale); 
			bottomLeft.reset(this.left, this.bottom); 
			bottomRight.reset(this.right, this.bottom); 
			
		} else if (bouncing>0) {
			
			pos.y  += Math.sin(bouncing)*0.07; 
			bouncing -= Math.PI / 20;
			
		}
		if(this.fuel<0) this.fuel = 0; 
		
		this.thrustLevel = thrustBuild;
		
	};
	
	this.render = function(c, scale) { 
		c.save(); 
		
		
		c.translate(pos.x, pos.y); 
		c.scale(this.scale,this.scale); 
		
		c.rotate(this.rotation * TO_RADIANS); 
		c.strokeStyle = this.colour; 
	
	
		//test git
		
		c.fillStyle = "red";
		c.strokeStyle = "black";
	
	
		if(this.isthrusting&&this.active) {
			c.drawImage(this.flameImg[animation_offset],-11, -16,70/3,150/3);
		
			animation_offset ++;
			animation_offset = animation_offset%30;
		
			
		} else {
			
			c.drawImage(this.socket_noflameImg,-11, -16,70/3,100/3);

		}

		
		
		
		
		c.stroke(); 
		
		c.restore(); 
		
		
		 
	};
	this.crash = function () { 
		boomEffects[boomLength++] = new BoomEffect(lander.pos);
		this.rotation = targetRotation = 0; 
		this.active = false; 
		exploding = true; 
		thrustBuild = 0; 
		
	};
	this.land = function () { 
		this.active  =false; 
		thrustBuild = 0; 
	};
	this.makeBounce = function() { 
		bouncing = Math.PI*2;	
		
	};
	
	this.defineShape = function(){
		
		var m='m',
			l='l',
			r='r', 
			cp='cp'; 
		
	
		var min = 2.6, max = 5; 
		var shape = []; 
			
		shape.push(m, min, -max); 
		shape.push(l, max, -min); 
		shape.push(l, max, min); 
		shape.push(l, min, max); 
		shape.push(l, -min, max); 
		shape.push(l, -max, min); 
		shape.push(l, -max, -min); 
		shape.push(l, -min, -max);
		shape.push(cp); 
		
		shapes.push(shape); 
		shapeVels.push(new Vector2(1,-2.5)); 
		
		shapes.push([r, -6,5,12,2]); 
		shapeVels.push(new Vector2(2,-1.5)); 
		
		shape = []; 
		// left leg
		shape.push(m, -5, 7.5); 
		shape.push(l, -9, 13); 
		shape.push(m, -11, 13); 
		shape.push(l, -7, 13); 
		shapes.push(shape); 
		shapeVels.push(new Vector2(0,-3)); 
		
		shape = []; 
		// right leg
		shape.push(m,5,7.5); 
		shape.push(l,9,13); 
		shape.push(m,11,13); 
		shape.push(l,7,13);	
		shapes.push(shape); 
		shapeVels.push(new Vector2(3,-1)); 
		
		shape = [];
		//thruster left
		shape.push(m,-3,7.5); 
		shape.push(l,-5,12); 
		shape.push(l,-4.5,13);
		shapes.push(shape); 
		shapeVels.push(new Vector2(1,-1)); 
	
		shape = [];		
		// thruster right  
		shape.push(m,3,7.5); 
		shape.push(l,5,12); 
		shape.push(l,4.5,13); 
		shapes.push(shape); 
		shapeVels.push(new Vector2(2.5,-1)); 

		shape = [];			
		// thruster bottom
		shape.push(m,4,11); 
		shape.push(l,-4,11); 
		shapes.push(shape); 
		shapeVels.push(new Vector2(2,-0.5)); 
		
		for(var i=0; i<shapes.length; i++) { 
			shapePos.push(new Vector2(1,-0.5)); 
		}
		
	};
	this.defineShape(); 
	
	this.updateShapesAnimation = function() { 
		if(!exploding) return; 
		
		for (var i=0; i<shapePos.length; i++) { 
		 	shapePos[i].plusEq(shapeVels[i]); 
		}
		
	};
	
	this.renderShapes = function(c) { 
		
		var shapes = this.shapes, 
			shapePos = this.shapePos, 
			shapeVels = this.shapeVels; 
		
		for (var i=0; i<shapes.length; i++) { 
			var s = shapes[i].slice(0); 
			
			c.save(); 
			c.translate(shapePos[i].x, shapePos[i].y); 
			//if(exploding) shapePos[i].plusEq(shapeVels[i]); 
			//console.log(i, shapePos[i], shapeVels[i]); 
			
			while(s.length>0) { 
				
				var cmd = s.shift(); 
				switch(cmd) {
					
					case 'm': 
					c.moveTo(s.shift(), s.shift()); 
					break; 
					
					case 'l': 
					c.lineTo(s.shift(), s.shift()); 
					break; 
					
					case 'cp': 
					c.closePath(); 
					break; 
				
					case 'r' : 
					c.rect(s.shift(), s.shift(), s.shift(), s.shift()); 
					break; 
					
					default : 
					console.log ('bad command!'); 
				}
				
			}
			c.restore(); 
			
			
		}
		
		
		
		
	};
	
};