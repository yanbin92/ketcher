var Vec2 = require('../util/vec2');
var Action = require('./action');
var EditorGlobal = require('./editorglobal');

var ui = global.ui;

var EditorTool = function (editor) {
	this.editor = editor;
};
EditorTool.prototype.processEvent = function (name, event, action) {
	if (!('touches' in event) || event.touches.length == 1) {
		if (name + '0' in this)
			return this[name + '0'](event, action);
		else if (name in this)
			return this[name](event, action);
		console.log('EditorTool.dispatchEvent: event \'' + name + '\' is not handled.');
	} else if ('lastEvent' in this.OnMouseDown0) {
		// here we finish previous MouseDown and MouseMoves with simulated MouseUp
		// before gesture (canvas zoom, scroll, rotate) started
		return this.OnMouseUp0(event, action);
	}
};
EditorTool.prototype.OnMouseDown = function () {};
EditorTool.prototype.OnMouseMove = function () {};
EditorTool.prototype.OnMouseUp = function () {};
EditorTool.prototype.OnClick = function () {};
EditorTool.prototype.OnDblClick = function () {};
EditorTool.prototype.OnMouseLeave = function () { this.OnCancel();};
EditorTool.prototype.OnKeyPress = function () {};
EditorTool.prototype.OnCancel = function () {}; // called when we abandon the tool
EditorTool.prototype.OnMouseDown0 = function (event) {
	if (ui.hideBlurredControls()) return true; // TODO review (don't stop propagation to handle dropdown closing)

	this.OnMouseDown0.lastEvent = event;
	this.OnMouseMove0.lastEvent = event;

	if ('OnMouseDown' in this) return this.OnMouseDown(event);
};
EditorTool.prototype.OnMouseMove0 = function (event) {
	this.OnMouseMove0.lastEvent = event;

	if ('OnMouseMove' in this) return this.OnMouseMove(event);
};
EditorTool.prototype.OnMouseUp0 = function (event) {
	// here we suppress event we got when second touch released in guesture
	if (!('lastEvent' in this.OnMouseDown0)) return true;

	if ('lastEvent' in this.OnMouseMove0) {
		// this data is missing for 'touchend' event when last finger is out
		event = Object.clone(event); // pageX & pageY properties are readonly in Opera
		event.pageX = this.OnMouseMove0.lastEvent.pageX;
		event.pageY = this.OnMouseMove0.lastEvent.pageY;
	}

	try {
		if ('OnMouseUp' in this) return this.OnMouseUp(event);
	} finally {
		delete this.OnMouseDown0.lastEvent;
	}
};

EditorTool.atom_label_map = {
	atom_tool_any: 'A',
	atom_tool_h: 'H',
	atom_tool_c: 'C',
	atom_tool_n: 'N',
	atom_tool_o: 'O',
	atom_tool_s: 'S',
	atom_tool_p: 'P',
	atom_tool_f: 'F',
	atom_tool_br: 'Br',
	atom_tool_cl: 'Cl',
	atom_tool_i: 'I'
};

EditorTool.prototype.OnKeyPress0 = function (event, action) {
	if (action === 'rgroup_tool_label' && 'lastEvent' in this.OnMouseMove0) {
		return EditorGlobal.RGroupAtomTool_OnMouseUp.call(this,
			this.OnMouseMove0.lastEvent);
	} else if (action in EditorTool.atom_label_map) {
		var label = EditorTool.atom_label_map[action];
		var selection = this.editor.getSelection();
		if (selection && 'atoms' in selection && selection.atoms.length > 0) {
			ui.addUndoAction(Action.fromAtomsAttrs(
				selection.atoms, {label: label}, true), true);
			ui.render.update();
			return true;
		} else {
			var ci = this.editor.render.findItem(this.OnMouseMove0.lastEvent);
			if (ci) {
				ci.label = {label: label};
				if (ci.map === 'atoms') {
					ui.addUndoAction(Action.fromAtomsAttrs(
						ci.id, ci.label, true), true);
				} else if (ci.id == -1) {
					ui.addUndoAction(
					Action.fromAtomAddition(
					ui.page2obj(
						this.OnMouseMove0.lastEvent), ci.label), true);
				}
				ui.render.update();
				return true;
			}
		}
	}
	if ('OnKeyPress' in this)
		return this.OnKeyPress(event);
	return false;
};

EditorTool.prototype._calcAngle = function (pos0, pos1) {
	var v = Vec2.diff(pos1, pos0);
	var angle = Math.atan2(v.y, v.x);
	var sign = angle < 0 ? -1 : 1;
	var floor = Math.floor(Math.abs(angle) / (Math.PI / 12)) * (Math.PI / 12);
	angle = sign * (floor + ((Math.abs(angle) - floor < Math.PI / 24) ? 0 : Math.PI / 12));
	return angle;
};
EditorTool.prototype._calcNewAtomPos = function (pos0, pos1) {
	var v = new Vec2(1, 0).rotate(this._calcAngle(pos0, pos1));
	v.add_(pos0);
	return v;
};

module.exports = EditorTool;
