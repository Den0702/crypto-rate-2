import React from "react";
import "./CryptoList.css";

export default function CryptoList(props) {
    const listElements = props.cryptoList.map(cryptoObj => {
        return (
            <li key={cryptoObj.currency}>
                <span className="crypto-label">Last rate:</span>
                <span className={`crypto-rate ${cryptoObj.cssClass}`}>{cryptoObj.rateLatest}{cryptoObj.htmlArray}</span>
                <span className="currency-ticker">{cryptoObj.currencyTicker}</span>
                <span className="currency-symbol">{cryptoObj.currencySymbol}</span>
            </li>
        )
    })

    return (
        <div className="crypto-list">
            <ul className="the-list">
                {listElements}
            </ul>
        </div>
    );
}