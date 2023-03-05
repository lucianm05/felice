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
      />
    </div>
  )
}

export default HelloWorld
