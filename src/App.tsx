import { Accordion } from '@lib/components/accordion/Accordion'
import { Checkbox } from '@lib/components/checkbox/Checkbox'
import { Dialog } from '@lib/components/dialog/Dialog'
import { DialogRef } from '@lib/components/dialog/types'
import { Progress } from '@lib/components/progress/Progress'
import { RadioGroup } from '@lib/components/radio-group/RadioGroup'
import { Select } from '@lib/components/select/Select'
import { Slider } from '@lib/components/slider/Slider'
import { SliderValue } from '@lib/components/slider/types'
import { Switch } from '@lib/components/switch/Switch'
import { Tabs } from '@lib/components/tabs/Tabs'
import { Tooltip } from '@lib/components/tooltip/Tooltip'
import { TooltipTriggerRef } from '@lib/components/tooltip/types'
import { cn } from '@lib/utils'
import { useRef, useState } from 'react'
import classes from './test.module.css'

function App() {
  const [selectOpen, setSelectOpen] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(true)
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const [sliderValue, setSliderValue] = useState<SliderValue>([75, 100])
  const progressValues = {
    value: 120,
    min: 0,
    max: 150,
  }

  const sliderRef = useRef<HTMLDivElement | null>(null)

  const tooltipRef = useRef<TooltipTriggerRef>(null)

  const dialogRef = useRef<DialogRef>(null)

  return (
    <div className='App'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '16px',
          // margin: '16px 0',
        }}
      >
        <Select
          open={selectOpen}
          onOpenChange={setSelectOpen}
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
          classNames={{
            root: classes['select__root'],
            trigger: { default: classes['select__trigger'] },
            list: classes['select__list'],
            option: {
              default: classes['select__option'],
              active: classes['select__option-active'],
              selected: classes['select__option-selected'],
            },
          }}
          disabled
        />

        <Accordion
          data={{
            header: 'Test single accordion',
            content: 'This is a single accordion',
          }}
          indicator={({ indicatorProps }) => <span {...indicatorProps}>^</span>}
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
              render: ({
                rootProps,
                contentProps,
                headerProps,
                state,
                triggerProps,
              }) => (
                <div {...rootProps}>
                  <h2 {...headerProps}>
                    <button {...triggerProps}>
                      Accordion is now{' '}
                      {state.expanded ? 'expanded' : 'collapsed'}
                    </button>
                  </h2>

                  <div {...contentProps}>This is my accordion content</div>
                </div>
              ),
            },
            {
              header: 'Test multiple accordion',
              content: 'This is the second accordion',
            },
          ]}
        />

        <Accordion
          defaultValue={[1]}
          data={[
            {
              header: 'First accordion',
              content: 'First accordion content',
              classNames: {
                content: 'test',
                trigger: { default: 'test', expanded: 'trigger expanded' },
              },
            },
            {
              header: 'Second accordion',
              content: 'Second accordion content',
            },
          ]}
          type='single'
          classNames={{
            root: classes['accordion__root'],
            content: classes['accordion__content'],
            trigger: {
              default: classes['accordion__trigger'],
              expanded: classes['accordion__trigger-expanded'],
            },
          }}
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
              disabled: classes['switch-disabled'],
            },
            thumb: {
              default: classes['switch__thumb'],
              checked: classes['switch__thumb-checked'],
            },
          }}
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
            hideLabel
            label='Terms and conditions'
            classNames={{
              root: classes['checkbox-root'],
              checkbox: {
                default: classes['checkbox'],
                checked: classes['checkbox-checked'],
                unchecked: classes['checkbox-unchecked'],
                disabled: classes['checkbox-disabled'],
              },
            }}
            indicator={({ state }) => <span>{state.checked ? '✓' : '✗'}</span>}
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
          >
            {({ state: { checked } }) => <span>{checked ? '✓' : '✗'}</span>}
          </Checkbox>
        </div>

        <Progress
          label='Fetching data'
          {...progressValues}
          styles={{
            progressbar: {
              width: '10rem',
              height: '0.75rem',
              background: 'gray',
              borderRadius: '99999px',
            },
            indicator: {
              background: 'blue',
              borderRadius: '99999px',
            },
          }}
        >
          {/* {({ indicatorProps, state: { percentageValue } }) => {
            return (
              <div
                {...indicatorProps}
                style={{
                  width: `${percentageValue}%`,
                  background: 'blue',
                  height: '100%',
                  borderRadius: '99999px',
                }}
              ></div>
            )
          }} */}
        </Progress>

        <Slider
          labels={['Minimum price', 'Maximum price']}
          min={50}
          max={150}
          defaultValue={[75, 125]}
          step={5}
          multipleStep={15}
          classNames={{
            root: classes['slider-root-vertical'],
            track: classes['slider-track-vertical'],
            range: classes['slider-range-vertical'],
            thumb:
              classes['slider-thumb'] + ' ' + classes['slider-thumb-vertical'],
          }}
          orientation='vertical'
        />

        <Slider
          labels={['Minimum price', 'Maximum price']}
          min={50}
          max={150}
          // defaultValue={[75, 125]}
          step={5}
          multipleStep={15}
          classNames={{
            root: classes['slider-root-vertical'],
            track: classes['slider-track-vertical'],
            range: classes['slider-range-vertical'],
            thumb:
              classes['slider-thumb'] + ' ' + classes['slider-thumb-vertical'],
          }}
          orientation='vertical'
        />

        <Slider
          labels={['Minimum price', 'Maximum price']}
          min={50}
          max={150}
          // defaultValue={[75, 125]}
          step={5}
          multipleStep={15}
          classNames={{
            root: classes['slider-root'],
            track: classes['slider-track'],
            range: classes['slider-range'],
            thumb: classes['slider-thumb'],
          }}
        />

        <Slider
          labels={['Minimum price', 'Maximum price']}
          min={50}
          max={150}
          defaultValue={[75, 125]}
          step={5}
          multipleStep={15}
          classNames={{
            root: classes['slider-root'],
            track: classes['slider-track'],
            range: classes['slider-range'],
            thumb: classes['slider-thumb'],
          }}
        />

        <Tabs
          orientation='vertical'
          label='User panels'
          data={[
            {
              element: 'Settings',
              panel: <div>User settings</div>,
              elementProps: { onClick: event => event.preventDefault() },
            },
            {
              element: 'Account information',
              panel: <>Account information</>,
            },
            {
              element: 'My orders',
              panel: (
                <div>
                  <Tooltip
                  defaultOpen
                    side='right'
                    content={<div>Here the user orders are displayed</div>}
                  >
                    User orders
                  </Tooltip>
                </div>
              ),
            },
          ]}
          classNames={{
            root: classes['tabs-root'],
            element: classes['tabs-element'],
            panel: classes['tabs-panel'],
            tablist: classes['tabs-tablist'],
          }}
        />

        {/* <Tabs
          id='user-actions'
          data={[
            {
              element: 'Settings',
              panel: <div>User settings</div>,
              elementProps: {
                onClick: event => event.preventDefault(),
                disabled: true,
                className: 'test1',
              },
            },
            {
              element: 'Account information',
              panel: <>Account information</>,
            },
            {
              element: 'My orders',
              panel: (
                <div>
                  <div>User orders</div>

                  <Tabs
                    data={[
                      { element: 'Order 1', panel: <div>Order 1 </div> },
                      { element: 'Order 2', panel: <div>Order 2 </div> },
                      {
                        element: 'Order 3',
                        panel: (
                          <div>
                            Order 3
                            <Tooltip content={<div>Tooltip content</div>}>
                              Test
                            </Tooltip>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
          classNames={{
            root: cn(classes['tabs-root-vertical']),
            element: {
              default: classes['tabs-element'],
              selected: classes['tabs-element-selected'],
              disabled: classes['tabs-element-disabled'],
            },
            panel: classes['tabs-panel'],
            tablist: classes['tabs-tablist-vertical'],
          }}
          orientation='vertical'
        /> */}

        <RadioGroup
          label='Select payment method'
          data={[
            {
              label: 'Card',
              value: 'card',
              description: 'Card payment for faster processing',
              disabled: true,
            },
            {
              label: 'Cash',
              value: 'cash',
              description: 'Cash payment',
            },
            {
              label: 'Trade',
              value: 'trade',
              description:
                'In case you dont have money but have something to give',
            },
            {
              value: 'another_option',
              label: 'Another option',
              description: 'Another option which is not supported',
              // render: ({ state, buttonProps, rootProps, labelProps }) => {
              //   return (
              //     <div {...rootProps} className=''>
              //       <button {...buttonProps} className=''>
              //         {state.checked ? 'checked' : 'unchecked'}
              //       </button>

              //       <label {...labelProps} className=''>
              //         whatever
              //       </label>
              //     </div>
              //   )
              // },
            },
          ]}
          classNames={{
            root: classes['radio-group'],
            radioButton: {
              root: {
                default: classes['radio-button__root'],
                checked: classes['radio-button__root-checked'],
                unchecked: classes['radio-button__root-unchecked'],
                disabled: classes['radio-button__root-disabled'],
              },
              button: {
                default: classes['radio-button'],
                checked: classes['radio-button-checked'],
                unchecked: classes['radio-button-unchecked'],
                disabled: classes['radio-button-disabled'],
              },
              description: classes['radio-button__description'],
              label: classes['radio-button__label'],
              textContainer: classes['radio-button__text-container'],
            },
          }}
          orientation='vertical'
        />

        {/* <div
          style={{
            display: 'flex',
            padding: '10rem',
            flexDirection: 'column',
            rowGap: '2rem',
          }}
        >
          <Tooltip
            content={<>My tooltip content</>}
            side='right'
            sideOffset={8}
            classNames={{
              trigger: classes['tooltip-trigger'],
              content: classes['tooltip-content'],
            }}
            // open
            delay={0}
          >
            My tooltip
          </Tooltip>

          <Tooltip
            ref={tooltipRef}
            delay={300}
            content={<>My tooltip with custom trigger</>}
            side='bottom'
            classNames={{
              content: classes['tooltip-content'],
              container: classes['tooltip-container'],
            }}
          >
            {({ triggerProps, state: { open } }) => {
              return (
                <button {...triggerProps}>
                  My tooltip is {open ? 'open' : 'closed'}
                </button>
              )
            }}
          </Tooltip>
        </div> */}

        <Dialog
          ref={dialogRef}
          classNames={{
            root: classes['dialog'],
            header: classes['dialog__header'],
            // overlay: classes['dialog__overlay'],
            title: classes['dialog__title'],
            description: classes['dialog__description'],
            closeButton: classes['dialog__close-button'],
            trigger: classes['dialog__trigger'],
          }}
          title='Add your shipping info'
          description='Fill the details below to proceed with your order'
          // closeButton={'X'}
          content={({ actions }) => (
            <form className={classes['dialog__content']}>
              <input type='text' placeholder='Full name' name='name' />

              <input type='text' placeholder='Address' name='address' />

              <input type='text' placeholder='City' name='city' />

              <button
                type='submit'
                onClick={event => {
                  event.preventDefault()
                  actions.close()
                }}
              >
                Save Address
              </button>
            </form>
            // <>
            //   <p>My dialog has only text</p>
            //   <div>And divs</div>
            //   <div>Keep the focus inside, if you can</div>
            // </>
          )}
          // render={({
          //   descriptionProps,
          //   rootProps,
          //   titleProps,
          //   overlayProps,
          //   actions,
          // }) => (
          //   <>
          //     <button {...overlayProps}></button>
          //     <div {...rootProps}>
          //       <h2 {...titleProps}>My own dialog</h2>

          //       <p {...descriptionProps}>My own description</p>

          //       <form className={classes['dialog__content']}>
          //         <input type='text' placeholder='Full name' name='name' />

          //         <input type='text' placeholder='Address' name='address' />

          //         <input type='text' placeholder='City' name='city' />

          //         <button
          //           type='submit'
          //           onClick={event => {
          //             event.preventDefault()
          //             actions.close()
          //           }}
          //         >
          //           Save Address
          //         </button>
          //       </form>
          //     </div>
          //   </>
          // )}
        >
          {/* Add your shipping info */}
          {({ state, triggerProps }) => (
            <button {...triggerProps}>
              {state.open && 'Adding shipping info...'}
              {!state.open && 'Add your shipping info'}
            </button>
          )}
        </Dialog>
      </div>
    </div>
  )
}

export default App
