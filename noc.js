var p = document.querySelector('#p');


var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

//var mouse = new Vector2D();
//var center = new Vector2D(canvas.width/2, canvas.height/2);
var mouse = new Vector2D();
addEventListener('mousemove', (e)=>{
	mouse.x = e.x;
	mouse.y = e.y;
});
addEventListener("keypress", (e) => {
	if (e.key == 'a') {
		draw();
	}
	//animation();
});
addEventListener('resize', (e) => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});

let shape = new Shapes(ctx);
var count=0;
let lifetime, lifeCounter;
let target = new Vector2D(canvas.width/2, canvas.height/2);
let mutationRate = 0.1;

class Obstacles {
	constructor(mass) {
		this.pos = new Vector2D(canvas.width/2-70, canvas.height/2+200);
		this.w = 150;
		this.h=10;
	}
	collide(v) {
		if (v.pos.x > this.pos.x && v.pos.x < this.pos.x + this.w && v.pos.y > this.pos.y && v.pos.y < this.pos.y + this.h) {
			return true;
		}else {
			return false;
		}
	}
	draw() {
		shape.box(this.pos.x, this.pos.y, this.w, this.h);
		shape.fill();
	}
}

class Rockets {
	constructor(mass) {
		this.pos = new Vector2D(canvas.width/2, canvas.height-30);
		this.vel = new Vector2D();
		this.acc = new Vector2D((Math.random()-0.5), (Math.random()-0.5));

		this.w = 20;
		this.m = mass;

		this.dna = new DNA();
		this.fitness = 0;
		
		this.stop = false;
		this.time = 0;
		this.hit = false;
	}
	fit() {
		let d = Vector2D.distance(target, this.pos);
		this.fitness = (1/d)**2;
		if (d == 10) {
			this.fitness *= 10;
		}
		if (this.stop) {
			this.fitness /=2;
		}
		if (this.pos.x > canvas.width || this.pos.x < 0 || this.pos.y > canvas.height || this.pos.y < 0) {
			this.fitness /=2;
		}
	}
	draw() {
		ctx.save();
		let theta = Math.atan2(this.vel.y, this.vel.x);
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(theta);
		shape.box(0, 0, this.w, 10);
		shape.fill('black');
		ctx.restore();
	}
	update() {
		if (this.dna.genes[lifeCounter] !== undefined) {
			this.acc = Vector2D.div(this.dna.genes[lifeCounter], this.m);
		}
		
		//this.acc = this.dna.genes[count];
		this.vel = Vector2D.add(this.vel, this.acc);
		this.vel = Vector2D.setMag(2, this.vel);
		this.pos = Vector2D.add(this.pos, this.vel);

		this.time++;
		this.draw();
	}
}

class DNA {
	constructor() {
		this.genes = new Array(lifetime);
		this.maxForce = 0.1;

		for (var i = 0; i < this.genes.length; i++) {
			this.genes[i] = new Vector2D((Math.random()-0.5), (Math.random()-0.5));
		}
	}
	gen() {
		
		return this.genes;
	}
	pheno() {
		let ta = this.genes.join('');
		if (ta == target) {
			clearInterval(inter);
		}
		return ta;
	}
	static crossover(x, y) {
		let child = new Rockets(1);
		for (var i = 0; i < child.dna.genes.length; i++) {
			if (i < 25) {
				child.dna.genes[i] = x.dna.genes[i];
			}else {
				child.dna.genes[i] = y.dna.genes[i];
			}
		}
		return child;
	}
	static mutation(t) {
		for (var i = 0; i < t.dna.genes.length; i++) {
			if (Math.random() < mutationRate) {
				t.dna.genes[i] = new Vector2D((Math.random()-0.5), (Math.random()-0.5));
			}
		}
		return t;
	}
}

let obs = new Obstacles();
class Population {
	constructor() {
		this.populationArray = new Array();
		this.matingpool= new Array();
		this.generation = 0;

		for (var i = 0; i < 50; i++) {
			this.populationArray.push(new Rockets(1));
		}
		//console.log(this.populationArray);
	}
	makefit() {

		for (var i = 0; i < this.populationArray.length; i++) {
			this.populationArray[i].fit();
		}
	}
	selection() {
		for (var i = 0; i < this.populationArray.length; i++) {
			let n = this.populationArray[i].fitness * 10;
			for (var j = 0; j < n; j++) {
				this.matingpool[j] = this.populationArray[i];
			}
		}
	}
	reproduce() {
		for (var i = 0; i < this.populationArray.length; i++) {
			let a = this.matingpool[Math.floor(Math.random()*this.matingpool.length)];
			let b = this.matingpool[Math.floor(Math.random()*this.matingpool.length)];

			let c = DNA.crossover(a, b);
			c = DNA.mutation(c);
			this.populationArray[i] = c;
		}
	}
	live() {
		for (var i = 0; i < this.populationArray.length; i++) {
			this.populationArray[i].stop = false;//obs.collide(this.populationArray[i]);
			if (!this.populationArray[i].stop) {
				this.populationArray[i].update();
			}
		}
	}
}


/*let rockArray = new Array();
(()=>{
	
	for (var i = 0; i < 10; i++) {
		rockArray[i] = new Rockets(-Math.random()+0.5, -Math.random(), 1);
	}
})();*/
var pop = new Population();
lifeCounter = 0;
lifetime = 300;
var inter;
function animation() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	shape.circle(target.x, target.y, 10);
	ctx.fill();

	
	if (lifeCounter < lifetime) {
		pop.live();
		lifeCounter++;
	}else {
		lifeCounter = 0;
		count=0;
		pop.makefit();
		pop.selection();
		pop.reproduce();
		//console.log(1);
	}

	ctx.setTransform(1,0,0,1,0,0);
	//obs.draw();

	inter = requestAnimationFrame(animation);
}
animation();
