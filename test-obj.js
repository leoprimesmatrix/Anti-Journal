import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

const loader = new OBJLoader();
loader.load('https://files.catbox.moe/xd6w1s.obj', (obj) => {
  console.log('Loaded obj:', obj.children.length);
  if (obj.children.length > 0) {
    console.log('Geometry:', obj.children[0].geometry.attributes.position.count);
  }
}, undefined, (err) => console.error(err));
