import { Story } from '@storybook/react'
import 'twin.macro'

import Select, { SelectProps } from '.'

const Template: Story<SelectProps> = args => <Select {...args} />

const Default = Template.bind({})
Default.args = {
  multiple: true,
  options: [
    { key: '1', value: 'apple' },
    { key: '2', value: 'banana' },
    { key: '3', value: 'pineapple' }
  ]
}

export default {
  component: Select,
  title: 'components/shared/select'
}

export { Default }
