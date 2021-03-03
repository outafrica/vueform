import { createForm } from 'test-helpers'
import flushPromises from 'flush-promises'

export { data, filtered, clear, } from './data'

export const load = function (elementType, elementName, options) {
  it('should set string value on `load` according to loadFormat', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          loadFormat: 'DD-MM-YYYY',
        }
      }
    })

    let el = form.vm.el$('el')

    el.load('20-11-2020')
    expect(el.value).toBe('2020-11-20')
  })

  it('should set Date instance on `load`', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')

    el.load(moment('20-11-2020', 'DD-MM-YYYY').toDate())
    expect(el.value).toStrictEqual('2020-11-20')
  })

  it('should throw an error on `load` when value not being provided according to loadFormat', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          loadFormat: 'DD-MM-YYYY'
        }
      }
    })

    let el = form.vm.el$('el')

    expect(() => {
      el.load('2020-11-20')
    }).toThrowError()

    expect(() => {
      el.load('20-11-2020')
    }).not.toThrowError()
  })

  it('should should format data if "formatLoad" is set on `load`', async () => {
    let formatLoadMock = jest.fn()

    let form = createForm({
      schema: {
        el: {
          type: elementType,
          formatLoad(value) {
            formatLoadMock()

            return value
          }
        }
      }
    })

    let el = form.vm.el$('el')

    el.load(options.value, true)

    expect(formatLoadMock).toHaveBeenCalled()
  })
}

export const update = function (elementType, elementName, options) {
  it('should set value on `update`', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')

    el.update(options.value)

    expect(el.value).toBe(options.value)
  })
}

export const reset = function (elementType, elementName, options) {
  it('should set value to default on `reset`', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          default: options.value,
        }
      }
    })

    let el = form.vm.el$('el')

    el.update(null)

    el.reset()

    expect(el.value).toStrictEqual(options.value)
  })

  it('should reset validators on `reset`', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          rules: 'required'
        }
      }
    })

    let el = form.vm.el$('el')

    el.validate()

    await flushPromises()

    el.reset()

    expect(el.validated).toBe(false)
    expect(el.invalid).toBe(false)
  })
}