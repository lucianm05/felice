import { Accordion } from '@lib/components/accordion/Accordion'
import { Checkbox } from '@lib/components/checkbox/Checkbox'
import { Progress } from '@lib/components/progress/Progress'
import { Select } from '@lib/components/select/Select'
import { Switch } from '@lib/components/switch/Switch'
import { Slider } from '@lib/components/slider/Slider'
import { useRef, useState } from 'react'
import classes from './test.module.css'

function App() {
  const [switchChecked, setSwitchChecked] = useState(true)
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const progressValues = {
    value: 75,
    min: 0,
    max: 150,
  }

  const sliderRef = useRef<HTMLDivElement | null>(null)

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

        {/* <div style={{ marginBottom: '8rem' }}></div> */}

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

        <div
          style={{
            marginLeft: '10rem',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '0.5rem',
            marginTop: '8rem',
          }}
        >
          <Checkbox
            label='Terms and conditions'
            classNames={{
              checkbox: {
                default: classes['checkbox'],
                checked: classes['checkbox-checked'],
                unchecked: classes['checkbox-unchecked'],
              },
            }}
            indicator={{ checked: <span>✓</span>, unchecked: <span>✗</span> }}
          />

          <Checkbox
            label='Terms and conditions'
            classNames={{
              checkbox: {
                default: classes['checkbox'],
                checked: classes['checkbox-checked'],
                unchecked: classes['checkbox-unchecked'],
              },
            }}
            checked={checkboxChecked}
            onCheckedChanged={setCheckboxChecked}
          >
            {checkboxChecked && <span>✓</span>}
            {!checkboxChecked && <span>✗</span>}
          </Checkbox>
        </div>

        <Progress
          label='Fetching data'
          {...progressValues}
          styles={{
            root: {
              width: '10rem',
              height: '0.75rem',
              background: 'gray',
              borderRadius: '99999px',
            },
            indicator: {
              width: `${
                ((progressValues.value - progressValues.min) * 100) /
                (progressValues.max - progressValues.min)
              }%`,
              height: '100%',
              background: 'blue',
              borderRadius: '99999px',
            },
          }}
        ></Progress>

        <Slider
          ref={sliderRef}
          labels={['Minimum price', 'Maximum price']}
          classNames={{
            root: classes['slider-root'],
            track: classes['slider-track'],
            range: classes['slider-range'],
            thumb: classes['slider-thumb'],
          }}
        />
      </div>
    </div>
  )
}

export default App
