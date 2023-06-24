import Accordion from '@lib/components/accordion/Accordion'
import Select from '@lib/components/select/Select'
import Switch from '@lib/components/switch/Switch'
import { useState } from 'react'

function App() {
  const [checked, setChecked] = useState(true)

  return (
    <div className='App'>
      <Select
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
        styles={{
          root: {
            border: '1px solid red',
            width: 'max-content',
          },
          activeOption: {
            color: 'red',
          },
          selectedOption: {
            color: 'blue',
          },
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '16px',
          margin: '16px 0',
        }}
      >
        <Accordion
          data={{
            header: 'Test single accordion',
            content: 'This is a single accordion',
          }}
          indicator={<span>^</span>}
          styles={{
            indicator: {
              collapsed: {
                transform: 'rotate(180deg)',
              },
            },
          }}
        />

        <Accordion
          data={[
            {
              header: 'Test multiple accordion',
              content: 'This is the first accordion',
            },
            {
              header: 'Test multiple accordion',
              content: 'This is the second accordion',
            },
          ]}
        />

        <Switch
          label='Lights switch'
          styles={{
            switch: {
              width: '2rem',
              borderRadius: '16px',
              padding: '0.125rem',
              cursor: 'pointer',
              transition: 'all 100ms ease-in-out',
              checked: {
                background: 'blue',
              },
              unchecked: {
                background: 'gray',
              },
            },
            thumb: {
              width: '1rem',
              height: '1rem',
              background: 'white',
              borderRadius: '99999px',
              transition: 'transform 100ms ease-in-out',
              checked: {
                transform: 'translateX(calc(100% - 0.25rem))',
              },
            },
          }}
          checked={checked}
          onCheckedChange={checked => {
            setChecked(checked)
          }}
        />

        <button type='button' onClick={() => setChecked(prev => !prev)}>
          change switch
        </button>
      </div>
    </div>
  )
}

export default App
