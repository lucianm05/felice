import Select from '@lib/components/Select'

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
          { label: 'Tumblr', value: 'tumblr' },
          { label: 'TikTok', value: 'tiktok' },
        ]}
        placeholder='Social media'
        styles={{ activeOption: { outline: '1px solid red' } }}
      />
    </div>
  )
}

export default HelloWorld
