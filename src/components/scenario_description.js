import React from 'react'
import PropTypes from 'prop-types'

function ScenarioDescription (props) {
  return (
    <div style={{ float: 'left', paddingRight: '30px' }}>
      <span>Scenario #{ (props.scenarioIndex + 1) }</span>
      { props.scenario.map((c) => (
        <div key={c.name}>
          { c.name } ${ c.cost }
        </div>
      ))}
      <br/>
    </div>
  )
}

ScenarioDescription.propTypes = {
  scenarioIndex: PropTypes.number.required,
  scenario: PropTypes.object.required
}

export default ScenarioDescription
