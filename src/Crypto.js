import React, { Component } from "react";
import './Crypto.css';
import CryptoList from "./CryptoList";
import axios from "axios";

class Crypto extends Component {
  constructor() {
    super();

    this.state = {
      cryptoList: [],
      //filteredCryptoList: [] - tego nie używamy
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
                if (lastCryptoObj.rateLatest > newCryptoObj.rateLatest){
                  newCryptoObj.cssClass = 'red';
                  newCryptoObj.htmlArray = String.fromCodePoint(8595);
                  
                } else if(lastCryptoObj.rateLatest < newCryptoObj.rateLatest) {
                  newCryptoObj.cssClass = 'green';
                  newCryptoObj.htmlArray = String.fromCodePoint(8593);

                } else {
                  newCryptoObj.cssClass = 'blue';
                  newCryptoObj.htmlArray = String.fromCodePoint(8596);
                }
              } else {
                newCryptoObj.cssClass = 'blue';
                newCryptoObj.htmlArray = String.fromCodePoint(8596);
              }
              
              newCryptoList.push(newCryptoObj);
            }
            
            return ({
              cryptoList: newCryptoList 
            });
          }
        )
        this.filterCryptoList();
      }
    );

  }

  filterCryptoList = () => {
    let pattern = this._inputField.value.trim().toUpperCase();
    
    this.setState((prevState) => {
        let newfilteredCryptoList = prevState.cryptoList.filter(cryptoObj => {
            return (cryptoObj.currency.includes(pattern));
        });

        return ({
            cryptoList: newfilteredCryptoList//zamiast filteredCryptoList: newfilteredCryptoList
        });
    })
  }

  componentDidMount() {
    this.getData();
    this.timerId = setInterval(() => this.getData(), 5000);
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
          onChange={this.filterCryptoList}
        />
        <CryptoList cryptoList={this.state.cryptoList} />{/* zamiast this.state.filteredCryptoList */}
      </div>
    );
  }

}

export default Crypto;