export class ExchangeRateInterface {
    id: number;
    currencyFrom: string;
    currencyTo: string;
    rate: number;
}

export class ExchangeRate implements ExchangeRateInterface {
    constructor(
      public id: number,
      public currencyFrom: string,
      public currencyTo: string,
      public rate: number
    ) {}
  }