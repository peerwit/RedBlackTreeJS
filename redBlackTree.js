// Red Black Tree implementation by Pranay 
	// v 0.1.0 (01/01/15)
	// Happy New Year indeed!

function RedBlackTree (value, color, parent) {
	this.value = value?value:0;
	this.color = color || "black";
	this.parent = parent?parent:null;
	this.leftChild = null;
	this.rightChild = null;
	return this;
}

RedBlackTree.prototype.gotGrandparent = RedBlackTree.prototype.hasGP = function(){
	if (this.parent.parent){
		return true;
	} 
	else {return false}
}

// returns a pointer to the newly inserted node
RedBlackTree.prototype.insert = function(value) {
	var root = this.findRoot();
	function rbtInsert(node, value) {
		if (value === node.value) {return value}
		else if (value < node.value) {
			if (node.leftChild) {
				return rbtInsert(node.leftChild, value)
			}
			else {
				node["leftChild"] = new RedBlackTree(value, "red", node);
				if (node.color === "red") {node.leftChild.colorClash()}
			}
		}
		else if (value > node.value) {
			if (node.rightChild) {
				return rbtInsert(node.rightChild, value)
			}
			else {
				node["rightChild"] = new RedBlackTree(value, "red", node);
				if (node.color === "red") {node.rightChild.colorClash()}
			}
		}
	}
	rbtInsert(root, value);
	var root = root.findRoot();
	if (root.color === "red") {root.findRoot().color = "black"}
	if (root.value === 50) {
		console.log(root.rightChild.leftChild.parent.rightChild.value);
		console.log(root.rightChild.leftChild.value);
	}
};

RedBlackTree.prototype.contains = function(target, flag) {
	if (flag) {
		if (this.value === target) {
			return true;
		}
		else {
			if (target < this.value){
				if (this.leftChild) {
					return this.leftChild.contains(target, true);
				}
				else {return false}
			}
			else if (target > this.value) {
				if (this.rightChild) {
					return this.rightChild.contains(target, true);
				}
				else {return false}
			}
		}
	}
	else {
		return this.findRoot().contains(target, true);
	}
	
};

RedBlackTree.prototype.childType = function() {
	if (!this.parent) {return "root"}
	else {
		if (this.parent["leftChild"] === this) {
			return "leftChild"
		}
		else {return "rightChild"}
	}
	throw new Error("childType Error " + this.parent.leftChild.value + this.parent.rightChild.value + this.value);
};

RedBlackTree.prototype.getGP = function(){
	if (this.hasGP()) {
		return this.parent.parent;
	}
	else {return null}
}



RedBlackTree.prototype.getUncleColor = function(){
	if (!this.hasGP()) {
		throw new Error("NO UNCLE because Parent is ROOT");
	}
	var parentType = this.parent.childType();
	var uncle;
	if (parentType === "leftChild") {
		uncle = this.parent.parent["rightChild"];
		if (uncle) {
			return uncle.color;
		}
		return "black";
	}
	else if (parentType === "rightChild") {
		uncle = this.parent.parent["leftChild"];
		if (uncle) {
			return uncle.color;
		}
		return "black";
	}
}

RedBlackTree.prototype.getUncle = function(){
	if (!this.hasGP()) {
		throw new Error("NO UNCLE because Parent is ROOT");
	}
	var parentType = this.parent.childType();
	var uncle;
	if (parentType === "leftChild") {
		uncle = this.parent.parent["rightChild"];
		if (uncle) {
			return uncle;
		}
		throw Error("NO UNCLE for l");
	}
	else if (parentType === "rightChild") {
		uncle = this.parent.parent["leftChild"];
		if (uncle) {
			return uncle;
		}
		throw Error("NO UNCLE for r");
	}
}

RedBlackTree.prototype.getUncleType = function(){
	if (!this.hasGP()) {
		throw new Error("NO UNCLE because Parent is ROOT");
	}
	var parentType = this.parent.childType();
	var uncle;
	if (parentType === "leftChild") {
		return "rightChild";
	}
	else if (parentType === "rightChild") {
		return "leftChild";
	}
}

RedBlackTree.prototype.upcolor = function(){
	this.getGP().color = "red";
	this.getUncle().color = "black"
	this.parent.color = "black";
	if (this.getGP().parent && this.getGP().parent.color === "red") {
		this.getGP().colorClash();
	} 
	return;
}

RedBlackTree.prototype.rotate = function(){
	this.getUncleType() !== this.childType() ? this.oneRotation() : this.twoRotations();
}

RedBlackTree.prototype.oneRotation = function(){
	// Repaint
	this.parent.color = "black"; this.parent.parent.color = "red"; 

	var grandParent = this.parent.parent;
	var parent = this.parent;
	// reassign to great-grandParent;
	parent.parent = grandParent.parent;
	grandParent.parent = parent;
	if (parent.parent) {
		if (parent.parent.value < parent.value) {
			parent.parent["rightChild"] = parent;
		}
		else {
			parent.parent["leftChild"] = parent;
		}
	}
	// if right do a right rotation else do a left rotation
	var right = (parent.value < grandParent.value);
	var tree = right?parent.rightChild:parent.leftChild;
	tree?(tree.parent = grandParent):null;
	right?(
		parent.rightChild = grandParent,
		grandParent.leftChild = tree
		)  :  (
		parent.leftChild = grandParent,
		grandParent.rightChild = tree
	);
	if (right) {
		if (this.findRoot().value === 50) {
			console.log(this.findRoot().rightChild.leftChild.value, 
				this.findRoot().rightChild.leftChild.parent.leftChild.value);
		}
	}

}

RedBlackTree.prototype.twoRotations = function(){
	this.color = "black"; this.parent.parent.color = "red";
	(this.value < this.parent.value) ? this.rotateLesser() : this.rotateGreater();
}

RedBlackTree.prototype.rotateLesser = function(){
	var ggp = this.parent.parent.parent;
	var childType = this.parent.parent.childType();
	if (childType !== "root") { ggp[childType] = this;}
	var c1 = this.leftChild;
	var c2 = this.rightChild;
	this.leftChild = this.parent.parent;
	this.rightChild = this.parent;
	this.leftChild.parent = this;
	this.rightChild.parent = this;
	this.leftChild.rightChild = c1;
	this.rightChild.leftChild = c2;
	c1?(c1.parent = this.leftChild):null;
	c2?(c2.parent = this.rightChild):null;
	this.parent = ggp;
}

RedBlackTree.prototype.rotateGreater = function(){
	var ggp = this.parent.parent.parent;
	var childType = this.parent.parent.childType();
	if (childType !== "root") { ggp[childType] = this;}
	var c1 = this.leftChild;
	var c2 = this.rightChild;
	this.leftChild = this.parent;
	this.rightChild = this.parent.parent;
	this.leftChild.parent = this;
	this.rightChild.parent = this;
	this.leftChild.rightChild = c1;
	this.rightChild.leftChild = c2;
	c1?(c1.parent = this.leftChild):null;
	c2?(c2.parent = this.rightChild):null;
	this.parent = ggp;
}

RedBlackTree.prototype.colorClash = function(){
	if (this.parent.color !== "red" || this.color !== "red"){
		throw new Error ("Bad Color Class Call")
	};
	(this.getUncleColor() === "black") ? this.rotate() : this.upcolor();
}

RedBlackTree.prototype.findRoot = function(){
	if (this.parent !== null) {
		return this.parent.findRoot();
	}
	else {return this;}
}

RedBlackTree.prototype.d3ify = function(e){
	if (!e.name) {
		var children = [];
		if (e.leftChild){children.push(e.leftChild)}
		if (e.rightChild) {children.push(e.rightChild)}
		e.name = e.value;
		e.children = children;
	}
	return;
}

RedBlackTree.prototype.breadthFirstRet = function(fn, array) {
	array = array  || [];
	if (this.findRoot() === this){
		array.push(this);
	}
	if (this.leftChild) {
		array.push(this.leftChild);
	}
	if (this.rightChild) {
		array.push(this.rightChild);
	}
	if (this.leftChild) {
		this.leftChild.breadthFirstRet(fn, array);
	}
	if (this.rightChild) {
		this.rightChild.breadthFirstRet(fn, array);
	}
	if (this.findRoot() === this){
		return array.map(fn);
	}
	return array;
};

//------------------------------------------------------------------------
// INSERTIONS
for (var i = 0; i < 30; i++) {
	var random = Math.floor(Math.random()*1000);
	if (i === 0) {
		var tree = new RedBlackTree(random);
	}
	else {
		tree.insert(random);
	}
	console.log(i, tree.contains(random), random);
	if (!tree.contains(random)) {
		throw new Error("Cannot find inserted node", random);
	}
}

console.log(tree.findRoot);

var i = 0;
var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var root = tree.findRoot();
var t = d3.layout.tree();
var nodesStore = root.breadthFirstRet(root.d3ify);
console.log(root.findRoot());
var nodes = t.nodes(root.findRoot());
console.log(nodes.length);
var links = t.links(nodes);
var node = svg.selectAll(".node")
	.data(nodes)
	.enter()
	.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + (d.x*width/2 + 10) + "," + (d.y*height/2 + 50) + ")";
		});
node.append("circle")
	.attr("r", 5)
	.attr("fill", function(d) {return d.color});

node.append("text")
	.text(function(d) {
		var value = "root", rc = ".", lc = ".";
		if (d.parent) {
			value = d.parent.value
		}
		if (d.rightChild) {
			rc = d.rightChild.value
		}
		if (d.leftChild) {
			lc = d.leftChild.value
		}
		return d.name });

var diagonal = d3.svg.diagonal()
	.projection(function(d) {return [(d.x*width/2 + 10), (d.y*height/2 + 50)]});

var link = svg.selectAll(".link")
	.data(links)
	.enter()
	.append("path")
		.attr("class", "link")
		.attr("stroke", "black")
		.attr("fill", "none")
		.attr("d", diagonal);
