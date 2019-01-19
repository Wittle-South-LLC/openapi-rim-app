/* test-state-{{ name }}.js - Tests {{ name }} state */
import { describe, it, beforeEach } from 'mocha'
import chai from 'chai'
// import nock from 'nock'
// import { isd } from './TestUtils'
import { {{name}} } from '../src/state/{{ name }}'
// import baseApp from '../src/state/baseApp'
// import { defaultState } from './TestData'
// import { testCreateNew, testEditField, testLogin, testSaveNew,
//          testSaveUpdate, testSaveDelete } from './ActionTests'

const TEST_ID = '{{ name }}1'
const TCLASS = {{ name }}

describe('{{ name }}: testing RimObject actions', () => {
  beforeEach(() => {
    TCLASS.setState(defaultState.get(TCLASS.STATE_PATH))
  })
  it('new returns an empty object', () => {
    let myObj = new TCLASS()
    chai.expect(myObj.getName()).to.equal('')
  })
  let testObj = TCLASS.getById(TEST_ID)
  // Basic tests of accessor methods
  it('getId() returns ID', () => {
    chai.expect(testObj.getId()).to.equal(TEST_ID)
  })
  {{#each getterTests }}
  {{{ this }}}
  {{/each}}
  // Test validations
  {{#each validTests }}
  {{{ this }}}
  {{/each}}
  {{#each invalidTests }}
  {{{ this }}}
  {{/each}}
})
