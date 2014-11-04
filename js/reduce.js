// copyright: greenfiy
// license: GPL

function reduceMe(opts){

	var el = opts.el;
	cleanNode(el);

	var n = opts.n || opts.li.length || 3;
	var config = {};
	config.marginLeft = opts.margin || 100;
	config.width = opts.width || 60;
	config.height = opts.width || config.width;
	config.timeout = opts.timeout || 250;
	config.transition = opts.transition / 1000 || 1500 / 1000;

	var childs = [];
	var cMemo = opts.memo;
	if (cMemo === undefined) 
		cMemo = 0;
	var reducer = function(m,e){ return m + e}
	var li = opts.li || Array.apply(null, {length: n + 1}).map(Number.call, Number).slice(1);

	var self = this;

	// init row with currently available list items
	function createRow(opts){
		var from = opts.from || 0;
		var to = opts.to || 4;
		var insert = [];
		var linebr = mk('div');
		el.appendChild(linebr);
		for(var i= from;i< to;i++){
			var c = mk('div');
			c.innerHTML = li[i];
			c.className = "boxes mbox";
			c.style.height = config.height + "px";
			c.style.width = config.width + "px";
			c.style.lineHeight = config.height + "px";
			c.style.fontSize = config.height * 0.7 + "px";
			c.style.display = "inline-block";
			insert.push(c);
			el.appendChild(c);
		}
		return insert;
	}


	// starts the row animation
	this.anime = function(state){

		if (state > n)
			return;
		else if(state == n){
			var br = mk('div');
			br.innerHTML = "&nbsp;"
			el.appendChild(br);
			this.memo(state)
			return
		}

		childs[state] = createRow({from: state, to: n});

		// scroll in
		move(childs[state][0])
			.add('margin-left', state * config.width + config.marginLeft)
			.end();

		// fancy opacity
		move(childs[state][0])
			.set('opacity', 0.2)
			.end()
			.then()
			.set('opacity', 0.8)
			.duration(config.transition / 2 + "s")
			.then(function(){
				setTimeout(this.memo.bind(this,state + 1),config.timeout);
			}.bind(this))
			.end()

	} 

	this.memo = function(state){
		var mem = mk('div');
		mem.className = "memo mbox";

		var dist = 0.7;
		var distStart = 0.615;

		mem.style.width = config.width;
		mem.style.minWidth = config.width;
		//mem.style.display = 'inline-block';
		mem.innerHTML = cMemo;

		el.appendChild(mem);

		if(state != 0)
			cMemo = reducer(cMemo,li[state - 1]);

		// init
		move(mem)
			.set('margin-left', (state - 2) * config.width + config.marginLeft )
			.set('background-color', '77D1F7')
			.set('top', (- distStart) * config.height) 
			.duration('0s')
			.end();

		var mfn = move(mem)
			.add('margin-left', config.width)
			.duration('1s')
			.then(function(){
				mem.innerHTML = cMemo;
			})
			.then(function(){
				var tuHeight = (0.7 + distStart) * config.height;
				var tu = move(mem)
				 .set('background-color', '06587A')
			    .add('top', tuHeight)
			   .duration('1s')
				 .then(function(){
				 	if(state < n)
				 		setTimeout(self.anime.bind(self,state),config.timeout)
				 })
				 .end();
			})
			.end();
	}
	
	// start animation
	this.memo(0);
}

function mk(e) { return document.createElement(e) }
function id(e) { return document.getElementById(e) }

// removes all childs
function cleanNode(n){
  while (n.firstChild) {
    n.removeChild(n.firstChild);
  }
}
