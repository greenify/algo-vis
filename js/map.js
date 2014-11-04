// copyright: greenfiy
// license: GPL

function mapMe(opts){

  var el = opts.el;
  cleanNode(el);

  var config = {};
  config.marginLeft = opts.margin || 100;
  config.width = opts.width || 140;
  config.height = opts.width || config.width / 2;
  config.paddingTop = opts.paddingTop || config.height / 2;

  var map = opts.map || function(el){return el;}; 
  var n = opts.n || opts.li.length || 3;
  var li = opts.li || Array.apply(null, {length: n + 1}).map(Number.call, Number).slice(1);


  function createColumn(insert){
    li.forEach(function(e){
      var c = mk('div');
      c.className = "boxes mbox mapBox";
      setText(c,e);
      c.style.height = config.height + "px";
      c.style.width = config.width + "px";
      c.style.marginTop = config.paddingTop;
      c.style.fontSize = config.width * 0.12 + "px";
      insert.appendChild(c);
    });
  }

  // unreduced elements
  var left = mk('div');
  left.style.display = "inline-block";
  left.style.left = config.marginLeft;
  left.style.position = "absolute";
  el.appendChild(left);
  createColumn(left);

  var right = mk('div');
  right.style.display = "inline-block";
  right.style.left = config.marginLeft;
  right.style.position = "absolute";
  createColumn(right);
  el.appendChild(right);

  function setText(e,obj){
    var text =  JSON.stringify(obj);
    text = text.replace(",", ",<br>");
    e.innerHTML = text;
  }

  function moveElement(index){
    if(right.childNodes.length <= index){
      return
    }

    var e = right.childNodes[index];

    move(e)
      .x(0)
      .y(0)
      .end();

    // move.js sucks!
    move(e)
      .x(1.5 * config.width)
      .duration('1s')
      .ease('in-out')
      .then()
      .rotate(180)
      .ease('linear')
      .duration('0.3s')
      .then(function(){
        var t = move(e)
          .x(1.5 * config.width)
          .rotate(180)
          .rotate(180.1)
          .ease('linear')
          .duration('0.3s')
          .then()
          .delay('.5s')
          .x(2.5 * config.width)
          .pop()
          .end();
        t.on("end", function(){
          setTimeout(moveElement.bind(this,index + 1),2200); 
        });
        setText(e,map(li[index]))
      })
    .pop()
      .end();

    var tPos = config.height * 0.6;
    move(transformer)
      .y(config.height * (index + 1) + config.paddingTop * (index + 1) - tPos) 
      .delay('0.3s')
      .end();
  }

  var transformer = mk('div');
  transformer.className = "mapTransform";
  var transText = (/{(.*)}/).exec("" + map)[1];
  console.log(transText);
  transformer.textContent = transText;
  transformer.style.position = "absolute";
  var tWidth = config.width / 2;
  transformer.style.minWidth = tWidth;
  transformer.style.left =  config.marginLeft + (1.5 * config.width) + (tWidth / 2) ;
  el.appendChild(transformer);

  // start the animation
  moveElement(0);
}

function mk(e) { return document.createElement(e) }
function id(e) { return document.getElementById(e) }

// removes all childs
function cleanNode(n){
  while (n.firstChild) {
    n.removeChild(n.firstChild);
  }
}
