/* test-state-{{ name }}.js - Tests {{ name }} state */
import { describe, it, beforeEach } from 'mocha'
import chai from 'chai'
import {{name}} from '../src/state/{{ name }}'
import { {{name}}Service } from '../src/state/OrimServices'
import { defaultVerbs } from 'redux-immutable-model'
import { defaultState } from './TestData'

const TEST_ID = {{{ exampleId }}}
const TCLASS = {{ name }}
const TSERVICE = {{ name }}Service

describe('{{ name }}: testing RimObject actions', () => {
  beforeEach(() => {
    TSERVICE.setState(defaultState.get(TSERVICE.getStatePath()))
  })
  {{#if hasName }}it('new returns an empty object', () => {
    let myObj = new TCLASS()
    chai.expect(myObj.getName()).to.equal('')
  }){{/if}}
  it('can create an object that is already dirty', () => {
    let myObj = new TCLASS({}, true)
    chai.expect(myObj.isDirty()).to.be.true
  })
  it('can create an object that is already fetching', () => {
    let myObj = new TCLASS({}, false, true)
    chai.expect(myObj.isFetching()).to.be.true
  })
  it('can create an object that is already new', () => {
    let myObj = new TCLASS({}, false, false, true)
    chai.expect(myObj.isNew()).to.be.true
  })
  let testObj = TSERVICE.getById(TEST_ID)
  // Basic tests of accessor methods
  it('getId() returns ID', () => {
    chai.expect(testObj.getId()).to.equal(TEST_ID)
  })
  {{#each getterTests }}
  {{{ this }}}
  {{/each}}
  // Test validators - valid data
  {{#each validTests }}
  {{{ this }}}
  {{/each}}
  // Test validators - invalid data
  {{#each invalidTests }}
  {{{ this }}}
  {{/each}}
  // Test get create payload
  {{{ getCreatePayload }}}
  // Test get update payload
  {{{ getUpdatePayload }}}
})
