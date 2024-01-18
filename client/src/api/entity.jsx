import Request from "./request";

export default class EntityApi {
    static addEntity(id, entityCode, title, country, region, owner, parent, fiscal_year_end, included,
        other_name, active,notes, isRegistered, isParentCompany, isGlobalParent, hasBranches, isBranch,
        isPIE,debtOrEquityListedInEU, doesBusinessInCalifornia, secFilingStatus, year, number_employees,
        net_turnover,
        balance_sheet,
        prior_year,
        number_employees_prior,
        net_turnover_prior,
        balance_sheet_prior,
        currency
    ) {
    return Request(`/api/add_entity`, {
      method: "POST",
      data: {
        id: id,
        entityCode: entityCode,
        title: title,
        country: country,
        region: region,
        owner: owner,
        parent: parent,
        fiscal_year_end: fiscal_year_end,
        included: included,
        other_name: other_name,
        active: active,
        notes: notes,
        isRegistered: isRegistered,
        isParentCompany: isParentCompany,
        isGlobalParent: isGlobalParent,
        hasBranches: hasBranches,
        isBranch: isBranch,
        isPIE: isPIE,
        debtOrEquityListedInEU: debtOrEquityListedInEU,
        doesBusinessInCalifornia: doesBusinessInCalifornia,
        secFilingStatus: secFilingStatus,
        year: year,
        number_employees: number_employees,
        net_turnover: net_turnover,
        balance_sheet: balance_sheet,
        prior_year: prior_year,
        number_employees_prior: number_employees_prior,
        net_turnover_prior: net_turnover_prior,
        balance_sheet_prior: balance_sheet_prior,
        currency: currency
    },
    });
  }

  static getEntities() {
    return Request(`/api/get_entities`, {
      method: "GET",
    });
  }

  static getEntity(entity_id) {
    return Request(`/api/get_entity/${entity_id}`, {
      method: "GET",
    });
  }
}
