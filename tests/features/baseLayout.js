import { nextTick } from 'vue'
import { defineComponent, markRaw } from 'composition-api'
import { createForm, findAllComponents, createElement } from 'test-helpers'

export default function baseLayout(elementType) {
  const elementName = `${_.upperFirst(elementType)}Element`

  return () => {
    // Template
    it('should render element in `BaseElementLayout`', async () => {
      let form = createForm({
        schema: {
          el: {
            type: elementType,
          }
        }
      })

      let el = findAllComponents(form, { name: elementName }).at(0)
      let BaseElementLayout = findAllComponents(el, { name: 'BaseElementLayout' })

      expect(BaseElementLayout.length).toBe(1)
    })

    it('should use custom `BaseElementLayout` if it is defined in `components`', () => {
      let form = createForm({
        schema: {
          el: {
            type: elementType,
            components: {
              BaseElementLayout: markRaw(defineComponent({
                name: 'CustomBaseElementLayout',
                render(h) {
                  return createElement(h, 'div', 'hello')
                }
              }))
            }
          }
        }
      })

      let el = findAllComponents(form, { name: elementName }).at(0)
      let BaseElementLayout = findAllComponents(el, { name: 'BaseElementLayout' })
      let CustomBaseElementLayout = findAllComponents(el, { name: 'CustomBaseElementLayout' })

      expect(BaseElementLayout.length).toBe(0)
      expect(CustomBaseElementLayout.length).toBe(1)
    })

    it('should use custom `BaseElementLayout` if it is defined in `components` after render', async () => {
      let form = createForm({
        schema: {
          el: {
            type: elementType,
          }
        }
      })

      let el = findAllComponents(form, { name: elementName }).at(0)

      el.vm.components = {
        BaseElementLayout: markRaw(defineComponent({
          name: 'CustomBaseElementLayout',
          render(h) {
            return createElement(h, 'div', 'hello')
          }
        }))
      }

      await nextTick()

      let BaseElementLayout = findAllComponents(el, { name: 'BaseElementLayout' })
      let CustomBaseElementLayout = findAllComponents(el, { name: 'CustomBaseElementLayout' })

      expect(BaseElementLayout.length).toBe(0)
      expect(CustomBaseElementLayout.length).toBe(1)
    })
  }
}