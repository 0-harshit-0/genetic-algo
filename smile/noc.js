var p = document.querySelector('#p');


var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight-50;

addEventListener('resize', (e) => {
	canvas.width = innerWidth;
	canvas.height = innerHeight-50;
});


let len = 20;
let population = new Array(6);
let matingpool = new Array();
let temp = new Array();

class DNA {
	constructor() {
		this.genes = new Array(len);
		this.fit = 1;
	}
	fill() {
		for (var i = 0; i < len; i++) {
			this.genes[i] = Math.random();
		}
	}
	fitness() {
		this.fit = 1;
	}
	static reproduce() {
		let ab = new Vector2D(Math.floor(Math.random()*matingpool.length), Math.floor(Math.random()*matingpool.length));
		let parent = new Vector2D(matingpool[ab.x], matingpool[ab.y]);

		let child = new Face();
		for (var i = 0; i < len; i++) {

			if (i <= Math.floor(size*Math.random())) {
				//console.log(parent.x.genes)
				child.dna.genes[i] = parent.x.dna.genes[i];
			}else {
				child.dna.genes[i] = parent.y.dna.genes[i];
			}
		}
		
		temp.push(child);

	}
}
let s = new Shapes(ctx);
class Face {
	constructor() {
		this.dna = new DNA();
		this.dna.fill();
	}
	draw() {
		let gene = this.dna.genes;
		let r = Vector2D.map(gene[0], 0, 1, 0, 70);
		let c = `rgba(${gene[1]*255}, ${gene[2]*255}, ${gene[3]*255},1`;

		let eye = new Vector2D(Vector2D.map(gene[5], 0, 1, 0, 5), Vector2D.map(gene[4], 0, 1, 0, 20));
		let eyeSize = Vector2D.map(gene[5], 0, 1, 0, 10);
		let eyeC = `rgba(${gene[4]*255}, ${gene[5]*255}, ${gene[6]*255},1`;

		let mouthC = `rgba(${gene[7]*255}, ${gene[8]*255}, ${gene[9]*255},1`;
		let mouth = new Vector2D(Vector2D.map(gene[5], 0, 1, -25, 25), Vector2D.map(gene[4], 0, 1, 0, 25));
		let mouthW = Vector2D.map(gene[5], 0, 1, 0, 50);
		let mouthH = Vector2D.map(gene[5], 0, 1, 0, 10);

		s.circle(0, 0, r);
		s.fill(c);

		s.circle(eye.x, 0, eyeSize);
		s.fill(eyeC);
		s.circle(eye.y, 0, eyeSize);
		s.fill(eyeC);

		s.box(mouth.x, mouth.y, mouthW, mouthH);
		s.fill(mouthC);

	}

}
//let ccc = new Face();
(()=> {
	for (var i = 0; i < 6; i++) {
		population[i] = new Face();
	}
})();
function animation() {
	matingpool= new Array();
	temp = new Array ();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	
	ctx.clearRect(0,0,canvas.width, canvas.height);

	population.forEach(x=> {
		for (var j = 0; j < x.dna.fit*10; j++) {
			//console.log(x.dna.fit);
			matingpool.push(x);
		}
	});
	
	population.forEach(r => {
		let ab = new Vector2D(Math.floor(Math.random()*matingpool.length), Math.floor(Math.random()*matingpool.length));
		let parent = new Vector2D(matingpool[ab.x], matingpool[ab.y]);
		//console.log(parent)
		let child = new Face();
		for (var i = 0; i < len; i++) {

			if (i <= Math.floor(len*Math.random())) {
				//console.log(parent.x.genes)
				child.dna.genes[i] = parent.x.dna.genes[i];
			}else {
				child.dna.genes[i] = parent.y.dna.genes[i];
			}
		}
		
		temp.push(child);
	});
	population.length = 0;
	population = temp;
	population.forEach(z=> {
		ctx.translate(Math.floor(canvas.width/7), 100);
		if (Math.random() < 0.3) {
			z = new Face();
		}
		z.draw();
	});
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	//console.log(population)
}

addEventListener('click', (e)=> {
	if (e.x > 0 && e.x < (194+97)) {
		population[0].dna.fit += 1;
	}else if (e.x > (194+97) && e.x < ((194*2)+97)) {
		population[1].dna.fit += 1;
	}else if (e.x > ((194*2)+97) && e.x < ((194*3)+97)) {
		population[2].dna.fit += 1;
	}else if (e.x > ((194*3)+97) && e.x < ((194*4)+97)) {
		population[3].dna.fit += 1;
	}else if (e.x > ((194*4)+97) && e.x < ((194*5)+97)) {
		population[4].dna.fit += 1;
	}else if (e.x > ((194*5)+97) && e.x < ((194*6)+97)) {
		population[5].dna.fit += 1;
	}
});
let gen = document.querySelector('#gen');
gen.innerHTML = `generation: `;

