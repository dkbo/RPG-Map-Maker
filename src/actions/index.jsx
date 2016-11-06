import { WAY } from '../constants';


//player
export function way(way, bool) {
  return {
    type: WAY,
    way,
    bool,
  };
}
