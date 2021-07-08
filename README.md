# React PIXI

Write [PIXI](http://www.pixijs.com/) applications using React declarative style 👌

## Install

    yarn add @paolotozzo/react-pixi

or

    npm install @paolotozzo/react-pixi --save

## Usage

#### With ReactDOM

```jsx
import { Stage, Sprite } from '@paolotozzo/react-pixi'

const App = () => (
  <Stage>
    <Sprite image="./bunny.png" x={100} y={100} />
  </Stage>
)
```

This example will render a [`PIXI.Sprite`](http://pixijs.download/release/docs/PIXI.Sprite.html) object into a
[Root Container](http://pixijs.download/release/docs/PIXI.Application.html#stage) of a
[`PIXI.Application`](http://pixijs.download/release/docs/PIXI.Application.html) on the page. The `Stage` object will
create a valid `<canvas />` element to render to.

#### Without ReactDOM

```jsx
import { render, Text } from '@paolotozzo/react-pixi'
import { Application } from 'pixi.js'

// Setup PIXI app
const app = new Application({
  width: 800,
  height: 600,
  backgroundColor: 0x10bb99,
  view: document.getElementById('container'),
})

// Use the custom renderer to render a valid PIXI object into a PIXI container.
render(<Text text="Hello World" x={200} y={200} />, app.stage)
```

# className attribute

With the introduction of the className attribute react-pixi supports the use of css files to style pixi components almost in the same way as you would do it for React HTML elements, which means that most of the PIXI properties can be defined in your own class selectors. Names of the class selectors need to be preceded by 'pixi'.

```css
pixi.header {
  x: 0;
  y: 0;
  alpha: 0.8;
}

 pixi.title {
  fontFamily: Arial;
  font-size: 36;
  font-style: italic; // both the pixi camel cased and css kebab cased style are supported
  fontWeight: bold;
  fill: ['#FF0000', '#FFFF00'];
  stroke: #FFFFFF;
  strokeThickness: 5;
  dropShadow: true;
  dropShadowColor: #000000;
  dropShadowBlur: 4;
  dropShadowDistance: 6;
  wordWrap: true;
  wordWrapWidth: 400;
}

pixi.clickable {
  alpha: 0.8;
  buttonMode: true;
}

// comma to separate multiple selectors with the same styles.
pixi.hidden, .hide {
  alpha: 0;
}

// same declarations get merged, and same rules override each other meaning that the last one wins

pixi.clickable {
  alpha: 1;
  interactive: true;
}
```

Then on your React component you could use them as follow:

```js
  <Container className='header'>
    <Text className='title' text='Welcome' />
  </Container>

```

or with the very convenient [classNames](https://github.com/JedWatson/classnames) library.

```js
  const btnClass = classNames({
      clickable: clickable,
      btn: true
  });
   <Container className={btnClass}>
```


Stylesheets can be imported directly in your component as usual (in this case you'll need to install `css-loader` and `style-loader` if you use a webpack build), as internal by using the `<style>` tag in the head, or even as an external stylesheet added as a link to the HTML main document (as long as the .css file is on the same domain of the html that loads it).


## Properties inside sub-objects

There are some properties that are inside sub-objects in PIXI, such as `.object.position.x`, `object.scale.y`, `object.skew.x`, and which are often used. In CSS, in order to be able to parse them you have to use the much easier format: `positionX`, `positionY`, `scaleX`, `scaleY`.
Other properties affected are `skew`,`pivot`,`anchor`,`tilePosition` and `tileScale`.

Note also that `rotation` can be written in degress, not in radians.

## !important rule

Same as Dom CSS, inline set props have the priority over the ones defined on the stylesheet, unless they contain the `!important` clause, in this case they would override it.

```css
pixi.header {
  x: 0;
  y: 0;
  ..
  alpha: 0.8 !important;
}
```

```js
  //alpha will be overriden onl
  <Container x={10} y={10} alpha={1}>
```

## Media queries

To use different rules for different devices mediaqueries are also supported


```css

@media (min-width: 1024px) {
  pixi.header {
    visible: false;
  }
}
```

## CSS Animations

Very conveniently you can also define animations for your PIXI components with CSS. This feature requires the use of [gsap](https://greensock.com/gsap/) as a project dependency.


```css
@keyframes fromtoptobottom {
  from {
    y: 0;
  }
  to {
    y: 590;
  }
}

@keyframes aroundthescreen {
  0% {
    x:0;
  }
  25% {
    x: 400;
  }
  50% {
    y: 400;
  }
  75% {
    x: 0;
  }
  100% {
    y: 0;
  }
}


pixi.from-top-to-bottom {
  animation-name: fromtoptobottom;
  animation-duration: 1000;
  animation-delay: 1000;
}

pixi.around-the-screen {
  animation-name: aroundthescreen;
  animation-duration: 2000;
  animation-delay: 2000;
}

```


### 'animationEnd' event

All components that use a class that is triggering a css animation call an `animationEnd` event once the animation has finished. This is true also for the classes that have `animation-direction` set as 'reverse', whereas the ones with `animation-iteration-count` set as 'infinite' never call `animationEnd`


```js
  <Container className='around-the-screen' animationEnd={this.handleAnimationEnd} />
```


### Differences with actual CSS animations

- The `animation` shorthand property is currently not supported, therefore each animation params need to be declared with its own property.
- Almost all animation parameters are supported, with the exception of the `animation-fill-mode` which is currently ignored and behaves as it would do if set as `forwards`.
- Durations can be currently set only by using milliseconds, therefore css time format (2ms, 1s...) is not currently supported.
- To set the `animation-timing-function` refer to https://greensock.com/ease-visualizer/ as the Dom CSS predefined ones won't work. Example of valid values would be `animation-timing-function: Power1.easeOut` or `Elastic.easeIn`


## CSS Transitions

Together with CSS animations, also CSS transitions can be used.

```css
pixi.movable {
 transition-property: x, y;
 transition-duration: 1000;
 transition-timing-function: Circ.easeIn;
 x: 0;
}

pixi.moving {
 x: 500;
 y: 550;
}

```


In the same way as Dom CSS, also on react-pixi the element first needs to be set with the class that declares the transition properties, and then any ensuing other class that will be added and that will change the values of those properties will unleash the animations.


### 'transitionEnd' event

Same as Dom CSS animations, also components that are animated with transitions call a `transitionEnd` event once the animation has finished.


```js
  <Container className='around-the-screen' animationEnd={this.handleAnimationEnd} />
```


### Differences with actual CSS transitions

- The `transition` shorthand property is currently not supported, therefore each transition params need to be declared with its own property.
- Durations can be currently set only by using milliseconds, therefore css time format (2ms, 1s...) is not currently supported.
- To set the `transition-timing-function` refer to https://greensock.com/ease-visualizer/ as the css predefined ones won't work. Example of valid values would be `transition-timing-function: Power1.easeOut` or `Elastic.easeIn`

## getCSSBasedProps

`getCSSBasedProps` is a useful method that returns an object literal with all css properties that the className attribute has set. This allows to use the props in a more imperative way when needed. Examples of that is when using the `ref` attribute, or when setting the rules for the drawing API in the `Graphics` component such as follows.


```css
pixi.header {
  width: 1024;
  height: 100;
  background-color: 0x555555;
  z-index: 2;
  x: 0;
  y: 0;
}
```


```js
<Graphics className={'header'} draw={(graphics) => {
  const props = graphics.getCSSBasedProps()
  const {backgroundColor, x, y, width, height} = props
  graphics.beginFill(backgroundColor);
  graphics.drawRect(x, y, width, height);
  graphics.endFill();
}} />

```

## What is not supported (Yet)

The supports of the className attributes comes with a huge set of css feature immediately available, which will make the writing your PIXI application with React even more declarative, and many more are on the roadmap. But right now, of course, as the Dom CSS native implementation is huge, and not all of it is useful for the kind of applications that are built with PIXI, many of them are missing. Besides, as react-pixi supports also 'styled-components', it is already easy to write components with a great level of style encapsulation.

Following some Dom CSS features that are currently incomplete, different or totally missing.

### COMBINING SELECTORS

Currently the only selector supported, other than the **single class** one used in all examples above, is the **compounding multiple class selector**, meaning that you can also define your selector in this way:

```css
pixi.header.desktop {
  width: 1024;
  height: 100;
  background-color: 0x555555;
  z-index: 2;
  x: 0;
  y: 0;
}

pixi.title {
   fontFamily: Arial;
   font-size: 36;
}

pixi.white {
   fill: '#FFFFFF';
}

```

and then use them like this

```js
  <Container className='header desktop'>
    <Text className='title white' text='Welcome' />
  </Container>

```

Therefore all the other combining css selectors, such as **descendant, next sibling, etc.** are not supported. Also selecting by ID, or with pseudo selectors such us `:hover` is not yet offered.

### SPECIFICITY

CSS specificity between rules is not yet leveraged, therefore all CSS rules are interpreted with the same level of importance. The only levels of specificity which apply are:

- inline attributes prevail over the ones set with css classes
- `!important` prevail over the inline set attributes
- classes triggered by mediaquery matching prevail over the general ones, regardless of the `!important` clause.

## Custom Components

Currently the following Components are implemented by default:

- [Container](http://pixijs.download/release/docs/PIXI.Container.html)
- [ParticleContainer](http://pixijs.download/release/docs/PIXI.ParticleContainer.html)
- [Sprite](http://pixijs.download/release/docs/PIXI.Sprite.html)
- [TilingSprite](http://pixijs.download/release/docs/PIXI.TilingSprite.html)
- [Graphics](http://pixijs.download/release/docs/PIXI.Graphics.html)
- [SimpleMesh](http://pixijs.download/release/docs/PIXI.SimpleMesh.html)
- [SimpleRope](http://pixijs.download/release/docs/PIXI.SimpleRope.html)
- [Text](http://pixijs.download/release/docs/PIXI.Text.html)
- [BitmapText](http://pixijs.download/release/docs/PIXI.BitmapText.html)
- [NineSlicePlane](http://pixijs.download/release/docs/PIXI.NineSlicePlane.html)

You can easily add new components to your project:

`./components/Rectangle.js`

```jsx
import { Graphics } from 'pixi.js'
import { PixiComponent } from '@paolotozzo/react-pixi'

export default PixiComponent('Rectangle', {
  create: props => {
    return new Graphics()
  },
  didMount: (instance, parent) => {
    // apply custom logic on mount
  },
  willUnmount: (instance, parent) => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    const { fill, x, y, width, height } = newProps
    instance.clear()
    instance.beginFill(fill)
    instance.drawRect(x, y, width, height)
    instance.endFill()
  },
})
```

`App.js`

```jsx
import { Stage } from '@paolotozzo/react-pixi'
import Rectangle from './components/Rectangle'

export default () => (
  <Stage>
    <Rectangle x={100} y={100} width={500} height={300} fill={0xff0000} />
  </Stage>
)
```

**Props helper**

ReactPixi comes with a handy utility method `applyDefaultProps` that can help you applying
props directly to a PIXI primitive instance handling events, PIXI props and point-like values.

Here's an example to pass through every other DisplayObject props and handle prop `count` separately:

```jsx
import { Text } from 'pixi.js'
import { Stage, applyDefaultProps, PixiComponent } from '@paolotozzo/react-pixi'

export default PixiComponent('Counter', {
  create: ({ count }) => {
    return new Text(count.toString())
  },
  applyProps: (instance, oldProps, newProps) => {
    const { count, ...oldP } = oldProps
    const { count, ...newP } = newProps

    // apply rest props to PIXI.Text
    applyDefaultProps(instance, oldP, newP)

    // set new count
    instance.text = count.toString()
  },
})
```

## Access the `PIXI.Application` in child components

Consider this rotating bunny example:

`./components/RotatingBunny.jsx`

```jsx
import { Sprite } from '@paolotozzo/react-pixi'

class RotatingBunny extends React.Component {
  state = { rotation: 0 }

  componentDidMount() {
    this.props.app.ticker.add(this.tick)
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick)
  }

  tick = delta => {
    this.setState(({ rotation }) => ({
      rotation: rotation + 0.1 * delta,
    }))
  }

  render() {
    return <Sprite image="./bunny.png" rotation={this.state.rotation} />
  }
}
```

There are 2 ways of accessing the `PIXI.Application` instance.

1. Using `AppConsumer` and pass the instance via [render props](https://reactjs.org/docs/render-props.html):

`App.jsx`

```jsx
import { Stage, Container, AppConsumer } from '@paolotozzo/react-pixi'
import { RotatingBunny } from './components/RotatingBunny'

export default () => (
  <Stage>
    <Container>
      <AppConsumer>{app => <RotatingBunny app={app} />}</AppConsumer>
    </Container>
  </Stage>
)
```

2. Or use a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html):

`App.jsx`

```jsx
import { Stage, Container, withPixiApp } from '@paolotozzo/react-pixi'
import { RotatingBunny } from './components/RotatingBunny'

const BunnyWithApp = withPixiApp(RotatingBunny)

export default () => (
  <Stage>
    <Container>
      <BunnyWithApp />
    </Container>
  </Stage>
)
```

3. Use hooks API in Functional Components

`RotatingBunny.jsx`

```jsx
import { useApp } from '@paolotozzo/react-pixi'

function RotatingBunny(props) {
  const app = useApp()
  // app => PIXI.Application

  return (
    ...
  )
}
```

# Spine Component

The component implements the [pixi-spine plugin](https://github.com/pixijs/pixi-spine) which enables the Spine support, including some nice extra features to make easier to work with dynamic content with Spine.

```js
 class Pixie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animation: 'running'
    }
  }

  componentDidMount() {
    const loader = PixiLoader.shared;
    loader
        .add('pixie', 'public/spine/pixie.json')
        .load((ld, res) => {
          this.setState({
            resource: res.pixie.spineData
          })
        });
  }

  animationEnd = (event, track) => {
    console.log(event)
    console.log(track)
  }

  animationStart = (event, track) => {
    if(event.animation.name === 'jump') {
      this.setState(prevState => {
        return {
          animation: 'running'
        }
      })
    }
  }


  onclick = (el) => {
    this.setState({
      animation: 'jump'
    })
  }

  render() {
    const { resource, animation } = this.state
    return (
      <Stage width={1024} height={1024} resolution = {window.devicePixelRatio || 1} options={{ backgroundColor: 0x012b30}}>
         <Container x={520} y={500}>
           {resource && (
              <SpineContainer
                mixes={[{from: 'running', to: 'jump', time: 0.2}, {from: 'jump', to: 'running', time: 0.4}]}
                animations={[animation]}
                x={0}
                y={400}
                scale={0.5}
                pointerup={this.onclick}
                interactive
                buttonMode
                resource={spineData}
                events={
                  {
                    complete: this.animationEnd, // internal event
                    start: this.animationStart // internal event
                    halfwayJump: this.halfwayJump // custom timeline event
                  }
                 }>
                   <SpineContainer.Animation name={'jump'} play={false} track={0} />
                   <SpineContainer.Animation name={'running'} queue loop track={0} />
              </SpineContainer>
           )}
         </Container>
      </Stage>
    )
  }
}
```

## Specific props

The SpineContainer accepts all properties a PIXI `DisplayObject` does, and additionally the following ones which are used to actually control the component.

| Prop | Default Value | Description |
| ---- | ------------- | ----------- |
| spineData `object` |  | The resource spineData loaded with the pixi loader|
| autoPlay `boolean` | true | The animation starts as soon as added to the stage|
| width `number` |  | Width of the object in pixels|
| height `number` |  | height of the object in pixels|
| events `object` |  | All the animation events to listen to, whether they are the lifecycle ones or the ones emitted by the timelines [[see AnimationStateListener]](http://esotericsoftware.com/spine-api-reference#AnimationStateListener)|
| skin `text` |  | The skeleton's skin [[see Skin]](http://esotericsoftware.com/spine-api-reference#Skin)|
| speed `number` | 1 | The animation speed [[see timeScale]](http://esotericsoftware.com/spine-api-reference#AnimationState-timeScale)|
| mixes `array` |  | Array of objects containing all the crossfades between animations [[see mixes]](http://esotericsoftware.com/spine-api-reference#MixBlend)|
| animations `array` |  | Array of the animations on playing|




## Compound Components

In order to render and control the animation the following parts of the compound component will be used.

### Animation

It refers to the actual animations playable in the Spine object. See [[Animation]](http://esotericsoftware.com/spine-api-reference#Animation).


| Prop | Default Value | Description |
| ---- | ------------- | ----------- |
| name `string` |  | The name of the animation (mandatory as it indentifies the animation we want to associate with the component)|
| play `boolean` | true | If the animation is playing |
| trackTime `number` | 0 | The position in time the animation is. Default is the start time. [[see trackTime]](http://esotericsoftware.com/spine-api-reference#TrackEntry-trackTime)|
| timeScale `number` | 1 | The animation speed. Default is  1 [[see timeScale]](http://esotericsoftware.com/spine-api-reference#TrackEntry-timeScale)|
| animationEnd `number` |  | The ending time of the animation, default is its duration [[see animationEnd]](http://esotericsoftware.com/spine-api-reference#TrackEntry-animationEnd)|
| events `object` |  | The animation events to listen to, whether they are the lifecycle ones or the ones emitted by the timelines [[see AnimationStateListener]](http://esotericsoftware.com/spine-api-reference#AnimationStateListener)|
| track `number` |  | The track index for the animation playing [[see tracks]](http://esotericsoftware.com/spine-applying-animations#Tracks)|
| loop `boolean` |  |If the animation repeat after its duration|
| queue `boolean` |  |If we want the animation queued for late or played immediately replacing the current one [[see difference between Playback and Queuing]](http://esotericsoftware.com/spine-applying-animations/)|
| delay `number` | 0 | Delaying time of the animation playing|


```js
  <SpineContainer.Animation
    name={'jump'}
    play
    trackTime={2} // move to the 2th second of animation's duration
    timeScale={2} // play it twice as fast
    animationEnd={4} // end it at four seconds
    track={0} //
    events: {
      complete: this.animationEnd, // internal event
        start: this.animationStart // internal event
        halfwayJump: this.halfwayJump // custom timeline event
    }
    loop
    queue
    delay={1} // start the animation after one second
  />
```

### Slot

It refers to the Slot object. See [[Slot]](http://esotericsoftware.com/spine-api-reference#Slot).

A Slot component implements also a `Content` component, useful to add external elements to the Slot container, therefore making them inherit all the transformations the Slot goes through. In this way you can use Spine to define the animations and then use react-pixi to add content generate dynamically, such as texts or other react-pixi components.


```js
<SpineContainer.Slot name='txt_label_score'>
   <SpineContainer.Slot.Content>
     <Text text="Score" style={style} />
   </SpineContainer.Slot.Content>
</SpineContainer.Slot>
```

### Bone

It refers to the Bone object. See [[Bone]](http://esotericsoftware.com/spine-api-reference#Bone).

As well useful to position external elements using the bone world transform. Its properties can be also changed externally.


```js
<SpineContainer.Bone name={'position_score'} rotation={rotation}>
   <Text style={{fill:'#00ffcc'}} text="Score"  />
</SpineContainer.Bone>
```

## Imperative use

To access the full spine API the SpineContainer component makes available a `spineElement` prop, which, together with a `getSpineObject` which returns a reference to the `PIXI.spine` component, exposes also some useful methods to control the animations.

```js
import { Loader as PixiLoader } from 'pixi.js'
import spine from 'pixi-spine';

import {
  Stage, Container, SpineContainer
} from '@paolotozzo/react-pixi';

import React, { Component } from 'react';


class Pixie extends React.Component {
  constructor(props) {
    super(props)
    this.childRef = React.createRef()
    this.state = {
      animation: 'running'
    }
  }

  componentDidMount() {
    const loader = PixiLoader.shared;
    loader
        .add('pixie', 'public/spine/pixie.json')
        .load((ld, res) => {
          this.setState({
            spineData: res.pixie.spineData
          })
        });
  }

  animationEnd = (event, track) => {
    // once the animation end go back to the beginning
    const spine = this.childRef.current.spineElement.getSpineObject()
    const runningTrack = spine.spineData.findAnimation('running')
    runningTrack.trackTime = 0
  }

  render() {
    const { spineData, animation } = this.state
    return (
      <Stage width={1024} height={1024} resolution = {window.devicePixelRatio || 1} options={{ backgroundColor: 0x012b30}}>
         <Container>
           {spineData && (
              <SpineContainer
                ref={this.childRef}
                animations={[animation]}
                x={300}
                y={700}
                spineData={spineData}
                events={
                  {
                    complete: this.animationEnd
                  }
                 }>
                   <SpineContainer.Animation name={'running'} play loop track={0} />
              </SpineContainer>
           )}
         </Container>
      </Stage>
    )
  }
}
````



## API

### `<Stage />`

Renders [Root Container](http://pixijs.download/release/docs/PIXI.Application.html#stage) of a `PIXI.Application`.

Props:

- `width` the width of the renderers view, default `800`
- `height` the height of the renderers view, default `600`
- `onMount` a callback function for the created app instance
- `onUnMount` a callback function when the Stage gets unmounted
- `raf` use the internal PIXI ticker (requestAnimationFrame) to render the stage, default `true`
- `renderOnComponentChange` render stage when the Stage component updates. This is ignored if `raf` is `true`.
- `options` see [PIXI.Application options](http://pixijs.download/release/docs/PIXI.Application.html)

The Stage stores the created `PIXI.Application` instance to context, which can be accessed using a [Provider or a Higher
Order Component](#access-the-pixiapplication-in-child-components).

### Components

Pass component options as props, example:

```jsx
import { Sprite } from '@paolotozzo/react-pixi'

const MyComponent = () => <Sprite image=".image.png" x={100} y={200} />
```

The `image` prop here is a short-hand for [`PIXI.Sprite.from()`](http://pixijs.download/release/docs/PIXI.Sprite.html#.from):

```jsx
import { Sprite } from '@paolotozzo/react-pixi'

const texture = new PIXI.Sprite.fromImage('./image.png')

const MyComponent = () => <Sprite texture={texture} x={100} y={200} />
```

## Scripts

```bash
# compile umd & es builds
yarn build

# compile dev builds
yarn build:dev

# compile production builds
yarn build:prod

# watch development builds
yarn build:watch

# lint code
yarn eslint

# fix linting issues
yarn eslint --fix

# test
yarn test

# watch tests
yarn test:watch
```