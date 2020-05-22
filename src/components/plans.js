import React from 'react'
import PropTypes from 'prop-types'

class Plans extends React.Component {
  render () {
    return (
      <div className="section">
        <i>These are a subset of the Amazon plans listed on the <a href="https://www.amazon.jobs/en/landing_pages/benefitsoverview-us">Amazon benefits website</a>. Absent are the HMO and in-network-only plan options, as it is unclear how to more broadly estimate expenses in those plans.</i> <br/>
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
              <th>Company Credits</th>
              <th>HSA Contributions</th>
            </tr>
          </thead>
          <tbody>
            { this.props.plans.map((p) => (
              this.renderPlanRow(p)
            ))}
          </tbody>
        </table>
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
        <td>{ p.is_hsa ? this.props.hsaYearlyContributions : '' }</td>
      </tr>
    )
  }
}

Plans.propTypes = {
  plans: PropTypes.array.isRequired,
  hsaYearlyContributions: PropTypes.number
}

export default Plans
