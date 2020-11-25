import { createForm, findAllComponents } from 'test-helpers'

export const Text = function (elementType, elementName, options) {
  it('should add `name` attribute to input', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = findAllComponents(form, { name: elementName }).at(0)

    expect(el.find('input').attributes('name')).toBe('el')
  })

  describe('Classes feature', () => {
    it('should set default `input` class on `input`', () => {
      let form = createForm({
        schema: {
          el: {
            type: elementType,
          }
        }
      })

      let el = form.vm.el$('el')
      let elWrapper = findAllComponents(form, { name: elementName }).at(0)

      expect(elWrapper.find('input').classes(el.defaultClasses.input)).toBe(true)
    })

    it('should set default `inputContainer` class on field wrapper if it has addon', () => {
      let form = createForm({
        schema: {
          el: {
            type: elementType,
            addons: {
              before: '$'
            }
          }
        }
      })

      let el = form.vm.el$('el')
      let elWrapper = findAllComponents(form, { name: elementName }).at(0)

      expect(elWrapper.find('input').element.parentElement.className.split(' ').indexOf(el.defaultClasses.inputContainer) !== -1).toBe(true)
    })

    it('should not set default `inputContainer` class on field wrapper if it does not have addon', () => {
      let form = createForm({
        schema: {
          el: {
            type: elementType,
          }
        }
      })

      let el = form.vm.el$('el')
      let elWrapper = findAllComponents(form, { name: elementName }).at(0)

      expect(elWrapper.find('input').element.parentElement.className.split(' ').indexOf(el.defaultClasses.inputContainer) === -1).toBe(true)
    })
  })
}