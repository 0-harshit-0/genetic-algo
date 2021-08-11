var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
let s = new Shapes(ctx);
//var mouse = new Vector2D();
//var center = new Vector2D(canvas.width/2, canvas.height/2);

setInterval(() => {
	for (var i = 0; i < 20; i++) {
			food.push(new Vector2D(canvas.width*Math.random(), canvas.height*Math.random()));
		}
	//animation();
}, 10000000000);
addEventListener('resize', (e) => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});

let food = new Array();

class DNA {
	constructor() {
		this.genes = new Array();
		this.genes.push(Math.random());
	}
}
let tempD = new Array();
class Bloop {
	constructor(loc, dna) {
		this.dna = new DNA();

		this.pos = loc;
		this.vel = new Vector2D();
		this.r = Vector2D.map(this.dna.genes[0], 0, 1, 0, 50);
		this.maxSpd = Vector2D.map(this.dna.genes[0], 0, 1, 15, 0);
		this.off = new Vector2D(Math.random()*10, Math.random()*10);

		this.health = this.r*20;
	}
	dead() {
		if (this.health <= 0) {
			return true;
		}else {
			return false;
		}
	}
	eat() {
		for (var i = 0; i < food.length; i++) {
			let foodPos = food[i];
			let d = Vector2D.distance(this.pos, foodPos);
			if (d < this.r) {
				this.health += 10;
				food.splice(i, 1);
			}
		}
	}
	reproduce() {
		if (Math.random() < 0.001) {
			let childDna = this.dna;
			return new Bloop(this.pos, childDna); 
		}else {return null;}
	}
	draw() {
		s.circle(this.pos.x, this.pos.y, this.r);
		s.fill();
	}
	static seek(towards, p) {
		let desired = Vector2D.sub(towards, p.pos);
		desired = Vector2D.mul(Vector2D.normalize(desired), p.maxSpd);

		let steer = Vector2D.sub(desired, p.vel);
		//steer = Vector2D.limit(p.maxForce, steer);
		return steer;
	}
	update() {
		for (var i = 0; i < food.length; i++) {
			tempD.push(Vector2D.distance(food[i], this.pos));
		}
		//console.log(food[tempD.indexOf(Math.min(...tempD))])
		if (food.length) {
			this.vel = Bloop.seek(food[tempD.indexOf(Math.min(...tempD))], this);
			this.vel = Vector2D.limit(this.maxSpd/2, this.vel);
		}else {
			this.vel.x = Vector2D.map(perlin(this.off.x, 0), 0, 1, 0, this.maxSpd);
				this.vel.y = Vector2D.map(perlin(0, this.off.y), 0, 1, 0, this.maxSpd);
		}
		
		this.off.x += 0.01;
		this.off.y += 0.01;
		tempD.length = 0;

		/*

		*/

		//console.log(this.off)
		this.vel = Vector2D.limit(this.maxSpd, this.vel);

		this.pos = Vector2D.add(this.vel, this.pos);
		this.health--;
		this.draw();
	}
}
let center = new Vector2D(canvas.width*Math.random(), canvas.height*Math.random());
class World {
	constructor(num) {
		this.bloops = new Array();
		for (var i = 0; i < num; i++) {
			center = new Vector2D(canvas.width*Math.random(), canvas.height*Math.random());
			this.bloops.push(new Bloop(center));
		}
	}
	run() {
		for (var i = 0; i < food.length; i++) {
			s.box(food[i].x, food[i].y, 10, 10);
			s.fill();
		}

		for (var i = this.bloops.length - 1; i >= 0; i--) {
			let b = this.bloops[i];
			b.update();
			b.eat();
			if (b.dead()) {
				this.bloops.splice(i, 1);
				food.push(b.pos);
			}

			let child = b.reproduce();
			if(child !== null) {
				this.bloops.push(child);
			}
		}
	}
}
let wd;
(()=>{
	for (var i = 0; i < 20; i++) {
		food.push(new Vector2D(canvas.width*Math.random(), canvas.height*Math.random()));
	}
	wd = new World(10);
})();

function animation() {
	ctx.clearRect(0,0,canvas.width, canvas.height);

	wd.run();
	requestAnimationFrame(animation);
}
animation();