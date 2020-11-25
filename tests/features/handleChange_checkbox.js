import flushPromises from 'flush-promises'
import { createForm, findAllComponents } from 'test-helpers'
import { nextTick } from 'vue'

export const handleChange = function (elementType, elementName, options) {
  it('should set model on change', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let input = elWrapper.get(`input[type="${options.fieldType}"]`)

    input.element.checked = true
    input.trigger('change')

    expect(el.model).toBe(true)
  })

  it('should dirt the element if input value is different than the current', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let input = elWrapper.get(`input[type="${options.fieldType}"]`)

    expect(el.dirty).toBe(false)

    input.element.checked = true
    input.trigger('change')

    expect(el.dirty).toBe(true)
  })

  it('should not dirt the element on if input value is not different than the current', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          default: options.value || true,
        }
      }
    })

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let input = elWrapper.get(`input[type="${options.fieldType}"]`)

    expect(el.dirty).toBe(false)

    input.element.checked = true
    input.trigger('change')

    expect(el.dirty).toBe(false)
  })

  it('should trigger "change" event if value changed', () => {
    let onChangeMock = jest.fn()

    let form = createForm({
      schema: {
        el: {
          type: elementType,
          onChange: onChangeMock
        }
      }
    })

    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let input = elWrapper.get(`input[type="${options.fieldType}"]`)

    input.element.checked = true
    input.trigger('change')

    expect(onChangeMock).toHaveBeenCalled()
  })

  it('should not trigger "change" event if value not changed', () => {
    let onChangeMock = jest.fn()

    let form = createForm({
      schema: {
        el: {
          type: elementType,
          onChange: onChangeMock,
          default: options.value || true,
        }
      }
    })
    
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let input = elWrapper.get(`input[type="${options.fieldType}"]`)

    input.element.checked = true
    input.trigger('change')

    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it('should trigger validation on if validateOn contains "change"', async () => {
    let form = createForm({
      validateOn: 'submit',
      schema: {
        el: {
          type: elementType,
          rules: 'required',
        }
      }
    })

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let input = elWrapper.get(`input[type="${options.fieldType}"]`)

    input.element.checked = true
    input.trigger('change')

    await flushPromises()

    expect(el.validated).toBe(false)

    input.element.checked = false

    form.vm.validateOn = 'submit|change'

    input.element.checked = true
    input.trigger('change')

    await flushPromises()

    expect(el.validated).toBe(true)
  })
}