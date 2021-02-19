'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import result from '../imgs/result.png'
import { common } from '../../common';
console.log(common());
class Search extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            Text: null
        }
    }

    render() {
        const { Text } = this.state;
        return <div className='search-text' >
            今天是个好日子
            <img src={result} onClick={this.loadComponent.bind(this)} />
            {Text ? <Text /> : null}
        </div>;
    }
    loadComponent() {
        import('./text.js').then((Text) => [
            this.setState({
                Text:Text.default
            })
        ])
    }
}
ReactDOM.render(
    <Search />,
    document.getElementById('root')
);