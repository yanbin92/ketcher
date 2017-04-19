import { bond as bondSchema } from '../structschema';
import { toBondType } from '../structconv';

const toolActions = {
	"select-lasso": {
		title: "Lasso Selection",
		shortcut: ["Esc", "Escape"],
		action: { tool: 'select', opts: 'lasso' }
	},
	"select-rectangle": {
		title: "Rectangle Selection",
		shortcut: ["Esc", "Escape"],
		action: { tool: 'select', opts: 'lasso' }
	},
	"select-fragment": {
		title: "Fragment Selection",
		shortcut: ["Esc", "Escape"],
		action: { tool: 'select', opts: 'fragment' }
	},
	"erase": {
		title: "Erase",
		shortcut: ["Del", "Delete", "Backspace"],
		action: { tool: 'eraser', opts: 1 } // TODO last selector mode is better
	},
	"chain": {
		title: "Chain",
		action: { tool: 'chain' }
	},
	"charge-plus": {
		shortcut: "5",
		title: "Charge Plus",
		action: { tool: 'charge', opts: 1 }
	},
	"charge-minus": {
		shortcut: "5",
		title: "Charge Minus",
		action: { tool: 'charge', opts: -1 }
	},
	"transform-rotate": {
		shortcut: "Alt-r",
		title: "Rotate Tool",
		action: { tool: 'rotate' }
	},
	"transform-flip-h": {
		shortcut: "Alt-h",
		title: "Horizontal Flip",
		action: { tool: 'rotate', opts: 'horizontal' }
	},
	"transform-flip-v": {
		shortcut: "Alt-v",
		title: "Vertical Flip",
		action: { tool: 'rotate', opts: 'vertical' }
	},
	"sgroup": {
		shortcut: "Mod-g",
		title: "S-Group",
		action: { tool: 'sgroup' }
	},
	"sgroup-data": {
		shortcut: "Mod-g",
		title: "Data S-Group",
		action: { tool: 'sgroup', opts: 'DAT' }
	},
	"reaction-arrow": {
		title: "Reaction Arrow Tool",
		action: { tool: 'reactionarrow' }
	},
	"reaction-plus": {
		title: "Reaction Plus Tool",
		action: { tool: 'reactionplus' }
	},
	"reaction-map": {
		title: "Reaction Mapping Tool",
		action: { tool: 'reactionmap' }
	},
	"reaction-unmap": {
		title: "Reaction Unmapping Tool",
		action: { tool: 'reactionmap' }
	},
	"rgroup-label": {
		shortcut: "Mod-r",
		title: "R-Group Label Tool",
		action: { tool: 'rgroupatom' }
	},
	"rgroup-fragment": {
		shortcut: ["Mod-Shift-r", "Mod-r"],
		title: "R-Group Fragment Tool",
		action: { tool: 'rgroupfragment' }
	},
	"rgroup-attpoints": {
		shortcut: "Mod-r",
		title: "Attachment Point Tool",
		action: { tool: 'apoint' }
	}
};

const bondCuts = {
	"single": "1",
	"double": "2",
	"triple": "3",
	"up": "1",
	"down": "1",
	"updown": "1",
	"crossed": "2",
	"any": "0",
	"aromatic": "4",
}

let typeSchema = bondSchema.properties.type;
export default typeSchema.enum.reduce((res, type, i) => {
	res[`bond-${type}`] = {
		title: `${typeSchema.enumNames[i]} Bond`,
		shortcut: bondCuts[type],
		action: {
			tool: 'bond',
			opts: toBondType(type)
		}
	};
	return res;
}, toolActions);
