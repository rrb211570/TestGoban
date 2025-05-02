import { store } from "../../../store/store.js";
import { updateAdj, deleteAdj } from '../../../store/reducers/gamePlaySlice.js'
import { getAllNeighborIndices, getNeighborStones, makeNewStoneGroup, getSameColorNeighborGroups, getNeighborGroups } from "./modifiers/helpers.js";
import capturable from "./modifiers/capturable.js";
import consolidate from "./modifiers/consolidate.js";

let placeable = (rootIndices) => {
  let log = 'placeable:: ' + rootIndices + '\n';
  if (openSpace(rootIndices)) { // open space
    log += 'open space'+ '\n';
    capturable(rootIndices); // capture if possible
    if (hasSameColorNeighborGroups(rootIndices)) {
      log += 'placeable:: open space, consolidate'+ '\n';
      consolidate(rootIndices);
    } else {
      log += 'placeable:: open space, newStoneGroup'+ '\n';
      makeNewStoneGroup(rootIndices);
    }
  } else { // surrounded
    if (capturable(rootIndices)) { // capture if possible
      log += 'capturable'+ '\n';
      if (hasSameColorNeighborGroups(rootIndices)) {
        log += 'placeable:: surrounded, capturable, consolidate'+ '\n';
        consolidate(rootIndices);
      } else {
        log += 'placeable:: surrounded, capturable, newStoneGroup'+ '\n';
        makeNewStoneGroup(rootIndices);
      }
    } else if (hasExposedNeighbor(rootIndices)) {
      log += 'placeable:: surrounded, exposed, consolidate'+ '\n';
      consolidate(rootIndices);
    } else {
      log += 'placeable:: surrounded, not exposed or capturable'+ '\n';
      return false;
    }
  }
  console.log(log);
  addNeighborIndicesOfPlacedStone(rootIndices);
  if (store.getState().gamePlay.adjMap.hasAdj(rootIndices)) store.dispatch(deleteAdj({ indices: rootIndices }));
  return true;
}

let openSpace = (rootIndices) => { return getNeighborStones(rootIndices).length < getAllNeighborIndices(rootIndices).length }
let hasSameColorNeighborGroups = (rootIndices) => { return getSameColorNeighborGroups(rootIndices).length > 0 }

let hasExposedNeighbor = (rootIndices) => {
  let sameColorNeighborGroups = getSameColorNeighborGroups(rootIndices);
  for (let sameColorNeighborGroup of sameColorNeighborGroups) {
    if (exposed(sameColorNeighborGroup, rootIndices)) return true;
  }
  return false;
}

let exposed = (sameColorNeighborGroup, rootIndices) => {
  let adjMap = store.getState().gamePlay.adjMap;
  for (let [indices, adjArr] of adjMap.getAdjEntries()) {
    if (indices != rootIndices && adjArr.includes(sameColorNeighborGroup)) { // we ignore rootIndices b/c we are checking for outward exposure, not inward
      console.log('exposed: ' + sameColorNeighborGroup);
      return true;
    }
  }
  return false;
}

let addNeighborIndicesOfPlacedStone = (rootIndices) => {
  let placedStones = store.getState().gamePlay.placedStones;
  let adjMap = store.getState().gamePlay.adjMap;
  for (let neighborIndices of getAllNeighborIndices(rootIndices)) {
    if (!placedStones.includes(neighborIndices)) {
      let neighborGroups = getNeighborGroups(neighborIndices);
      //console.log(neighborGroups)
      if(neighborGroups.length>0) adjMap.setAdj(neighborIndices, neighborGroups);
    }
  }
  store.dispatch(updateAdj({ adjMap }));
}

export default placeable;