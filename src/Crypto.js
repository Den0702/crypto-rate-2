import React, { Component } from "react";
import './Crypto.css';
import CryptoList from "./CryptoList";
import axios from "axios";

class Crypto extends Component {
  constructor() {
    super();

    this.state = {
      cryptoList: []
    }
  }

  getData = () => {
      axios.get('https://blockchain.info/ticker', {
        mode: 'cors'
      }
    )
    .then(res => {
        console.log(res);
        const tickers = res.data;

        this.setState((prevState) => {
            let newCryptoList = [];
            
            for (let [ticker, currencyObj] of Object.entries(tickers)) {
              
              let lastCryptoObj = prevState.cryptoList.find(cryptoObj => {
                return (cryptoObj.currency === ticker)
              });
              
              const newCryptoObj = {
                currency: ticker,
                rateLatest: currencyObj.last,
                currencySymbol: currencyObj.symbol, 
              }

              if (lastCryptoObj !== undefined) {
                if (lastCryptoObj.currency > newCryptoObj.currency){
                  newCryptoObj.cssClass = 'red';
                  newCryptoObj.htmlArray = String.fromCodePoint(8595);
                  
                } else if(lastCryptoObj.currency < newCryptoObj.currency) {
                  newCryptoObj.cssClass = 'green';
                  newCryptoObj.htmlArray = String.fromCodePoint(8593);

                } else {
                  newCryptoObj.cssClass = 'blue';
                  newCryptoObj.htmlArray = String.fromCodePoint(8596);
                }
              }
              
              newCryptoList.push(newCryptoObj);
            }
            
            return ({
              cryptoList: newCryptoList 
            });
          }
        )
        
      }
    );

  }

  filterCryptoList = (value) => {
    let pattern = value.trim().toUpperCase();
    
    this.setState((prevState) => {
        let filteredCryptoList = prevState.cryptoList.filter(cryptoObj => {
            return (cryptoObj.currency.contains(pattern));
        })
        return ({
            cryptoList: filteredCryptoList
        })
    })
  }

  componentDidMount() {
    this.getData();
    this.timerId = setInterval(() => this.getData(), 3000);
  }

  componentWillUnmount() {
      clearInterval(this.timerId);
  }

  render() {
    return (
      <div className="crypto">
        <input 
          ref={ elem => this._inputField = elem } 
          type="text" 
          onChange={() => this.filterCryptoList(this._inputField.value)}
        />
        <CryptoList cryptoList={this.state.cryptoList} />
      </div>
    );
  }

}

export default Crypto;