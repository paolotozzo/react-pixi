import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SpineContext from './SpineContext'

const updateBone = (props, context, childRef) => {
  const { name, children, attachment, ...rest } = props
  const { spineElement } = context

  const { skeleton } = spineElement.getSpineObject()
  const bone = skeleton.findBone(name)

  Object.keys(rest).forEach(prop => {
    bone[prop] = rest[prop]
  })

  if (childRef.current) {
    const container = childRef.current.spineElement ? childRef.current.spineElement.getSpineObject() : childRef.current
    container.x = Math.abs(bone.x)
    container.y = Math.abs(bone.y)
    container.scale.x = bone.scaleX
    container.scale.y = bone.scaleY
    container.rotation = bone.rotation
  }
}

class Bone extends Component {
  static contextType = SpineContext

  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }

  constructor(props) {
    super(props)
    this.childRef = React.createRef()
  }

  componentDidMount() {
    updateBone(this.props, this.context, this.childRef)
  }

  componentDidUpdate() {
    updateBone(this.props, this.context, this.childRef)
  }

  render() {
    const { name, children } = this.props
    return (
      <SpineContext.Consumer>
        {() => {
          if (name) {
            if (children) {
              const ChildComponentWithRef = React.forwardRef((props, ref) =>
                React.cloneElement(children, {
                  ...props,
                  ref,
                })
              )
              ChildComponentWithRef.displayName = 'BoneWrapper'
              return <ChildComponentWithRef ref={this.childRef} />
            }
          }
          return null
        }}
      </SpineContext.Consumer>
    )
  }
}
export default Bone
