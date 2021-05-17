"use strict";

// // Nearly
// // https://omrelli.ug/nearley-playground/
// MAIN -> EXP

// DICE -> INT "d" INT {% function(d) {return [d[0][0], d[2][0]]} %}

// EXP -> EXP _ "+" _ DICE {% function(d) {return {type:'A', d:[d[0],d[4]]}} %}
//   | EXP _ "-" _ DICE {% function(d) {return {type:'S', d:[d[0],d[4]]}} %}
// 	| EXP _ ":" _ DICE {% function(d) {return {type:':', d:[d[0],d[4]]}} %}
//     | DICE            {% id %}

// INT -> [0-9]:+        {% function(d) {return d[0][0]} %}

// _ -> [\s]:*


const text = "1d6+2d10:3d4";

(function () {
	function id(x) { return x[0]; }
	var grammar = {
		Lexer: undefined,
		ParserRules: [
			{"name": "MAIN", "symbols": ["EXP"]},
			{"name": "DICE", "symbols": ["INT", {"literal":"d","pos":12}, "INT"], "postprocess": function(d) {return [d[0][0], d[2][0]]}},
			{"name": "EXP", "symbols": ["EXP", "_", {"literal":"+","pos":26}, "_", "DICE"], "postprocess": function(d) {return {type:"A", d:[d[0],d[4]]}}},
			{"name": "EXP", "symbols": ["EXP", "_", {"literal":"-","pos":40}, "_", "DICE"], "postprocess": function(d) {return {type:"S", d:[d[0],d[4]]}}},
			{"name": "EXP", "symbols": ["EXP", "_", {"literal":":","pos":54}, "_", "DICE"], "postprocess": function(d) {return {type:":", d:[d[0],d[4]]}}},
			{"name": "EXP", "symbols": ["DICE"], "postprocess": id},
			{"name": "INT$ebnf$1", "symbols": [/[0-9]/]},
			{"name": "INT$ebnf$1", "symbols": [/[0-9]/, "INT$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
			{"name": "INT", "symbols": ["INT$ebnf$1"], "postprocess": function(d) {return d[0][0]}},
			{"name": "_$ebnf$1", "symbols": []},
			{"name": "_$ebnf$1", "symbols": [/[\s]/, "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
			{"name": "_", "symbols": ["_$ebnf$1"]}]
		, ParserStart: "MAIN"
	};
	if (typeof module !== "undefined"&& typeof module.exports !== "undefined") {
		module.exports = grammar;
	} else {
		window.grammar = grammar;
	}
})();

console.log(text);
