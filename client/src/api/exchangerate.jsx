import Request from "./request";

export default class ExchangeRateApi {
  static addExchangeRate(id, reference_date, rates) {
    return Request(`/api/add_exchange_rate`, {
      method: "POST",
      data: {
        id: id,
        reference_date: reference_date,
        rates: rates,
      },
    });
  }

  static getExchangeRate() {
    return Request(`/api/add_exchange_rate`, {
      method: "GET",
    });
  }
}
