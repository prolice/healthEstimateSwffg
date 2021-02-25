// import {addTemp, breakOnZeroMaxHP} from './commonSettings.js'
//import {descriptions} from './starfinder.js'
import {t} from '../utils.js'

const fraction = function (token) {
	//const hp    = token.actor.data.data.attributes.hp
	//let hp = token.actor.data.data.stats.wounds;
	let hp = token.actor._data.data.stats.wounds;
	let temp = 0
	if (token.actor.data.type === 'vehicle' /*&& game.settings.get('healthEstimate', 'starfinder.useThreshold')*/){
		hp = token.actor.data.data.stats.hullTrauma;
		temp = hp.max;
		/*if (hp.value < hp.max) {
			return 1
		} else if (hp.value < hp.min) {
			return 0.5
		} else {
			return 0
		}*/
	}
	if (token.actor.data.type === 'character' || token.actor.data.type === 'minion' /*&& game.settings.get('healthEstimate', 'core.addTemp')*/) {
		temp = hp.max;
	}
	return Math.min((temp - hp.value) / hp.max, 1)
	 
}
const settings = () => {
	return {
		'core.addTemp'             : {
			type   : Boolean,
			default: false,
		},
		'core.breakOnZeroMaxHP'    : {
			type   : Boolean,
			default: true,
		},
		'starfinder.useThreshold'  : {
			type   : Boolean,
			default: false,
		},
		'starfinder.thresholdNames': {
			type   : String,
			default: t('starfinder.thresholdNames.default').join(', '),
		},
		'starfinder.vehicleNames'  : {
			type   : String,
			default: t('starfinder.vehicleNames.default').join(', '),
			hint   : t('starfinder.vehicleNames.hint'),
		},
	}
}

const descriptions = function (descriptions, stage, token, state = {isDead: false, desc: ''}, fraction) {
	const type = token.actor.data.type
	if (type !== 'vehicle' && state.isDead) {
		return state.desc
	}
	
	if (type !== 'character' && type !== 'npc' && type !== 'minion') {
		if (type === 'vehicle' && game.settings.get('healthEstimate', 'starfinder.useThreshold')) {
			descriptions = game.settings.get('healthEstimate', 'starfinder.thresholdNames').split(/[,;]\s*/)
		} else {
			descriptions = game.settings.get('healthEstimate', 'starfinder.vehicleNames').split(/[,;]\s*/)
		}
		stage = Math.max(0, Math.ceil((descriptions.length - 1) * fraction))
	}
	return descriptions[stage]
}

const breakCondition = `||game.settings.get('healthEstimate', 'core.breakOnZeroMaxHP') &&  token.actor._data.data.stats.wounds.max === 0`

export {fraction, settings, breakCondition, descriptions}