import * as $ from 'jquery';
import Post from '@models/Post'
import './styles/styles.css'
/** данный импорт работает благодоря webpack по-умолчаию */
import json from './assets/json.json'
/** благодоря resolve в конфие можно не указывать расширение см. resolve->extensions */
import WebpackLogo from './assets/webpack-logo'
import xml from './assets/data.xml'
import csv from './assets/data.csv'
import './styles/less.less'
import './babel'


const post = new Post("Webpack Post title", WebpackLogo);

$('pre').addClass('code').html(post.toString())

console.log('Post to', post);
console.log('JSON', json);
console.log('xml', xml);
console.log('csv', csv);