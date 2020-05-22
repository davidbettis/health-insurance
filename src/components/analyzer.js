import React from 'react'

import ScenarioDescription from 'components/scenario_description'
import ScenarioEvaluation from 'components/scenario_evaluation'
import Plans from 'components/plans'

// Analyzer is an app app to analyze Amazon health insurance options
//
// TODO
//      * Add mechanism to add/remove a plan
//      * Add mechanism to remove a scenario
//      * Add mechanism to toggle tax
//      * Add HSA contributions into plan itself

class Analyzer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      plans: [
        { is_hsa: false, name: 'Standard Solo', premium: 84, coinsurance: 0.1, individual_deductible: 300, family_deductible: 900, individual_max: 2300, family_max: 4900, min_people: 1, max_people: 1 },
        { is_hsa: true, name: 'HSA Solo', premium: 31, hsa_free: 500, coinsurance: 0.1, individual_deductible: 1500, family_deductible: 1500, individual_max: 3000, family_max: 3000, min_people: 1, max_people: 1 },
        { is_hsa: false, name: 'HRA Solo', premium: 31, hsa_free: 500, coinsurance: 0.1, individual_deductible: 1000, family_deductible: 1000, individual_max: 2000, family_max: 2000, min_people: 1, max_people: 1 },
        { is_hsa: false, name: 'Standard Spouse', premium: 300, coinsurance: 0.1, individual_deductible: 300, family_deductible: 900, individual_max: 2300, family_max: 4900, min_people: 2, max_people: 2 },
        { is_hsa: true, name: 'HSA Spouse', premium: 208, hsa_free: 1000, coinsurance: 0.1, individual_deductible: 3000, family_deductible: 3000, individual_max: 3000, family_max: 6000, min_people: 2, max_people: 2 },
        { is_hsa: false, name: 'Standard Family', premium: 442, coinsurance: 0.1, individual_deductible: 300, family_deductible: 900, individual_max: 2300, family_max: 4900, min_people: 3, max_people: 99 },
        { is_hsa: true, name: 'HSA Family', premium: 346, hsa_free: 1500, coinsurance: 0.1, individual_deductible: 4500, family_deductible: 4500, individual_max: 4500, family_max: 9000, min_people: 3, max_people: 99 },
        { is_hsa: false, name: 'HRA Spouse', premium: 312, hsa_free: 1000, coinsurance: 0.1, individual_deductible: 2000, family_deductible: 2000, individual_max: 4000, family_max: 4000, min_people: 2, max_people: 2 },
        { is_hsa: false, name: 'HRA Family', premium: 519, hsa_free: 1500, coinsurance: 0.1, individual_deductible: 3000, family_deductible: 3000, individual_max: 6000, family_max: 6000, min_people: 3, max_people: 99 }
      ],
      expenses: [
        [{ name: 'Solo', cost: 200 }],
        [{ name: 'Husband', cost: 4000 }, { name: 'Wife', cost: 10000 }],
        [{ name: 'Husband', cost: 4000 }, { name: 'Wife', cost: 10000 }, { name: 'Child', cost: 3000 }]
      ],
      scenario: {},
      taxRate: 25,
      hsaYearlyContributions: 5000
    }
  }

  handleTaxRateChange (e) {
    this.setState({ taxRate: parseInt(e.target.value) })
  }

  handleHsaContributionChange (e) {
    this.setState({ hsaYearlyContributions: parseInt(e.target.value) })
  }

  handleAddScenarioInput (e) {
    const scenario = this.state.scenario
    scenario[e.target.name] = e.target.value
    this.setState({ scenario: scenario })
  }

  handleAddScenarioClick (e) {
    const scenarioList = []
    for (let i = 1; i <= 4; i++) {
      const nameKey = 'scenario_name' + i
      const costKey = 'scenario_cost' + i
      if (this.state.scenario[nameKey] && this.state.scenario[costKey]) {
        const scenario = {}
        scenario.name = this.state.scenario[nameKey]
        scenario.cost = this.state.scenario[costKey]
        scenarioList.push(scenario)
      }
    }

    const expenses = this.state.expenses
    expenses.push(scenarioList)
    this.setState({ expenses: expenses })
  }

  render () {
    return (
      <div>
        <div className="section">
          Which health insurance plan should you choose? So many options and so
          much complexity! Deductibles? Embedded deductibles? This tool endeavors to make
          it a bit easier to examine which plans make the most sense for your particular
          situation.
        </div>
        <h1>Assumptions</h1>
        <div className="section">
          <p>
            Tax rate: <input size="5" value={this.state.taxRate} onChange={ this.handleTaxRateChange.bind(this) } /> %<br/>
            <i>Why? Premiums and HSA contributions are tax-deductible. Tax brackets and rates for 2020 at the <a href="https://taxfoundation.org/2020-tax-brackets/">Tax Foundation</a>.</i>
          </p>
          <p>
            HSA Yearly Contributions: $<input size="10" value={this.state.hsaYearlyContributions} onChange={ this.handleHsaContributionChange.bind(this) } /><br/>
            <i>For 2020, the maximum contribution is 3550 for individuals and 7100 for families.</i>
          </p>
        </div>

        <h1>Plans</h1>
        <Plans plans={this.state.plans} hsaYearlyContributions={this.state.hsaYearlyContributions} />

        <h1>Healthcare Expenses</h1>
        <div className="section">
          { this.state.expenses.map((e, i) => (
            <ScenarioDescription key={i} scenario={e} scenarioIndex={i} />
          ))}
          <div className="clear">
            <h3>Add a Scenario</h3>
            { /* TODO this code has a DRY type of vibe */ }
            <div className="scenario-description">
              Name 1: <input name="scenario_name1" size="10" onChange={ this.handleAddScenarioInput.bind(this) } /><br/>
              Expenses 1: $<input name="scenario_cost1" size="10" onChange={ this.handleAddScenarioInput.bind(this) } />
            </div>
            <div className="scenario-description">
              Name 2: <input name="scenario_name2" size="10" onChange={ this.handleAddScenarioInput.bind(this) } /><br/>
              Expenses 2: $<input name="scenario_cost2" size="10" onChange={ this.handleAddScenarioInput.bind(this) } />
            </div>
            <div className="scenario-description">
              Name 3: <input name="scenario_name3" size="10" onChange={ this.handleAddScenarioInput.bind(this) } /><br/>
              Expenses 3: $<input name="scenario_cost3" size="10" onChange={ this.handleAddScenarioInput.bind(this) } />
            </div>
            <div className="scenario-description">
              Name 4: <input name="scenario_name4" size="10" onChange={ this.handleAddScenarioInput.bind(this) } /><br/>
              Expenses 4: $<input name="scenario_cost4" size="10" onChange={ this.handleAddScenarioInput.bind(this) } />
            </div>
            <div className="clear">
              <input type="button" value="Add" onClick={ this.handleAddScenarioClick.bind(this) } />
            </div>
          </div>
        </div>

        <h1 style={{ clear: 'both' }}>Evaluations</h1>
        <div className="section">
          { this.state.expenses.map((scenario, i) => (
            <ScenarioEvaluation key={i} plans={this.state.plans} scenarioIndex={i} scenario={scenario} taxRate={this.state.taxRate} hsaYearlyContributions={this.state.hsaYearlyContributions} />
          ))}
        </div>
      </div>
    )
  }
}

export default Analyzer
