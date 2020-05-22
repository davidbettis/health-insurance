import React from 'react'

// CalculatorComponent is a giant app to analyze health insurance options
//
// TODO
//      * Create sub-components for each section
//      * Add mechanicm to add/remove a plan
//      * Add mechanicm to add/remove a scenario
//      * Add mechanicm to toggle tax
//      * Add HSA contributions into plan itself
//      * Color cells red/green depending on debit or credit
//      * Move styles to css file

class CalculatorComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      plans: [
        { is_hsa: false, name: 'Standard Solo', premium: 84, coinsurance: 0.1, individual_deductible: 300, family_deductible: 900, individual_max: 2300, family_max: 4900, min_people: 1, max_people: 1 },
        { is_hsa: true, name: 'HSA Solo', premium: 31, hsa_free: 500, coinsurance: 0.1, individual_deductible: 1500, family_deductible: 1500, individual_max: 3000, family_max: 3000, min_people: 1, max_people: 1 },
        { is_hsa: false, name: 'Standard Spouse', premium: 300, coinsurance: 0.1, individual_deductible: 300, family_deductible: 900, individual_max: 2300, family_max: 4900, min_people: 2, max_people: 2 },
        { is_hsa: true, name: 'HSA Spouse', premium: 208, hsa_free: 1000, coinsurance: 0.1, individual_deductible: 3000, family_deductible: 3000, individual_max: 3000, family_max: 6000, min_people: 2, max_people: 2 },
        { is_hsa: false, name: 'Standard Family', premium: 442, coinsurance: 0.1, individual_deductible: 300, family_deductible: 900, individual_max: 2300, family_max: 4900, min_people: 3, max_people: 99 },
        { is_hsa: true, name: 'HSA Family', premium: 346, hsa_free: 1500, coinsurance: 0.1, individual_deductible: 4500, family_deductible: 4500, individual_max: 4500, family_max: 9000, min_people: 3, max_people: 99 }
      ],
      expenses: [
        [{ name: 'Solo', cost: 200 }],
        [{ name: 'Husband', cost: 4000 }, { name: 'Wife', cost: 10000 }],
        [{ name: 'Husband', cost: 4000 }, { name: 'Wife', cost: 10000 }, { name: 'Baby', cost: 5000 }]
      ],
      taxRate: 25,
      hsaYearlyContributions: 7000
    }
  }

  handleTaxRateChange (e) {
    this.setState({ taxRate: parseInt(e.target.value) })
  }

  handleHsaContributionChange (e) {
    this.setState({ hsaYearlyContributions: parseInt(e.target.value) })
  }

  // Returns a hash with the monthly cost.
  expensesForPlan (plan, expenses) {
    const numPeople = expenses.length
    if (!(numPeople >= plan.min_people && numPeople <= plan.max_people)) {
      return {}
    }

    const results = []

    let totalFamilyCosts = 0
    let familyDeductibleCost = 0

    for (const e of expenses) {
      let deductibleCost = 0
      let afterDeductibleCost = 0

      if (familyDeductibleCost >= plan.family_deductible) {
        deductibleCost = 0
        afterDeductibleCost = parseFloat(plan.coinsurance) * e.cost
      } else {
        // cost overflows the family deductible: split costs between deductible and non-deductible
        if (e.cost + familyDeductibleCost > plan.family_deductible) {
          deductibleCost = plan.family_deductible - familyDeductibleCost
          afterDeductibleCost = parseFloat(plan.coinsurance) * ((e.cost + familyDeductibleCost) - plan.family_deductible)
        } else {
          if (e.cost > plan.individual_deductible) {
            deductibleCost = plan.individual_deductible
            afterDeductibleCost = parseFloat(plan.coinsurance) * (e.cost - plan.individual_deductible)
          } else {
            deductibleCost = e.cost
            afterDeductibleCost = 0
          }
        }

        familyDeductibleCost += deductibleCost
      }

      let finalIndividualCost = deductibleCost + afterDeductibleCost
      if (finalIndividualCost > plan.individual_max) {
        finalIndividualCost = plan.individual_max
      }

      totalFamilyCosts += finalIndividualCost
      console.log('deductibleCost: ' + deductibleCost + ', afterDeductibleCost: ' + afterDeductibleCost + ', finalIndividualCost: ' + finalIndividualCost + ', familyDeductibleCost: ' + familyDeductibleCost)
      results.push({ name: e.name, individual_cost: finalIndividualCost })
    }

    // Did we go over the family out of pocket max?
    if (totalFamilyCosts > plan.family_max) {
      totalFamilyCosts = plan.family_max
    }

    const premiums = plan.premium * 12
    const credits = plan.hsa_free ? plan.hsa_free : 0

    let taxSavings = premiums * this.state.taxRate / 100
    if (plan.is_hsa) {
      taxSavings += this.state.hsaYearlyContributions * this.state.taxRate / 100
    }

    const totalCosts = premiums + totalFamilyCosts - credits - taxSavings

    return {
      premiums: Math.floor(premiums),
      care_costs: Math.floor(totalFamilyCosts),
      sub_total: Math.floor(premiums + totalFamilyCosts),
      credits: Math.floor(credits),
      tax_savings: Math.floor(taxSavings),
      total_costs: Math.floor(totalCosts),
      individual_costs: results
    }
  }

  render () {
    return (
      <div>
        <h1>Assumptions</h1>
        <div>
          <p>Tax rate: <input size="5" value={this.state.taxRate} onChange={ this.handleTaxRateChange.bind(this) } /> %</p>
          <p>HSA Yearly Contributions: $<input size="10" value={this.state.hsaYearlyContributions} onChange={ this.handleHsaContributionChange.bind(this) } /></p>
          <br/>
          <br/>
        </div>
        <h1>Plans</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Premium</th>
              <th>Coinsurance</th>
              <th>Individual Deductible</th>
              <th>Family Deductible</th>
              <th>Individual OOP Max</th>
              <th>Family OOP Max</th>
              <th>HSA Company Gift</th>
              <th>HSA Contributions</th>
            </tr>
          </thead>
          <tbody>
            { this.state.plans.map((p) => (
              this.renderPlanRow(p)
            ))}
          </tbody>
        </table>
        <h1>Healthcare Expenses</h1>
        { this.state.expenses.map((e, i) => (
          this.renderScenarioDescription(e, i)
        ))}
        <h1 style={{ clear: 'both' }}>Evaluations</h1>
        { this.state.expenses.map((e, i) => (
          this.renderScenario(e, i)
        ))}
      </div>
    )
  }

  renderScenarioDescription (e, i) {
    return (
      <div style={{ float: 'left', 'padding-right': '30px' }}>
        <span>Scenario #{ (i + 1) }</span>
        { e.map((c) => (
          <div key={c.name}>
            { c.name } ${ c.cost }
          </div>
        ))}
        <br/>
      </div>
    )
  }

  renderPlanRow (p) {
    return (
      <tr>
        <td>{ p.name }</td>
        <td>{ p.premium }</td>
        <td>{ p.coinsurance }</td>
        <td>{ p.individual_deductible }</td>
        <td>{ p.family_deductible }</td>
        <td>{ p.individual_max }</td>
        <td>{ p.family_max }</td>
        <td>{ p.hsa_free }</td>
        <td>{ p.is_hsa ? this.state.hsaYearlyContributions : '' }</td>
      </tr>
    )
  }

  renderScenario (e, i) {
    return (
      <div>
        <h2>Scenario #{ (i + 1) }</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Premiums</th>
              <th>Care Costs</th>
              <th>Subtotal</th>
              <th>Credits</th>
              <th>Tax Savings</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            { this.state.plans.map((p, j) => (
              this.renderScenarioExpensesForPlan(p, e)
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  renderScenarioExpensesForPlan (p, e) {
    const c = this.expensesForPlan(p, e)
    return (
      <tr>
        <td>{ p.name }</td>
        <td>${ c.premiums }</td>
        <td>${ c.care_costs }</td>
        <td>${ c.sub_total }</td>
        <td>${ c.credits }</td>
        <td>${ c.tax_savings }</td>
        <td>${ c.total_costs }</td>
      </tr>
    )
  }
}

export default CalculatorComponent
