import React from 'react'
import PropTypes from 'prop-types'

class ScenarioEvaluation extends React.Component {
  render () {
    return (
      <div>
        <h2>Scenario #{ (this.props.scenarioIndex + 1) }</h2>
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
            { this.props.plans.map((p, j) => (
              this.renderScenarioExpensesForPlan(p, this.props.scenario)
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  renderScenarioExpensesForPlan (p, e) {
    const c = this.expensesForPlan(p, e)
    if (c.premiums) {
      return (
        <tr>
          <td>{ p.name }</td>
          <td className="cell-loss">${ c.premiums }</td>
          <td className="cell-loss">${ c.care_costs }</td>
          <td className="cell-loss">${ c.sub_total }</td>
          <td className="cell-gain">${ c.credits }</td>
          <td className="cell-gain">${ c.tax_savings }</td>
          <td className={ (c.total_costs > 0 ? 'cell-loss' : 'cell-gain') }>${ c.total_costs }</td>
        </tr>
      )
    }
    return (<span/>)
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
      results.push({ name: e.name, individual_cost: finalIndividualCost })
    }

    // Did we go over the family out of pocket max?
    if (totalFamilyCosts > plan.family_max) {
      totalFamilyCosts = plan.family_max
    }

    const premiums = plan.premium * 12
    const credits = plan.hsa_free ? plan.hsa_free : 0

    let taxSavings = premiums * this.props.taxRate / 100
    if (plan.is_hsa) {
      taxSavings += this.props.hsaYearlyContributions * this.props.taxRate / 100
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
}

ScenarioEvaluation.propTypes = {
  scenarioIndex: PropTypes.number.required,
  plans: PropTypes.array.required,
  scenario: PropTypes.object.required,
  taxRate: PropTypes.number,
  hsaYearlyContributions: PropTypes.number
}

export default ScenarioEvaluation
