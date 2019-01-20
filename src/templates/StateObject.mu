/* {{ name }}.js - State class for {{ name }} model objects */
import Orim{{ name }} from './orim/Orim{{ name }}'

export default class {{ name }} extends Orim{{name}} {
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }
}
