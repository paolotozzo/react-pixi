import { Container as PixiContainer } from 'pixi.js'

const Spine = (root, props) => {
  const { autoPlay = true, animations = [], animationEnd, spineElement, skin } = props

  let container = spineElement.getSpineObject()

  if (autoPlay) {
    spineElement.play()
  }

  return container
}

export default Spine
