import Select from '@lib/Select'

const HelloWorld = () => {
  return (
    <div>
      <Select
        id='preferred-social-media'
        label='Preferred social media'
        data={[
          { label: 'Facebook', value: 'facebook' },
          { label: 'Instagram', value: 'instagram' },
          { label: 'YouTube', value: 'youtube' },
          { label: 'Reddit', value: 'reddit' },
          { label: 'Twitter', value: 'twitter' },
        ]}
        placeholder='Social media'
        renderTrigger={(props, selectedOption) => (
          <button {...props}>
            {selectedOption?.label || 'Social media'} <b>&darr;</b>
          </button>
        )}
        renderOption={(props, { label, value }) => (
          <li {...props}>
            {label} - {value}
          </li>
        )}
      />

      <button>test</button>
    </div>
  )
}

export default HelloWorld
