var p = document.querySelector('#p');


var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', (e) => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});

let alpha = 'abcdefghijklmnopqrstuvwxyz ';
let target = 'genetic algorithm';
let size = target.length;

let population = new Array(20);
let matingpool = new Array(), temp;
class DNA {
	constructor() {
		this.genes = new Array(size);
		this.fit = 0;
	}
	fill() {
		for (var i = 0; i < this.genes.length; i++) {
			this.genes[i] = alpha[Math.floor(Math.random()*alpha.length)];
		}
	}
	fitness() {
		let score = 0;
		for (var i = 0; i < this.genes.length; i++) {
			if (this.genes[i] == target[i]) {
				score++;
			}
		}
		this.fit = Math.floor(2**score);
		return this.fit;
	}
}

(()=> {
	for (var i = 0; i < population.length; i++) {
		population[i] = new DNA();
		population[i].fill();
	}
})();

function animation(argument) {
	matingpool = new Array(), temp = new Array();
	ctx.clearRect(0,0,canvas.width, canvas.height);
	
	ctx.beginPath();
	ctx.font = "30px Arial";
	ctx.fillText(`target: genetic algorithm`, 200, 100);
	ctx.closePath();

	let y = 50;
	population.forEach(x=> {
		
		y+= 30;
		ctx.beginPath();
		ctx.font = "30px Arial";
		ctx.fillText(`${x.genes.join('')}`, 50, y);
		ctx.closePath();
		if (x.genes.join('') == target) {
			clearInterval(inter);
			console.log(x)
		}
	});
	//selection
	population.forEach(x=> {
		
		for (var j = 0; j < x.fitness(); j++) {
			matingpool.push(x);
		}
	});
	population.forEach(x=> {
		let ab = new Vector2D(Math.floor(Math.random()*matingpool.length), Math.floor(Math.random()*matingpool.length));

		let parent = new Vector2D(matingpool[ab.x], matingpool[ab.y]);

		let child = new DNA();

		for (var i = 0; i < child.genes.length; i++) {

			if (i <= Math.floor(size*Math.random())) {
				//console.log(parent.x.genes)
				child.genes[i] = parent.x.genes[i];
			}else {
				child.genes[i] = parent.y.genes[i];
			}
		}
		
		temp.push(child);
		//console.log(population);
	});
	//mutation
	population = temp;
	if (Math.random() < 0.2) {
		for (var i = 0; i < size; i++) {
			 population[Math.floor(Math.random()*population.length)].genes[i] = alpha[Math.floor(Math.random()*alpha.length)];
		}
		
	}

}
//animation()
let inter = setInterval(animation, 15);
