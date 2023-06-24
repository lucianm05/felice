import Accordion from '@lib/components/accordion/Accordion'
import Checkbox from '@lib/components/checkbox/Checkbox'
import Select from '@lib/components/select/Select'
import Switch from '@lib/components/switch/Switch'
import { useState } from 'react'
import classes from './test.module.css'

function App() {
  const [switchChecked, setSwitchChecked] = useState(true)
  const [checkboxChecked, setCheckboxChecked] = useState(true)

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

        <div style={{ marginBottom: '8rem' }}></div>

        <Switch
          label='Marketing e-mails'
          style={{ marginLeft: '5rem' }}
          classNames={{
            switch: {
              default: classes['switch'],
              checked: classes['switch-checked'],
              unchecked: classes['switch-unchecked'],
            },
            thumb: {
              default: classes['switch__thumb'],
              checked: classes['switch__thumb-checked'],
            },
          }}
          checked={switchChecked}
          onCheckedChange={setSwitchChecked}
        />

        {/* <button type='button' onClick={() => setChecked(prev => !prev)}>
          change switch
        </button> */}

        <Checkbox
          label='Terms and conditions'
          style={{
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            checked: { background: 'blue' },
            unchecked: { background: 'gray' },
          }}
          className={{
            default: 'checkbox',
            checked: 'checkbox-checked',
            unchecked: 'checkbox-unchecked',
          }}
          // indicator={{ checked: '✓', unchecked: '✗' }}
          checked={checkboxChecked}
          onCheckedChanged={setCheckboxChecked}
        >
          {checkboxChecked && '✓'}
          {!checkboxChecked && '✗'}
        </Checkbox>
      </div>
    </div>
  )
}

export default App
