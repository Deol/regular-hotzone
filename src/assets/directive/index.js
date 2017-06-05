/**
 * directives
 * Created by Aeo on 2017/5/24.
 */
import addItem from './addItem';
import resizeImg from './resizeImg'; 
import dragItem from './dragItem';
import changeSize from './changeSize';
import autoFocus from './autoFocus';

export default {
    'r-addItem': addItem,
    'r-resize': resizeImg,
    'r-dragItem': dragItem,
    'r-changeSize': changeSize,
    'r-autofocus': autoFocus
};