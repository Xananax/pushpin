import React from 'react'
import PropTypes from 'prop-types'
import { remote } from 'electron'
import Debug from 'debug'

import Loop from '../loop'
import ContentTypes from '../content-types'

// we should make the avatar image a proper ImageCard
import { IMAGE_DIALOG_OPTIONS } from '../constants'
import Content from './content'

const { dialog } = remote
const log = Debug('pushpin:settings')

export default class Settings extends React.PureComponent {
  constructor() {
    super()
    this.chooseAvatar = this.chooseAvatar.bind(this)
    this.setName = this.setName.bind(this)
  }

  chooseAvatar() {
    // TODO: Images only update on refresh sometimes
    dialog.showOpenDialog(IMAGE_DIALOG_OPTIONS, (paths) => {
      // User aborted.
      if (!paths) {
        return
      }
      if (paths.length !== 1) {
        throw new Error('Expected exactly one path?')
      }
      const path = paths[0]
      const docId = Content.initializeContentDoc('image', { path })
      this.props.onChange(d => d.avatarDocId = docId)
    })
  }

  setName(e) {
    this.props.onChange(d => d.name = e.target.value)
  }

  render() {
    let avatar
    if (this.props.doc.avatarDocId) {
      avatar = <Content card={{ type: 'image', docId: this.props.doc.avatarDocId }} />
    } else {
      avatar = <img alt="avatar" src="../img/default-avatar.png" />
    }

    return (
      <div className="PopOverWrapper">
        <div className="ListMenu">
          <div className="ListMenu__header">
            <p className="Type--header">Your Profile</p>
          </div>
          <div className="ListMenu__section">
            <div className="ListMenu__label">Display Name</div>
            <div className="ListMenu__item">
              <input type="text" onChange={this.setName} defaultValue={this.props.doc.name} />
            </div>
            <div className="ListMenu__label">Avatar</div>
            <div className="ListMenu__item">
              <div className="ListMenu__thumbnail">
                <div className="Avatar">
                  <img src={this.props.avatar} />
                </div>
              </div>
              <div className="Label">
                <a className="Type--action" onClick={this.chooseAvatar}>Choose from file...</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ContentTypes.register({
  component: Settings,
  type: 'settings',
  name: 'Settings',
  icon: 'sticky-note',
  unlisted: true,
})
